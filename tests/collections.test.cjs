require('tsx/cjs');
require.extensions['.scss'] = module => { module.exports = {}; };
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { JSDOM } = require('jsdom');
const initialDom = new JSDOM('<!doctype html>');
global.window = initialDom.window;
global.document = initialDom.window.document;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { DocumentsBrowser } = require('../src/widgets/documents-browser/ui/documents-browser.tsx');
const { MailBrowser } = require('../src/widgets/mail-browser/ui/mail-browser.tsx');
const { getCaseDocuments, getCaseFolders } = require('../src/entities/case-document/model/documents.ts');
const { getCaseThreads } = require('../src/entities/email-thread/model/threads.ts');

async function withDom(component, check) {
  const dom = new JSDOM('<!doctype html><div id="root"></div>');
  global.window = dom.window;
  global.document = dom.window.document;
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const root = createRoot(document.getElementById('root'));
  try {
    await React.act(async () => root.render(component));
    await check(dom.window);
  } finally {
    await React.act(async () => root.unmount());
    dom.window.close();
    delete global.window;
    delete global.document;
  }
}

const buttonWith = text => [...document.querySelectorAll('button')].find(button => button.textContent.includes(text));
async function searchFor(value, window) {
  const input = document.querySelector('input[type="search"]');
  await React.act(async () => {
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(input, value);
    input.dispatchEvent(new window.Event('input', { bubbles: true }));
  });
}

test('document folders, nested selection, search, reset and preview work', () => withDom(React.createElement(DocumentsBrowser, { documents: getCaseDocuments('CASE-001'), folders: getCaseFolders('CASE-001') }), async window => {
  assert.equal(document.querySelectorAll('details').length, 6);
  await React.act(async () => buttonWith('Договоры').click());
  assert.equal(document.querySelectorAll('details').length, 2);
  await React.act(async () => buttonWith('Приложения').click());
  assert.equal(document.querySelectorAll('details').length, 1);
  const row = document.querySelector('details');
  await React.act(async () => row.querySelector('summary').click());
  assert.equal(row.open, true);
  assert.ok(row.textContent.includes('Учебный пример приложения'));
  await React.act(async () => buttonWith('Все документы').click());
  assert.equal(document.querySelectorAll('details').length, 6);
  await searchFor('несуществующий документ', window);
  assert.equal(document.querySelectorAll('details').length, 0);
  assert.ok(document.body.textContent.includes('Документы не найдены'));
  await React.act(async () => buttonWith('Сбросить поиск').click());
  assert.equal(document.querySelector('input').value, '');
  assert.equal(document.querySelectorAll('details').length, 6);
  await React.act(async () => {
    const select = document.querySelector('select');
    select.value = 'name';
    select.dispatchEvent(new window.Event('change', { bubbles: true }));
  });
  assert.ok(document.querySelector('details summary').textContent.includes('Договор поставки'));
}));

test('mail category filters, full-text search and conversation expansion work', () => withDom(React.createElement(MailBrowser, { threads: getCaseThreads('CASE-001') }), async window => {
  assert.equal(document.querySelectorAll('details').length, 3);
  await React.act(async () => buttonWith('Клиент').click());
  assert.equal(document.querySelectorAll('details').length, 1);
  const row = document.querySelector('details');
  await React.act(async () => row.querySelector('summary').click());
  assert.equal(row.open, true);
  assert.equal(row.querySelectorAll('article').length, 3);
  await React.act(async () => buttonWith('Вся переписка').click());
  assert.equal(document.querySelectorAll('details').length, 3);
  await searchFor('450 000', window);
  assert.equal(document.querySelectorAll('details').length, 1);
  assert.ok(document.querySelector('summary').textContent.includes('Документы по договору'));
}));
