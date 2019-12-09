!(function(view) {
  //assumes WeakMap is polyfilled
  var events = new WeakMap();
  var captures = new WeakMap();
  var tabElements = new WeakMap();
  var captureKeys = {};
  var next = "next",
    tabnext = "aria-flowto", //aria standard tab order controller
    prev = "prev",
    tabprev = "x-ms-aria-flowfrom"; //non-standard MS extension to aria
  //https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/x-ms-aria-flowfrom

  view.KeyNavagable = {
    getTabNext: function(element) {
      var tabs = tabElements.get(element);
      if (tabs && tabs[next]) {
        return tabs[next];
      } else {
        return document.getElementById(element.getAttribute(tabnext));
      }
    },
    setTabNext: function(element, value) {
      var tabs = tabElements.get(element) || {};
      if (value instanceof Element || value instanceof Function) {
        tabs[next] = value;
        element.removeAttribute(tabnext);
        // if the value is an Element with an id, set flowto attribute so it can implicitly get tabPrevious set
        value instanceof Element &&
          value.id &&
          element.setAttribute(tabnext, value.id);
      } else if (value === String(value) && value.length) {
        tabs[next] = null;
        element.setAttribute(tabnext, value);
      } else {
        tabs[next] = null;
        element.removeAttribute(tabnext);
      }
      tabElements.set(element, tabs);
      return window.KeyNavagable;
    },
    getTabPrevious: function(element) {
      var tabs = tabElements.get(element);
      if (tabs && tabs[prev]) {
        return tabs[prev];
      } else {
        var attrId = element.getAttribute(tabprev);
        // the non-standard flowfrom attribute exists, use it to do the lookup
        if (attrId) {
          return document.getElementById(attrId);
        }
        // otherwise do a reverse lookup for an Element that points to this via flowto
        else if (element.id) {
          return document.querySelector(
            "[" + tabnext + '="' + element.id + '"]'
          );
        }
        return null;
      }
    },
    setTabPrevious: function(element, target) {
      var tabs = tabElements.get(element) || {};
      if (target instanceof Element || target instanceof Function) {
        tabs[prev] = target;
        element.removeAttribute(tabprev);
        if (target instanceof Element && target.id) {
          //use the non-standard attribute.
          element.setAttribute(tabprev, target.id);
        }
      } else if (target === String(target) && target.length) {
        tabs[prev] = null;
        element.setAttribute(tabprev, target);
      } else {
        tabs[prev] = null;
        element.removeAttribute(tabprev);
      }
      tabElements.set(element, tabs);
      return window.KeyNavagable;
    },
    hasKeyAction: function hasKeyAction(element, key) {
      return !!(events.get(element) || {})[key];
    },
    getKeyAction: function getKeyAction(element, key) {
      return (events.get(element) || {})[key];
    },
    setKeyAction: function setKeyAction(element, key, method, target) {
      var myEvents = events.get(element) || {};
      //if target not passed in, use element
      target = target instanceof Element ? target : element;
      //if method is a string matching a method of the target, use that.
      if (
        method &&
        method === "" + method &&
        target[method] instanceof Function
      ) {
        method = element[method];
      }
      //if it's not a function, use a dummy method so we throw errors
      else if (!(method instanceof Function)) {
        method = function() {
          console.log(key + " KeyAction fired for " + element);
        };
      }
      myEvents[key] = method.bind(target);
      events.set(element, myEvents);

      return window.KeyNavagable;
    },
    removeKeyAction: function removeKeyAction(element, key) {
      var myEvents = events.get(element);
      if (myEvents && myEvents[key]) {
        delete myEvents[key];
        Object.keys(myEvents).length
          ? events.set(element, myEvents)
          : events.delete(element);
      }
      return window.KeyNavagable;
    },
    hasCaptureKeyAction: function hasCaptureKeyAction(element, key) {
      return !!(captures.get(element) || {})[key];
    },
    getCaptureKeyAction: function getCaptureKeyAction(element, key) {
      return (captures.get(element) || {})[key];
    },
    captureKeyAction: function captureKeyAction(element, key, method, target) {
      var myCaptures = captures.get(element) || {};
      if (!myCaptures[key]) {
        captureKeys[key] ? captureKeys[key]++ : (captureKeys[key] = 1);
      }
      target = target instanceof Element ? target : element;
      if (
        method &&
        method === "" + method &&
        element[method] instanceof Function
      ) {
        method = element[method];
      } else if (!(method instanceof Function)) {
        method = function() {
          console.log(key + " KeyCapture fired for " + element);
        };
      }
      myCaptures[key] = method.bind(element);
      captures.set(element, myCaptures);
      return window.KeyNavagable;
    },
    releaseKeyAction: function releaseKeyEvent(element, key) {
      var myCaptures = captures.get(element);
      if (myCaptures && myCaptures[key]) {
        delete myCaptures[key];
        captureKeys[key]--;
        Object.keys(myCaptures).length
          ? captures.set(element, myCaptures)
          : captures.delete(element);
      }
      return window.KeyNavagable;
    }
  };
  //make sure there's a document to add a listener to.
  view.document &&
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
        else if (
          key == "Tab" &&
          (activeElement = KeyNavagable.getTabNext(activeElement))
        ) {
          if (typeof activeElement === "function") {
            activeElement = activeElement();
          }
          if (activeElement instanceof Element) {
            activeElement.focus();
            e.preventDefault();
          }
        }
        //tab-previous set and behaviour not overriden with custom keyAction
        else if (
          key == "Shift Tab" &&
          (activeElement = KeyNavagable.getTabPrevious(activeElement))
        ) {
          if (typeof activeElement === "function") {
            activeElement = activeElement();
          }
          if (activeElement instanceof Element) {
            activeElement.focus();
            e.preventDefault();
          }
        } else if (captureKeys[key]) {
          //is the active Element is trying to capture this key
          myEvents = captures.get(captureElement);
          if (!myEvents || !myEvents[key]) {
            //if not, try to find an ancestor this is
            do {
              captureElement = captureElement.parentElement;
              myEvents = captures.get(captureElement);
            } while (captureElement && (!myEvents || !myEvents[key]));
          }
          if (
            captureElement &&
            captureElement.dispatchEvent(getKeynavEvent(captureElement))
          ) {
            e.preventDefault();
            myEvents[key]();
          }
        }
        function getKeynavEvent(useElement) {
          return new CustomEvent("keynavigation", {
            cancelable: true,
            bubbles: true,
            details: {
              key: e.key,
              altKey: e.altKey,
              ctrlKey: e.ctrlKey,
              shiftKey: e.shiftKey,
              metaKey: e.metaKey,
              relatedTarget: useElement || activeElement
            }
          });
        }
      },
      true
    );
})(self);
