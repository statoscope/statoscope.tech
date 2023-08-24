/* global ym */

import './splash.css';
import initStatoscope, { Discovery } from '@statoscope/webpack-ui';

const splash = document.querySelector('#splash');
const progressContainer = document.querySelector('#splash #progress');
const error = document.querySelector('#splash #error');
const instructions = document.querySelector('#splash #instructions');
const fileInput = document.querySelector('#splash #file-input');
const uploadButton = document.querySelector('#splash #upload-button');
const demoButton = document.querySelector('#splash #demo-button');

function reachGoal(name, params) {
  if (typeof ym !== 'undefined') {
    ym(68806498, 'reachGoal', name, params);
  }
}

function init(files) {
  for (const item of files) {
    const { data } = item;

    if (data.version) {
      reachGoal('webpack', { version: data.version });
    }
  }

  reachGoal('init', { files: files.length });

  splash.parentNode.removeChild(splash);
  initStatoscope(files);
}

const analyticsWarning = document.querySelector('#analytics-warning');
const closeAnalyticsWarning = document.querySelector('#close-analytics-warning');

if (!document.cookie.includes('analyticsWarningClosed')) {
  analyticsWarning.classList.remove('hidden');
  closeAnalyticsWarning.addEventListener('click', () => {
    analyticsWarning.classList.add('hidden');
    document.cookie = `analyticsWarningClosed=1; path=/; max-age=${365 * 24 * 60 * 60}`;
  });
}

uploadButton.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', ({ target: { files } }) => {
  if (files.length) {
    handleFiles(Array.from(files)).finally(destroyProgressBars).then(init);
  }
});

demoButton.addEventListener('click', async () => {
  reachGoal('demo');

  instructions.classList.add('hidden');

  const loaderResult = await loadDataWithProgress(() =>
    Discovery.utils.loadDataFromUrl('demo-stats.json', {})
  );

  init([{ name: 'demo-stats.js', data: loaderResult.data }]);
});

document.addEventListener(
  'click',
  (event) => {
    if (event.target.dataset.mayCopy) {
      document.execCommand('copy');
    }
  },
  true
);

document.addEventListener('copy', (event) => {
  if (event.target.dataset.mayCopy) {
    event.preventDefault();

    if (event.clipboardData) {
      event.clipboardData.setData('text/plain', event.target.textContent);
    }
  }
});

splash.addEventListener('dragover', function (e) {
  if (e.dataTransfer.items && e.dataTransfer.items[0]) {
    if (e.dataTransfer.items[0].kind === 'file') {
      e.preventDefault();
    }
  }
});

splash.addEventListener('drop', function (e) {
  const files = [];

  if (e.dataTransfer.items) {
    for (const item of e.dataTransfer.items) {
      if (item.kind === 'file') {
        e.preventDefault();

        const file = item.getAsFile();

        if (!/\.json/.test(file.name)) {
          alert('Only JSON files may be loaded.');
          return;
        }

        files.push(file);
      }
    }
  }

  if (files.length) {
    handleFiles(files).finally(destroyProgressBars).then(init);
  }
});

splash.addEventListener('dragend', function (e) {
  if (e.dataTransfer.items) {
    for (let i = 0; i < e.dataTransfer.items.length; i++) {
      e.dataTransfer.items.remove(i);
    }
  } else {
    e.dataTransfer.clearData();
  }
});

function makeProgressBar() {
  const progressbar = new Discovery.utils.progressbar({});
  makeProgressBar.set.add(progressbar);
  return progressbar;
}

function destroyProgressBars() {
  for (const progressbar of makeProgressBar.set) {
    progressbar.el.remove();
  }
}

makeProgressBar.set = new Set();

async function loadDataWithProgress(loaderFn) {
  const progressbar = makeProgressBar();

  progressContainer.append(progressbar.el);

  const loader = loaderFn();
  await Discovery.utils.syncLoaderWithProgressbar(loader, progressbar);

  return loader.result;
}

async function handleFiles(files) {
  instructions.classList.add('hidden');
  error.classList.remove('hidden');
  error.innerHTML = '';

  const rawData = [];

  await Promise.all(
    files.map(async (file) => {
      try {
        const loadResult = await loadDataWithProgress(() =>
          Discovery.utils.loadDataFromFile(file, {})
        );
        rawData.push({
          name: file.name,
          data: loadResult.data,
        });
        reachGoal('json_upload');
      } catch (e) {
        error.innerHTML = `😭 Can't load ${file.name}<br/>${e.message}<br/>Please, try again`;
        throw e;
      }
    })
  );

  return rawData;
}
