# keynavagable

Lightweight keyboard navigation manager. Extends the Element object to allow
custom key navigation events to be set on focusable elements, or capture
key navigation events of child focusable elements.

## Usage

```js
// assumes aria tab elements are focusable (e.g. tabindex="-1")
let tabs = document.querySelectorAll('[role="tablist"] > [role="tab"]');
[].forEach.call(tabs, function(tab) {
  // set focus to appropriate sibling with arrow keys (assumes a focus event listener does the real work)
  tab.setKeyAction("ArrowRight", function() {
    let nextTab = this.nextElementSibling;
    while (nextTab && !nextTab.matches('[role="tab"]')) {
      nextTab = nextTab.nextElementSibling;
    }
    nextTab && nextTab.focus();
  });
  tab.setKeyAction("ArrowLeft", function() {
    let prevTab = this.previousElementSibling;
    while (prevTab && !prevTab.matches('[role="tab"]')) {
      prevTab = preTab.previousElementSibling;
    }
    prevTab && prevTab.focus();
  });
  //tab key takes you to the appropriate panel
  tab.tabNext(tab.getAttribute("aria-controls"));
});

// tablist does not need to be focusable to capture a key action
let lists = document.querySelectorAll('[role="tablist"]');
[].forEach.call(lists, function(list) {
  // if child element has focus move to top or bottom of list on Home/End
  list.captureKeyAction("Home", function() {
    list.firstElementChild.focus();
  });
  list.captureKeyAction("End", function() {
    list.lastElementChild.focus();
  });
});

let panels = document.querySelectorAll('[role="tabpanel"]');
[].forEach.call(panels, function(panel) {
  let myTab = panel.getAttribute("aria-labelledby");
  //Shift up arrow anywhere within the tab panel brings you to the tab element
  panel.captureKeyAction("Shift ArrowUp", function() {
    myTab && document.getElementById(myTab).focus();
  });
  //tabpanel should be focusable
  //shift-tab when the panel has focus also takes you back to the tab element
  myTab && panel.tabPrevious(myTab);
});
```

## Properties

### Element.prototype.tabNext

Set the element to move focus to when the `Tab` key is pressed.
Value can either be an Element, a function, or a string representing the id of an element. Will alternately read the id value set in a `tab-next` attribute.

If tabNext is set to a function, it must either return an element or null. If null is returned, the default tab order will occur.

### Element.prototype.tabPrevious

Set the element to move focus to when the `Shift Tab` keys are pressed.
Value can either be an Element, a function, or a string representing the id of an element. Will alternately read the id value set in a `tab-previous` attribute.

If tabPrevious is set to a function, it must either return an Element or null. If null is returned, the default tab order will occur.

## Methods

### Element.prototype.setKeyAction(key,method[,target])

Associate a key press or key press combination to a function for a given element.

#### Arguments:

**key**: the key press or key press combination to listen for while this element has focus. Maps to the [KeyboardEvent key](https://github.com/cvan/keyboardevent-key-polyfill) value (with the exception of `' '`, which becomes `Space`).
If modifier keys are required, those need to be added prior to the key (e.g. `Shift ArrowUp` or `Alt Control PageDown`) in alphabetical order

_Note_: for alpha-numeric keys, Shift does not need to be provided, as the key value will already detail this (e.g. `Shift w` will not work, but `W` will)

**method**: the function to fire when this key combination is pressed. Can be an actual function, or a string that represents the name of the Element's method to fire.

**target**: the Element to bind the method to. Defaults to the current Element if omitted.

### Element.prototype.removeKeyAction(key)

Stop associating a key press or key press combination to an element

#### Arguments:

**key**: the key press or key press combination to stop listening for.

### Element.prototype.getKeyAction(key)

return an element's associated function, if any, based on the given key press or key press combination

#### Arguments:

**key**: the key press or key press combination associated to the desired function.

#### Returns:

`Function` The associated function or `undefined` if no function exists.

_Note_: The function provided will be bound to target element of the original `setKeyAction` call.

### Element.prototype.hasKeyAction(key)

check if an element has an associated function, if any, based on the given key press or key press combination

#### Arguments:

**key**: the key press or key press combination associated to the desired function.

#### Returns:

`Boolean`

### Element.prototype.captureKeyAction(key,method[,target])

Associate a key press or key press combination to a function for a given element or any of it's children

_Note_: Any key press combination associated to an element with focus via `setKeyAction` will take precedence over an ancestor's `captureKeyAction` associated function.

If an element has functions set to the same key press combination via both `setKeyAction` and `captureKeyAction`, the `setKeyAction` will fire if the given element has focus, but the `captureKeyAction` function will fire if a child element has focus.

If nested elements have functions associated the same key press combination via `captureKeyAction`, only the most immediate (closest) ancestor to the focused element will fire its' function.

#### Arguments:

**key**: the key press or key press combination to listen for while this element or one of it's children has focus.

**method**: the function to fire when this key combination is pressed. Can be an actual function, or a string that represents the name of the element's method to fire.

**target**: the Element to bind to the method. Defaults to the current element if omitted.

### Element.prototype.releaseKeyAction(key)

Stop associating a key press or key press combination to a given element or any of it's children.

#### Arguments:

**key**: the key press or key press combination to stop listening for on behalf of this elements children

### Element.prototype.getCaptureKeyAction(key)

Return an element's associated capture function, if any, based on the given key press or key press combination

#### Arguments:

**key**: the key press or key press combination associated to the desired function.

#### Returns:

`Function` The associated function or `undefined` if no function exists.

_Note_: The function provided will be bound to target element of the original `capturedKeyAction` call.

### Element.prototype.hasCaptureKeyAction(key)

check if an element has an associated capture function, if any, based on the given key press or key press combination

#### Arguments:

**key**: the key press or key press combination associated to the desired function.

#### Returns:

`Boolean`
