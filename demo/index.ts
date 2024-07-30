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

import {Data, data} from './data/projection';
import {Point3D, Dataset, PointMetadata} from '../src/data';
import {makeSequences} from './sequences';
import {ScatterGL, RenderMode} from '../src';
/** SAFEHTML */

const fakePoint: Data = {
  labels: [1, 2],
  labelNames: ['', 'asdf'],
  projection: [
    [0, 0, 0],
    [-2.663061704654978, 2.126528815699366, -0.7487082312037743],
  ],
};

const onePoint: Data = {
  labels: [1],
  labelNames: ['asdf'],
  projection: [[-2.663061704654978, 2.126528815699366, -0.7487082312037743]],
};

const twoPoints: Data = {
  labels: [1, 2],
  labelNames: ['asdf', 'aa'],
  projection: [
    [-0.5692080308477788, -5.753654887458367, 2.7835330319993927],
    [-2.663061704654978, 2.126528815699366, -0.7487082312037743],
  ],
};

const isolate1: Data = {
  labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
  labelNames: [
    'T-shirt/top',
    'Trouser',
    'Pullover',
    'Dress',
    'Coat',
    'Sandal',
    'Shirt',
    'Sneaker',
    'Bag',
    'Ankle boot',
  ],
  projection: [
    [-0.5692080308477788, -5.753654887458367, 2.7835330319993927],
    [-2.663061704654978, 2.126528815699366, -0.7487082312037743],
    [-2.0054479910247767, 0.7547483396154131, 2.1148930409184903],
    [-1.9086643493621198, 0.9147716643460293, 1.5271323767814895],
    [-2.740305928363026, 2.6518831832172842, 2.491354028728368],
    [2.4414875741932773, 1.4536699052796551, 0.654822296570369],
    [-4.983208680267848, -4.910035160841009, 1.1660649484980932],
    [2.8154214555373738, 1.805632089392737, 0.21721779250561873],
    [-1.71301372985681, -3.163344388492646, 1.946828904433977],
    [-1.7578977566726093, -3.6301657637624882, 1.8903732720595987],
  ],
};

const isolate2: Data = {
  labels: [5, 6, 7],
  labelNames: ['Coat', 'Sandal', 'Shirt'],
  projection: [
    // [-2.740305928363026, 2.6518831832172842, 2.491354028728368],
    [2.4414875741932773, 1.4536699052796551, 0.654822296570369],
    [-4.983208680267848, -4.910035160841009, 1.1660649484980932],
  ],
};

const centroid: Data = {
  groupNames: ['lorem  0', 'lorem  1', 'lorem  2'],
  groups: [0, 0, 0, 1, 1, 1, 2, 2, 2],
  labels: Array.from({length: 9}, (_, i) => i),
  labelNames: [
    'Test 1',
    'Test 2',
    'Test 3',
    'Test 4',
    'Test 5',
    'Test 6',
    'Test 7',
    'Test 8',
    'Test 9',
    'Test 10',
    'Test 11',
    'Test 12',
    'Test 13',
    'Test 14',
    'Test 15',
    'Test 16',
    'Test 17',
    'Test 18',
    'Test 19',
    'Test 20',
    'Test 21',
    'Test 22',
    'Test 23',
    'Test 24',
    'Test 25',
    'Test 26',
    'Test 27',
    'Test 28',
    'Test 29',
    'Test 30',
  ],
  projection: [
    // // Group 1
    [7.783150672912598, 10.699580192565918, 6.143429279327393], // Test 1
    [7.227686405181885, 14.039731979370117, 3.092937469482422], // Test 2
    [5.487361907958984, 12.982627868652344, -0.7097371220588684], // Test 3

    // [7.019690036773682, 13.890780448913574, 2.0253472328186035], // Test 5
    // [7.289602279663086, 12.046065330505371, 5.729386329650879], // Test 6
    // [7.460376739501953, 12.500969886779785, 5.202960014343262], // Test 7
    // [5.973537921905518, 12.787200927734375, 4.456411838531494], // Test 8
    // [8.452061653137207, 12.098001480102539, 7.686171054840088], // Test 9
    // [9.31926155090332, 9.553457260131836, 9.774821281433105], // Test 10

    // // Group 2
    // [-0.7056426405906677, 3.609229326248169, 3.130437135696411], // Test 11
    [-2.4263644218444824, 0.6159617304801941, 6.790606498718262], // Test 12
    [-2.610590696334839, 0.4562993049621582, 6.777414798736572], // Test 27
    [-2.5131587982177734, 0.8658394813537598, 5.979968070983887], // Test 23
    // [9.783132553100586, 9.942622184753418, 8.447614669799805], // Test 13
    // [9.543365478515625, 10.297831535339355, 8.08228874206543], // Test 14
    // [9.283763885498047, 10.002352714538574, 9.431366920471191], // Test 15
    // [9.173554420471191, 8.984330177307129, 9.790040016174316], // Test 16
    // [12.080926895141602, -0.04254857450723648, 9.47503662109375], // Test 18
    // [11.361991882324219, 1.9956129789352417, 10.443604469299316], // Test 19
    // [10.191771507263184, 6.147909164428711, 10.965229034423828], // Test 20

    // Group 3
    [10.15555477142334, 8.303173065185547, 10.61386775970459], // Test 21
    [10.403385162353516, 5.089134216308594, 10.81881046295166], // Test 22
    [10.191771507263184, 6.147909164428711, 10.965229034423828], // Test 20
    // [10.800951957702637, 4.006225109100342, 11.082344055175781], // Test 17
    // [-3.9420087337493896, 0.09150267392396927, 6.424076557159424], // Test 24
    // [-0.6636497974395752, 3.371920585632324, 3.35595703125], // Test 25
    // [-0.4172389507293701, 2.8012399673461914, 3.756361722946167], // Test 26
    // [-0.22766968607902527, 3.9918429851531982, 3.620060443878174], // Test 28
    // [-3.085676908493042, 0.13723358511924744, 7.478201866149902], // Test 29
    // [-2.8131160736083984, 0.25826114416122437, 6.996937274932861], // Test 30
    // [-2.919018030166626, 0.187416210770607, 7.252936840057373], // Test 4
  ],
};

function makeDataPoints(
  data: Data
): {
  dataPoints: Point3D[];
  metadata: PointMetadata[];
} {
  const dataPoints: Point3D[] = [];
  const metadata: PointMetadata[] = [];
  data.projection.forEach((vector, index) => {
    const labelIndex = data.labels[index];
    const groupIndex = data.groups ? data.groups[index] : 0;
    dataPoints.push(vector);
    metadata.push({
      labelIndex,
      label: data.labelNames[labelIndex],
      image: index % 2 === 0 ? 'crop-jeans.jpg' : '',
      group: data.groupNames ? data.groupNames[groupIndex] : undefined,
    });
  });
  return {dataPoints, metadata};
}

const {dataPoints, metadata} = makeDataPoints(centroid);

const sequences = makeSequences(dataPoints, metadata);
const ds = {
  points: [
    [7.783150672912598, 10.699580192565918, 6.143429279327393],
    [7.227686405181885, 14.039731979370117, 3.092937469482422],
    [5.487361907958984, 12.982627868652344, -0.7097371220588684],
    [-2.4263644218444824, 0.6159617304801941, 6.790606498718262],
    [-2.610590696334839, 0.4562993049621582, 6.777414798736572],
    [-2.5131587982177734, 0.8658394813537598, 5.979968070983887],
    [10.15555477142334, 8.303173065185547, 10.61386775970459],
    [10.403385162353516, 5.089134216308594, 10.81881046295166],
    [10.191771507263184, 6.147909164428711, 10.965229034423828],
  ] as Point3D[],
  metadata: [
    {
      id: '609',
      label: '609',
      image: 'plot-img',
      color: 'rgba(117, 117, 217, 0.7)',
      hoverColor: 'rgba(118, 11, 79, 0.7)',
      group: '11',
      groupLabel: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. 11',
    },
    {
      id: '608',
      label: '608',
      color: 'rgba(117, 117, 217, 0.7)',
      hoverColor: 'rgba(118, 11, 79, 0.7)',
      group: '11',
      groupLabel: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. 11',
    },
    {
      id: '607',
      label: '607',
      image: 'plot-img',
      color: 'rgba(117, 117, 217, 0.7)',
      hoverColor: 'rgba(118, 11, 79, 0.7)',
      group: '11',
      groupLabel: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. 11',
    },
    {
      id: '1077',
      label: '1077',
      image: 'plot-img',
      color: 'rgba(117, 117, 217, 0.7)',
      hoverColor: 'rgba(118, 11, 79, 0.7)',
      group: '35',
      groupLabel: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. 35',
    },
    {
      id: '8c98e19e-b41d-4a58-b22d-0d16b837ede4',
      label: '8c98e19e-b41d-4a58-b22d-0d16b837ede4',
      image: 'plot-img',
      color: 'rgba(117, 117, 217, 0.7)',
      hoverColor: 'rgba(118, 11, 79, 0.7)',
      group: '35',
      groupLabel: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. 35',
    },
    {
      id: '1078',
      label: '1078',
      color: 'rgba(117, 117, 217, 0.7)',
      image: 'plot-img',
      hoverColor: 'rgba(118, 11, 79, 0.7)',
      group: '35',
      groupLabel: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. 35',
    },
    {
      id: '1455',
      label: '1455',
      color: 'rgba(117, 117, 217, 0.7)',
      hoverColor: 'rgba(118, 11, 79, 0.7)',
      group: '6',
      groupLabel: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. 6',
    },
    {
      id: '1457',
      label: '1457',
      color: 'rgba(117, 117, 217, 0.7)',
      hoverColor: 'rgba(118, 11, 79, 0.7)',
      group: '6',
      groupLabel: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. 6',
    },
    {
      id: '1479',
      label: '1479',
      color: 'rgba(117, 117, 217, 0.7)',
      image: 'plot-img',
      hoverColor: 'rgba(118, 11, 79, 0.7)',
      group: '6',
      groupLabel: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. 6',
    },
  ],
};
const dataset = new Dataset(ds.points, ds.metadata);

dataset.setSpriteMetadata({
  spriteImage: 'spritesheet.png',
  singleSpriteSize: [28, 28],
  // Uncomment the following line to only use the first sprite for every point
  // spriteIndices: dataPoints.map(d => 0),
});

let lastSelectedPoints: number[] = [];
let renderMode = 'points';

const containerElement = document.getElementById('container')!;
const messagesElement = document.getElementById('messages')!;

const setMessage = (message: string) => {
  const messageStr = `🔥 ${message}`;
  console.log(messageStr);
  messagesElement.innerHTML = messageStr;
};

const scatterGL = new ScatterGL(containerElement, {
  onClick: (point: number | null) => {
    setMessage(`click ${point}`);
  },
  onHover: (point: number | null) => {
    setMessage(`hover ${point}`);
  },
  onSelect: (points: number[]) => {
    let message = '';
    if (points.length === 0 && lastSelectedPoints.length === 0) {
      message = 'no selection';
    } else if (points.length === 0 && lastSelectedPoints.length > 0) {
      message = 'deselected';
    } else if (points.length === 1) {
      message = `selected ${points}`;
    } else {
      message = `selected ${points.length} points`;
    }
    setMessage(message);
  },
  renderMode: RenderMode.POINT,
  orbitControls: {
    zoomSpeed: 1.125,
  },
  showGroups: false,
  showImages: false,
  showLabels: false,
  styles: {
    label: {
      fontSize: 8,
      fillWidth: 0,
      fillColorHover: '#828282',
      strokeWidth: 1,
    },
  },
});
scatterGL.select(Array.from({length: 9}, (_, i) => i));
scatterGL.render(dataset);

// Add in a resize observer for automatic window resize.
window.addEventListener('resize', () => {
  scatterGL.resize();
});

document
  .querySelectorAll<HTMLInputElement>('input[name="interactions"]')
  .forEach(inputElement => {
    inputElement.addEventListener('change', () => {
      if (inputElement.value === 'pan') {
        scatterGL.setPanMode();
      } else if (inputElement.value === 'select') {
        scatterGL.setSelectMode();
      }
    });
  });

document
  .querySelectorAll<HTMLInputElement>('input[name="render"]')
  .forEach(inputElement => {
    inputElement.addEventListener('change', () => {
      renderMode = inputElement.value;
      if (inputElement.value === 'points') {
        scatterGL.setPointRenderMode();
      } else if (inputElement.value === 'sprites') {
        scatterGL.setSpriteRenderMode();
      } else if (inputElement.value === 'text') {
        scatterGL.setTextRenderMode();
      }
    });
  });

const hues = [...new Array(10)].map((_, i) => Math.floor((255 / 10) * i));

const lightTransparentColorsByLabel = hues.map(
  hue => `hsla(${hue}, 100%, 50%, 0.05)`
);
const heavyTransparentColorsByLabel = hues.map(
  hue => `hsla(${hue}, 100%, 50%, 0.75)`
);
const opaqueColorsByLabel = hues.map(hue => `hsla(${hue}, 100%, 60%, 1)`);

document
  .querySelectorAll<HTMLInputElement>('input[name="color"]')
  .forEach(inputElement => {
    inputElement.addEventListener('change', () => {
      if (inputElement.value === 'default') {
        scatterGL.setPointColorer(null);
      } else if (inputElement.value === 'label') {
        scatterGL.setPointColorer((i, selectedIndices, hoverIndex) => {
          const labelIndex = dataset.metadata![i]['labelIndex'] as number;
          const opaque = renderMode !== 'points';
          if (opaque) {
            return opaqueColorsByLabel[labelIndex];
          } else {
            if (hoverIndex === i) {
              return 'red';
            }

            // If nothing is selected, return the heavy color
            if (selectedIndices.size === 0) {
              return heavyTransparentColorsByLabel[labelIndex];
            }
            // Otherwise, keep the selected points heavy and non-selected light
            else {
              const isSelected = selectedIndices.has(i);
              return isSelected
                ? heavyTransparentColorsByLabel[labelIndex]
                : lightTransparentColorsByLabel[labelIndex];
            }
          }
        });
      }
    });
  });
const isolateToggle = document.querySelector<HTMLInputElement>(
  'input[name="isolate"]'
)!;
isolateToggle.addEventListener('change', (e: any) => {
  const checked = isolateToggle.checked;
  const {dataPoints, metadata} = makeDataPoints(isolate1);
  scatterGL.updateDataset(
    checked
      ? new Dataset(dataPoints, metadata)
      : new Dataset(ds.points, ds.metadata)
  );
});
const clusterToggle = document.querySelector<HTMLInputElement>(
  'input[name="cluster"]'
)!;
clusterToggle.addEventListener('change', (e: any) => {
  const checked = clusterToggle.checked;
  scatterGL.setClustersVisible(checked);
  scatterGL.resize();
});
const labelsToggle = document.querySelector<HTMLInputElement>(
  'input[name="labels"]'
)!;
labelsToggle.addEventListener('change', (e: any) => {
  const checked = labelsToggle.checked;
  scatterGL.select(Array.from({length: 9}, (_, i) => i));
  scatterGL.setLabelsVisible(checked);
});
const imagesToggle = document.querySelector<HTMLInputElement>(
  'input[name="images"]'
)!;
imagesToggle.addEventListener('change', (e: any) => {
  const checked = imagesToggle.checked;
  scatterGL.select(Array.from({length: 9}, (_, i) => i));
  scatterGL.setImagesVisible(checked);
});
const dimensionsToggle = document.querySelector<HTMLInputElement>(
  'input[name="3D"]'
)!;
dimensionsToggle.addEventListener('change', (e: any) => {
  const is3D = dimensionsToggle.checked;
  scatterGL.setDimensions(is3D ? 3 : 2);
});

const sequencesToggle = document.querySelector<HTMLInputElement>(
  'input[name="sequences"]'
)!;
sequencesToggle.addEventListener('change', (e: any) => {
  const showSequences = sequencesToggle.checked;
  scatterGL.setSequences(showSequences ? sequences : []);
});

// Set up controls for buttons
const selectRandomButton = document.getElementById('select-random')!;
selectRandomButton.addEventListener('click', () => {
  const randomIndex = Math.floor(dataPoints.length * Math.random());
  scatterGL.select([randomIndex]);
});

const toggleOrbitButton = document.getElementById('toggle-orbit')!;
toggleOrbitButton.addEventListener('click', () => {
  if (scatterGL.isOrbiting()) {
    scatterGL.stopOrbitAnimation();
  } else {
    scatterGL.startOrbitAnimation();
  }
});
