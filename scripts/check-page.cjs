const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');

async function main() {
  const base = process.env.BASE_URL || 'http://localhost:3000';
  const root = await fetch(base, { redirect: 'manual' });
  assert.ok([307, 308].includes(root.status));
  assert.equal(root.headers.get('location'), '/cases');
  const routes = ['/cases', '/cases/CASE-001', '/cases/CASE-001/documents', '/cases/CASE-001/mail'];
  for (const route of routes) {
    const response = await fetch(new URL(route, base));
    assert.equal(response.status, 200, route);
    const dom = new JSDOM(await response.text());
    const document = dom.window.document;
    assert.equal(document.querySelectorAll('h1').length, 1, route);
    assert.equal(document.querySelectorAll('a[href="#case-timeline"]').length, 0);
    const sidebar = document.querySelector('nav[aria-label="Главная навигация"]');
    assert.deepEqual([...sidebar.querySelectorAll('a')].map(link => link.getAttribute('href')), ['/cases']);
    for (const link of document.querySelectorAll('a[href^="/cases"]')) assert.ok(routes.includes(link.getAttribute('href')), `Unexpected destination: ${link.href}`);
    const stylesheets = [...document.querySelectorAll('link[rel="stylesheet"]')];
    assert.ok(stylesheets.length);
    let css = '';
    for (const link of stylesheets) {
      const sheet = await fetch(new URL(link.getAttribute('href'), base));
      assert.equal(sheet.status, 200);
      css += await sheet.text();
    }
    assert.ok(css.includes('@media'));
    if (route === '/cases/CASE-001') {
      assert.deepEqual([...document.querySelectorAll('#case-timeline li time')].map(time => time.dateTime), ['2026-11-02', '2026-11-12', '2026-11-19']);
      assert.equal(document.querySelectorAll('[aria-label="Разделы дела"] [aria-current="page"]').length, 1);
    }
    if (route.endsWith('/documents')) { assert.equal(document.querySelectorAll('details').length, 6); assert.ok(document.body.textContent.includes('Файловый архив пока не подключён')); }
    if (route.endsWith('/mail')) { assert.equal(document.querySelectorAll('details').length, 3); assert.ok(document.body.textContent.includes('Почта пока не подключена')); }
    dom.window.close();
    console.log(`OK ${route}: HTTP 200, navigation and CSS`);
  }
  const missing = await fetch(new URL('/cases/CASE-404', base));
  // Next.js can stream a not-found boundary after sending HTTP 200.
  assert.ok([200, 404].includes(missing.status));
  const missingDom = new JSDOM(await missing.text());
  assert.ok(missingDom.window.document.body.textContent.includes('Дело не найдено'));
  assert.ok([...missingDom.window.document.querySelectorAll('meta[name="robots"]')].some(meta => meta.content.includes('noindex')));
  assert.equal(missingDom.window.document.querySelectorAll('details').length, 0);
  missingDom.window.close();
  console.log('OK missing case: not-found page, noindex, no case data');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
