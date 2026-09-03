/**
 * roman.js — Roman numeral dates that reveal their numeric value on hover.
 *
 * Any valid roman numeral token anywhere in the document (e.g. "MMXXVI") is
 * wrapped in a hoverable span. While hovering it shows the decimal value
 * ("2026"); on hover out it restores the roman form. Words that are not valid
 * numerals (e.g. "CODEX", "ANNO", "DOMINI") are left untouched.
 *
 * A MutationObserver re-scans any content added later (e.g. language toggles,
 * dynamically injected markup), so every roman date stays hoverable.
 */

(function (win, doc) {
  'use strict';

  var ROMAN = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  var CLASS = 'roman-date';

  /* Convert a roman numeral string to an integer; returns null if the string
   * is not a valid roman numeral. Case-insensitive. */
  function romanToInt(str) {
    if (!str || typeof str !== 'string') return null;
    var upper = str.toUpperCase();
    if (!/^[IVXLCDM]+$/.test(upper)) return null;

    var total = 0;
    for (var i = 0; i < upper.length; i++) {
      var cur = ROMAN[upper[i]];
      var next = ROMAN[upper[i + 1]] || 0;
      if (next > cur) {
        total -= cur;
      } else {
        total += cur;
      }
    }
    if (total <= 0 || toRoman(total) !== upper) return null;
    return total;
  }

  /* Generator mirroring the copy in base.html. */
  function toRoman(num) {
    var values = [
      [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
      [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
      [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
    ];
    var result = '';
    for (var v = 0; v < values.length; v++) {
      var value = values[v][0];
      var numeral = values[v][1];
      while (num >= value) {
        result += numeral;
        num -= value;
      }
    }
    return result;
  }

  function isSkippable(node) {
    var tag = node.nodeName;
    return tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' ||
      tag === 'TEXTAREA' || tag === 'INPUT';
  }

  function insideOwnSpan(node) {
    while (node && node !== doc) {
      if (node.nodeType === 1 && node.classList && node.classList.contains(CLASS)) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }

  function wrapToken(textNode, match, start) {
    var span = doc.createElement('span');
    span.className = CLASS;
    span.setAttribute('data-roman', match);
    span.setAttribute('data-num', String(romanToInt(match)));
    span.textContent = match;
    span.addEventListener('mouseenter', function () {
      span.textContent = span.getAttribute('data-num');
    });
    span.addEventListener('mouseleave', function () {
      span.textContent = span.getAttribute('data-roman');
    });

    var tail = textNode.splitText(start);
    tail.splitText(match.length);
    tail.parentNode.replaceChild(span, tail);
  }

  function processTextNode(node) {
    if (insideOwnSpan(node)) return;
    var value = node.nodeValue;
    if (!value || !value.length) return;

    /* Match valid roman numeral tokens not glued to letters/digits on either
     * side, so "CODEX" is never hit but "MMXXVI" in "— MMXXVI" is. */
    var re = /(^|[\s\-–—(])[IVXLCDM]+(?=$|[\s\-–—.,;:)!?])/g;
    var matches = [];
    var m;
    while ((m = re.exec(value)) !== null) {
      var raw = m[0];
      var token = raw.replace(/^[\s\-–—(]/, '');
      if (romanToInt(token) !== null) {
        matches.push({ start: m.index + (raw.length > token.length ? 1 : 0), token: token });
      }
      if (m.index === re.lastIndex) re.lastIndex++;
    }

    for (var i = matches.length - 1; i >= 0; i--) {
      wrapToken(node, matches[i].token, matches[i].start);
    }
  }

  function scan(root) {
    if (!root) return;
    var walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        return (!n.parentNode || (!isSkippable(n.parentNode) && !insideOwnSpan(n))) &&
          /[IVXLCDM]/i.test(n.nodeValue || '')
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    });

    var node;
    var queue = [];
    while ((node = walker.nextNode())) {
      queue.push(node);
    }
    for (var i = 0; i < queue.length; i++) {
      processTextNode(queue[i]);
    }
  }

  /* Fill every element marked with [data-roman-year] (and the base.html
   * #roman-year footer) with the current year in roman numerals. */
  function applyYear(root) {
    var year = toRoman(new Date().getFullYear());
    var els = [];
    if (root && root.nodeType === 1) {
      if (root.id === 'roman-year' || root.hasAttribute && root.hasAttribute('data-roman-year')) {
        els.push(root);
      }
      var found = root.querySelectorAll
        ? root.querySelectorAll('[data-roman-year], #roman-year')
        : [];
      for (var i = 0; i < found.length; i++) els.push(found[i]);
    }
    for (var j = 0; j < els.length; j++) {
      els[j].textContent = year;
    }
  }

  var selfMutating = false;
  var observer = null;

  /* Scan but suppress the MutationObserver while we are the ones mutating the
   * DOM (splitText/replaceChild during wrapping). Observer callbacks are
   * delivered as microtasks that drain before the setTimeout macrotask, so the
   * flag reliably stays true for those callbacks and is cleared afterwards. */
  function scanGuarded(root) {
    selfMutating = true;
    try {
      applyYear(root);
      scan(root);
    } finally {
      setTimeout(function () { selfMutating = false; }, 0);
    }
  }

  function onMutations(mutations) {
    if (selfMutating) return;
    for (var i = 0; i < mutations.length; i++) {
      var added = mutations[i].addedNodes;
      for (var j = 0; j < added.length; j++) {
        var n = added[j];
        if (n.nodeType === 1 && n.classList && n.classList.contains(CLASS)) continue;
        scanGuarded(n);
      }
    }
  }

  function startObserver() {
    if (!win.MutationObserver) return;
    observer = new MutationObserver(onMutations);
    observer.observe(doc.body, { childList: true, subtree: true });
  }

  function init() {
    if (doc.readyState === 'loading') {
      doc.addEventListener('DOMContentLoaded', function () {
        scanGuarded(doc.body);
        startObserver();
      });
    } else {
      scanGuarded(doc.body);
      startObserver();
    }
  }

  win.toRoman = toRoman;
  win.romanToInt = romanToInt;
  win.romanDateInit = init;

  init();
})(window, document);
