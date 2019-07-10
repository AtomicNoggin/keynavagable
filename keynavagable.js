!(function() {
  //assumes WeakMap is polyfilled
  var events = new WeakMap();
  var captures = new WeakMap();
  var tabElements = new WeakMap();
  var captureKeys = {};
  var ep = Element.prototype;
  var next = "next",
    tabnext = "tab-next",
    prev = "prev",
    tabprev = "tab-previous";
  Object.defineProperties(ep, {
    tabNext: {
      get: function() {
        var tabs = tabElements.get(this);
        if (tabs && tabs[next]) {
          return tabs[next];
        } else {
          return document.getElementById(this.getAttribute(tabnext));
        }
      },
      set: function(value) {
        var tabs = tabElements.get(this) || {};
        if (value instanceof Element) {
          tabs[next] = value;
          this.removeAttribute(tabnext);
        } else if (value === String(value) && value.length) {
          tabs[next] = null;
          this.setAttribute(tabnext, value);
        } else {
          tabs[next] = null;
          this.removeAttribute(tabnext);
        }
        tabElements.set(this, tabs);
      },
      enumerable: true,
      configurable: true
    },
    tabPrevious: {
      get: function() {
        var tabs = tabElements.get(this);
        if (tabs && tabs[prev]) {
          return tabs[prev];
        } else {
          return document.getElementById(this.getAttribute(tabprev));
        }
      },
      set: function(value) {
        var tabs = tabElements.get(this) || {};
        if (value instanceof Element) {
          tabs[prev] = value;
          this.removeAttribute(tabprev);
        } else if (value === String(value) && value.length) {
          tabs[prev] = null;
          this.setAttribute(tabprev, value);
        } else {
          tabs[prev] = null;
          this.removeAttribute(tabprev);
        }
        tabElements.set(this, tabs);
      },
      enumerable: true,
      configurable: true
    }
  });
  ep.setKeyAction = function setKeyAction(key, method, element) {
    var myEvents = events.get(this) || {};
    element = element instanceof Element ? element : this;
    //if method is a string matching a method of the element, use that.
    if (
      method &&
      method === "" + method &&
      element[method] instanceof Function
    ) {
      method = element[method];
    }
    //if it's not a function, use a dummy.
    else if (!(typeof method === "function")) {
      method = function() {};
    }
    if (method) {
      myEvents[key] = method.bind(element);
      events.set(this, myEvents);
    }
  };
  ep.removeKeyAction = function removeKeyAction(key) {
    var myEvents = events.get(this);
    if (myEvents && myEvents[key]) {
      delete myEvents[key];
      Object.keys(myEvents).length
        ? events.set(this, myEvents)
        : events.delete(this);
    }
  };
  ep.captureKeyAction = function captureKeyAction(key, method, element) {
    var myCaptures = captures.get(this) || {};
    if (!myCaptures[key]) {
      captureKeys[key] ? captureKeys[key]++ : (captureKeys[key] = 1);
    }
    element = element instanceof Element ? element : this;
    if (
      method &&
      method === "" + method &&
      element[method] instanceof Function
    ) {
      method = element[method];
    } else if (!(method instanceof Function)) {
      method = function() {};
    }
    myCaptures[key] = method.bind(element);
    captures.set(this, myCaptures);
  };
  ep.releaseKeyAction = function releaseKeyEvent(key) {
    var myCaptures = captures.get(this);
    if (myCaptures && myCaptures[this]) {
      delete myCaptures[this];
      captureKeys[key]--;
      Object.keys(myCaptures).length
        ? captures.set(this, myCaptures)
        : captures.delete(this);
    }
  };
  document.addEventListener(
    "keydown",
    function onDocumentKeydown(e) {
      //assumes key is polyfilled https://github.com/cvan/keyboardevent-key-polyfill
      var key = e.key !== " " ? e.key : "Space",
        activeElement = document.activeElement,
        myEvents = events.get(activeElement),
        captureElement = activeElement;
      //if in content editable mode, ignore
      if (activeElement.isContentEditable) return;
      key =
        (e.altKey && key !== "Alt" ? "Alt " : "") +
        (e.ctrlKey && key !== "Control" ? "Control " : "") +
        (e.keyMeta && key !== "Meta" ? "Meta " : "") +
        (e.shiftKey && key.length > 1 && key !== "Shift" ? "Shift " : "") +
        key;
      if (myEvents && myEvents[key]) {
        if (activeElement.dispatchEvent(getKeynavEvent())) {
          e.preventDefault();
          myEvents[key]();
        }
      }
      //tab-next set and behaviour not overriden with custom keyAction
      else if (key == "Tab" && (activeElement = activeElement.tabNext)) {
        activeElement.focus();
        e.preventDefault();
      }
      //tab-previous set and behaviour not overriden with custom keyAction
      else if (
        key == "Shift Tab" &&
        (activeElement = activeElement.tabPrevious)
      ) {
        activeElement.focus();
        e.preventDefault();
      } else if (captureKeys[key]) {
        do {
          captureElement = captureElement.parentElement;
          myEvents = captures.get(captureElement);
        } while (captureElement && (!myEvents || !myEvents[key]));
        if (captureElement && captureElement.dispatchEvent(getKeynavEvent())) {
          e.preventDefault();
          myEvents[key]();
        }
      }
      function getKeynavEvent() {
        return new CustomEvent("keynavigation", {
          cancelable: true,
          bubbles: true,
          details: {
            key: e.key,
            altKey: e.altKey,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey,
            metaKey: e.metaKey,
            relatedTarget: activeElement
          }
        });
      }
    },
    true
  );
})();
