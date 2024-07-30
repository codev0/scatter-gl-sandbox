/*
@license
Copyright 2019 Google LLC. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/

import * as THREE from 'three';
import {ScatterPlotVisualizer} from './scatter_plot_visualizer';
import {CameraType, RenderContext} from './render';
import {BoundingBox, CollisionGrid} from './label';
import {Styles} from './styles';
import * as util from './util';

const MAX_LABELS_ON_SCREEN = 10000;

/**
 * Creates and maintains a 2d canvas on top of the GL canvas. All labels, when
 * active, are rendered to the 2d canvas as part of the visible render pass.
 */
export class ScatterPlotVisualizerCanvasImages
  implements ScatterPlotVisualizer {
  public id = 'CANVAS_IMAGES';

  private worldSpacePointPositions = new Float32Array(0);
  private gc: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private labelsActive: boolean = true;

  constructor(container: HTMLElement, private styles: Styles) {
    this.canvas = document.createElement('canvas');
    container.appendChild(this.canvas);

    this.gc = this.canvas.getContext('2d')!;
    this.canvas.style.position = 'absolute';
    this.canvas.style.left = '0';
    this.canvas.style.top = '0';
    this.canvas.style.pointerEvents = 'none';
  }

  private removeAllImages() {
    const pixelWidth = this.canvas.width * window.devicePixelRatio;
    const pixelHeight = this.canvas.height * window.devicePixelRatio;
    this.gc.clearRect(0, 0, pixelWidth, pixelHeight);
  }

  /** Render all of the non-overlapping visible labels to the canvas. */
  private makeImages(rc: RenderContext) {
    if (rc.images == null || rc.images.pointIndices.length === 0) {
      return;
    }
    if (this.worldSpacePointPositions == null) {
      return;
    }

    const irc = rc.images;

    const sceneIs3D: boolean = rc.cameraType === CameraType.Perspective;
    const imageHeight = 120;
    const imageWidth = 120;
    const dpr = window.devicePixelRatio;

    let grid: CollisionGrid;
    {
      const pixw = this.canvas.width * dpr;
      const pixh = this.canvas.height * dpr;
      const bb: BoundingBox = {loX: 0, hiX: pixw, loY: 0, hiY: pixh};
      grid = new CollisionGrid(bb, pixw / 25, pixh / 50);
    }

    const camPos = rc.camera.position;
    const camToTarget = camPos.clone().sub(rc.cameraTarget);
    let camToPoint = new THREE.Vector3();

    // Have extra space between neighboring labels. Don't pack too tightly.
    const imageMargin = 2;
    // Shift the label to the right of the point circle.
    const xShift = -60;
    const yShift = -140;

    const n = Math.min(MAX_LABELS_ON_SCREEN, irc.pointIndices.length);
    for (let i = 0; i < n; ++i) {
      const imageId = irc.imageIds[i];
      const img = document.getElementById(imageId) as HTMLImageElement;

      if (imageId && img) {
        let point: THREE.Vector3;
        {
          const pi = irc.pointIndices[i];
          point = util.vector3FromPackedArray(
            this.worldSpacePointPositions,
            pi
          );
        }

        // discard points that are behind the camera
        camToPoint.copy(camPos).sub(point);
        if (camToTarget.dot(camToPoint) < 0) {
          continue;
        }

        let [x, y] = util.vector3DToScreenCoords(
          rc.camera,
          rc.screenWidth,
          rc.screenHeight,
          point
        );
        x += xShift;
        y += yShift;

        // Computing the width of the font is expensive,
        // so we assume width of 1 at first. Then, if the label doesn't
        // conflict with other labels, we measure the actual width.
        const textBoundingBox: BoundingBox = {
          loX: x - imageMargin,
          hiX: x + 1 + imageMargin,
          loY: y,
          hiY: y,
        };

        if (grid.insert(textBoundingBox, true)) {
          // Now, check with properly computed width.
          textBoundingBox.hiX += imageWidth - 1;
          if (grid.insert(textBoundingBox)) {
            this.gc.lineWidth = 1;
            this.gc.strokeStyle = 'gray';
            this.gc.fillStyle = 'cloudywhite';
            this.gc.strokeRect(x, y, imageWidth, imageHeight);
            this.gc.drawImage(img, x, y, imageWidth, imageHeight);
          }
        }
      }
    }
  }

  onResize(newWidth: number, newHeight: number) {
    let dpr = window.devicePixelRatio;
    this.canvas.width = newWidth * dpr;
    this.canvas.height = newHeight * dpr;
    this.canvas.style.width = newWidth + 'px';
    this.canvas.style.height = newHeight + 'px';
  }

  dispose() {
    this.removeAllImages();
    // this.canvas = null;
    // this.gc = null;
  }

  onPointPositionsChanged(newPositions: Float32Array) {
    this.worldSpacePointPositions = newPositions;
    this.removeAllImages();
  }

  onRender(rc: RenderContext) {
    if (!this.labelsActive) {
      return;
    }

    this.removeAllImages();
    this.makeImages(rc);
  }

  setScene(scene: THREE.Scene) {}
  onPickingRender(renderContext: RenderContext) {}
}
