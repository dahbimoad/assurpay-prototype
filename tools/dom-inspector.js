/* AssurPay · DOM inspector
 *
 * Purpose: read the page you have open (the insurer portal's "new attestation"
 * form) and print a clean map of its fields, buttons and tables, so the capture
 * extension can be built against the real page structure.
 *
 * How to use:
 *   1. Open the insurer portal page you want the extension to read.
 *   2. Open the browser console (F12 → Console).
 *   3. Paste this whole file and press Enter.
 *   4. A report is printed AND copied to your clipboard. Paste it back to Claude.
 *
 * It only reads the DOM. It does not send anything anywhere and it changes
 * nothing on the page. Values of password fields are never included, and the
 * text you typed into other fields is shown only as a short, truncated sample
 * so selectors can be matched — review it before sharing if the page holds
 * anything sensitive.
 */
(() => {
  'use strict';
  const MAX = 60;
  const clip = s => (s == null ? '' : String(s)).replace(/\s+/g, ' ').trim();
  const cut = s => { s = clip(s); return s.length > MAX ? s.slice(0, MAX - 1) + '…' : s; };
  const vis = el => {
    const r = el.getBoundingClientRect();
    if (!r.width && !r.height) return false;
    const cs = getComputedStyle(el);
    return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0';
  };

  // Build a reasonably stable CSS selector for one element.
  const selector = el => {
    if (el.id && document.querySelectorAll('#' + CSS.escape(el.id)).length === 1)
      return '#' + CSS.escape(el.id);
    const nameAttr = el.getAttribute && el.getAttribute('name');
    if (nameAttr) {
      const s = `${el.tagName.toLowerCase()}[name="${CSS.escape(nameAttr)}"]`;
      if (document.querySelectorAll(s).length === 1) return s;
    }
    const parts = [];
    let node = el;
    while (node && node.nodeType === 1 && parts.length < 5) {
      if (node.id) { parts.unshift('#' + CSS.escape(node.id)); break; }
      let part = node.tagName.toLowerCase();
      const cls = (node.getAttribute('class') || '').trim().split(/\s+/)
        .filter(c => c && !/^(ng-|is-|has-|active|focus|hover)/.test(c)).slice(0, 2);
      if (cls.length) part += '.' + cls.map(c => CSS.escape(c)).join('.');
      const parent = node.parentElement;
      if (parent) {
        const same = [...parent.children].filter(c => c.tagName === node.tagName);
        if (same.length > 1) part += `:nth-of-type(${same.indexOf(node) + 1})`;
      }
      parts.unshift(part);
      node = node.parentElement;
    }
    return parts.join(' > ');
  };

  const labelFor = el => {
    if (el.labels && el.labels[0]) return clip(el.labels[0].innerText);
    if (el.getAttribute('aria-label')) return clip(el.getAttribute('aria-label'));
    const wrap = el.closest('label');
    if (wrap) return clip(wrap.innerText);
    const id = el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
    if (id) return clip(id.innerText);
    return '';
  };

  const describeField = el => {
    const tag = el.tagName.toLowerCase();
    const type = tag === 'input' ? (el.type || 'text') : tag;
    const out = {
      label: labelFor(el),
      tag, type,
      name: el.getAttribute('name') || '',
      id: el.id || '',
      placeholder: el.getAttribute('placeholder') || '',
      selector: selector(el),
      required: !!el.required,
    };
    if (type === 'password') out.sample = '(hidden)';
    else if (tag === 'select') {
      out.options = [...el.options].slice(0, 12).map(o => cut(o.textContent));
      out.sample = cut(el.value);
    } else if (type === 'checkbox' || type === 'radio') {
      out.checked = el.checked;
      out.value = cut(el.value);
    } else {
      out.sample = cut(el.value);
    }
    return out;
  };

  const fields = [...document.querySelectorAll('input, select, textarea')]
    .filter(vis).map(describeField);

  const buttons = [...document.querySelectorAll('button, [role="button"], input[type="submit"], input[type="button"], a.btn')]
    .filter(vis).map(el => ({
      text: cut(el.innerText || el.value || el.getAttribute('aria-label')),
      tag: el.tagName.toLowerCase(),
      type: el.getAttribute('type') || '',
      selector: selector(el),
    })).filter(b => b.text);

  const tables = [...document.querySelectorAll('table')].filter(vis).slice(0, 8).map(t => ({
    selector: selector(t),
    caption: cut(t.caption ? t.caption.innerText : ''),
    headers: [...t.querySelectorAll('thead th, tr:first-child th')].map(th => cut(th.innerText)).filter(Boolean),
    rowCount: t.querySelectorAll('tbody tr, tr').length,
    firstRow: [...(t.querySelector('tbody tr') || t.querySelectorAll('tr')[1] || { children: [] }).children]
      .map(td => cut(td.innerText)),
  }));

  const forms = [...document.querySelectorAll('form')].filter(vis).map(f => ({
    selector: selector(f),
    id: f.id || '',
    action: f.getAttribute('action') || '',
    method: (f.getAttribute('method') || 'get').toLowerCase(),
    fieldCount: f.querySelectorAll('input, select, textarea').length,
  }));

  const report = {
    app: 'AssurPay DOM inspector',
    capturedAt: new Date().toISOString(),
    page: { url: location.href, title: document.title, lang: document.documentElement.lang || '' },
    counts: { forms: forms.length, fields: fields.length, buttons: buttons.length, tables: tables.length },
    forms, fields, buttons, tables,
  };

  const json = JSON.stringify(report, null, 2);
  console.log('%cAssurPay DOM inspector', 'font:600 14px sans-serif;color:#0D6657');
  console.log(`Found ${forms.length} form(s), ${fields.length} field(s), ${buttons.length} button(s), ${tables.length} table(s).`);
  console.log(report);
  console.log('--- copy the block below (also copied to your clipboard) ---\n' + json);

  const done = () => console.log('%c✓ Report copied to clipboard — paste it back to Claude.', 'color:#1D7443;font-weight:600');
  try {
    navigator.clipboard.writeText(json).then(done, () => console.log('Clipboard blocked — copy the JSON block above manually.'));
  } catch (e) {
    console.log('Clipboard blocked — copy the JSON block above manually.');
  }
  return report;
})();
