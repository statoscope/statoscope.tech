/* global ym */

import { parseChunked } from '@discoveryjs/json-ext';
import './splash.css';
import initStatoscope from '@statoscope/webpack-ui';
import MultipleReader from './multipleReader';

const splash = document.querySelector('#splash');
const progress = document.querySelector('#splash #progress');
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
    handleFiles(Array.from(files)).then(init);
  }
});

demoButton.addEventListener('click', () => {
  reachGoal('demo');

  instructions.classList.add('hidden');
  progress.classList.remove('hidden');

  progress.textContent = 'Demo stats is loading...';
  fetch('demo-stats.json')
    .then((r) => r.json())
    .then((data) => init([{ name: 'demo-stats.js', data }]));
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
    handleFiles(files).then(init);
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

function delay(ms, data) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), ms);
  });
}

function handleFiles(files) {
  instructions.classList.add('hidden');
  progress.classList.remove('hidden');
  progress.textContent = '🏗 preparing...';
  error.classList.remove('hidden');
  error.innerHTML = '';

  const multiReader = new MultipleReader(files);
  multiReader.eventProgress.on((sender, { total, loaded }) => {
    progress.textContent = `🏗 ${parseInt((100 / total) * loaded)}% loaded`;
  });
  return multiReader
    .read()
    .then((files) => {
      progress.textContent = 'parsing 🏗';
      return delay(150, files);
    })
    .then((files) => {
      files = Promise.all(
        files.map(async (file) => {
          try {
            const data = await parseChunked(() => file.content);
            reachGoal('json_upload');
            return { name: file.name, data };
          } catch (e) {
            e.file = file.name;
            throw e;
          }
        })
      );
      progress.textContent = 'almost done 🚀';
      return delay(150, files);
    })
    .catch((e) => {
      const message = `😭 Can't load ${e.file}<br/>${e.message}<br/>Please, try again`;
      error.innerHTML = message;
      throw new Error(message);
    });
}
