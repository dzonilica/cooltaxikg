/* Cool Taxi — SR/EN language switch
   - text:    <el data-en="English">Srpski</el>
   - attrs:   <el data-en-placeholder="..." data-en-aria-label="...">
   - title:   <title data-en="English title">Srpski naslov</title>
   - persists choice to localStorage, applies on every page load. */
(function(){
  var STORAGE_KEY = 'cooltaxi-lang';
  var DEFAULT_LANG = 'sr';
  var ATTRS = ['alt','placeholder','aria-label','title','content','value'];

  function getLang(){
    try { return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG; } catch(e){ return DEFAULT_LANG; }
  }
  function saveLang(lang){
    try { localStorage.setItem(STORAGE_KEY, lang); } catch(e){}
  }

  function applyLang(lang){
    document.documentElement.lang = (lang === 'en') ? 'en' : 'sr-RS';
    document.documentElement.setAttribute('data-lang', lang);

    // text content
    var nodes = document.querySelectorAll('[data-en]');
    for (var i = 0; i < nodes.length; i++){
      var el = nodes[i];
      if (!el.hasAttribute('data-sr')) el.setAttribute('data-sr', el.textContent);
      var v = (lang === 'en') ? el.getAttribute('data-en') : el.getAttribute('data-sr');
      if (el.tagName === 'TITLE') { document.title = v; }
      else if (el.textContent !== v) { el.textContent = v; }
    }

    // attributes
    for (var a = 0; a < ATTRS.length; a++){
      var attr = ATTRS[a];
      var srAttr = 'data-sr-' + attr;
      var enAttr = 'data-en-' + attr;
      var aNodes = document.querySelectorAll('[' + enAttr + ']');
      for (var j = 0; j < aNodes.length; j++){
        var e2 = aNodes[j];
        if (!e2.hasAttribute(srAttr)) e2.setAttribute(srAttr, e2.getAttribute(attr) || '');
        var val = (lang === 'en') ? e2.getAttribute(enAttr) : e2.getAttribute(srAttr);
        e2.setAttribute(attr, val);
      }
    }

    // update switcher state
    var btns = document.querySelectorAll('.lang-switch');
    for (var k = 0; k < btns.length; k++){
      btns[k].setAttribute('data-active', lang);
      btns[k].setAttribute('aria-label', lang === 'en' ? 'Switch to Serbian' : 'Promeni na engleski');
    }

    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
  }

  function toggle(){
    var next = (getLang() === 'en') ? 'sr' : 'en';
    saveLang(next);
    applyLang(next);
  }

  function init(){
    applyLang(getLang());
    var btns = document.querySelectorAll('.lang-switch');
    for (var i = 0; i < btns.length; i++){
      btns[i].addEventListener('click', function(e){ e.preventDefault(); toggle(); });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.coolTaxiI18n = { get: getLang, set: function(l){ saveLang(l); applyLang(l); } };
})();
