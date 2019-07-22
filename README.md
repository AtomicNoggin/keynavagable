# keynavagable

Lightweight keyboard navigation manager. Extends the Element object to allow
custom key navigation events to be set on focusable Elements, or capture
key navigation events of child focusable Elements.

## Usage

```js
// assumes tab Elements are focusable (e.g. tabindex="-1")
let tabs = document.querySelectorAll('[role="tablist"] > [role="tab"]');
[].forEach.call(tabs, function(tab) {
  // set focus to appropriate sibling with arrow keys (assumes an onfocus event listener)
  tab.setKeyAction("ArrowRight", function() {
    tab.nextElementSibling.focus();
  });
  tab.setKeyAction("ArrowLeft", function() {
    tab.previousElementSibling.focus();
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

//tabpanel should be focusable
let panels = document.querySelectorAll('[role="tabpanel"]');
[].forEach.call(panels, function(panel) {
  //Shift up arrow anywhere within the tab panel brings you to the tab element
  panel.captureKeyAction("Shift ArrowUp", function() {
    document.getElementById(panel.getAttribute("aria-labelledby")).focus();
  });
  //shift-tab when the panel has focus also takes you back to the tab element
  panel.tabPrevious(panel.getAttribute("aria-labelledby"));
});
```

## Properties

### Element.prototype.tabNext

Set the element to move focus to when the `Tab` key is pressed.
Value can either be an Element or a string representing the id of an Element. Will alternately read the id value set in a `tab-next` attribute.

### Element.prototype.tabPrevious

Set the element to move focus to when the `Shift Tab` keys are pressed.
Value can either be an Element or a string representing the id of an Element. Will alternately read the id value set in a `tab-previous` attribute.

## Methods

### Element.prototype.setKeyAction(key,method[,target])

Associate a key press or key press combination to a function for a given Element

#### Arguments:

**key**: the key press or key press combination to listen for while this element has focus. Maps to the KeyboardEvent key value (with the exception of `' '`, which becomes `Space`).
If modifier keys are required, those should added prior to the key (e.g. `Shift ArrowUp` or `Alt Control PageDown`) in alphabetical order

_Note_: for alpha-numeric keys, Shift does not need to be provided, as the key value will already detail this (e.g. `Shift w` will not work, but `W` will)

**method**: the function to fire when this key combination is pressed. Can be an actual function, or a string that represents the name of the Element's method to fire.

**target**: the Element to bind the method to. Defaults to the current Element if omitted.

### Element.prototype.removeKeyAction(key)

Stop associating a key press or key press combination to an Element

#### Arguments:

**key**: the key press or key press combination to stop listening for.

### Element.prototype.getKeyAction(key)

return an Element's associated function, if any, based on the given key press or key press combination

#### Arguments:

**key**: the key press or key press combination associated to the desired function.

**returns**: `Function` The associated function or `undefined` if no function exists.

_Note_: The function provided will be bound to target Element of the original setKeyAction call.

### Element.prototype.hasKeyAction(key)

check if an Element has an associated function, if any, based on the given key press or key press combination

#### Arguments:

**key**: the key press or key press combination associated to the desired function.

**returns**: `Boolean`

### Element.prototype.captureKeyAction(key,method[,target])

Associate a key press or key press combination to a function for a given Element or any of it's children

_Note_: Any Key Press combination associated to an Element with focus via `setKeyAction` will take precedence over an ancestor's `captureKeyAction` associated function. If an Element has functions set to the same Key Press combination via both `setKeyAction` and `captureKeyAction`, the `setKeyAction` will fire if the given Element has focus, but the `captureKeyAction` function will fire if a child Element has focus. If nested Elements have functions associated the same Key Press combination via `captureKeyAction`, only the most immediate (closest) ancestor to the focused Element will fire its' function.

#### Arguments:

**key**: the key press or key press combination to listen for while this Element or one of it's children has focus.

**method**: the function to fire when this key combination is pressed. Can be an actual function, or a string that represents the name of the Element's method to fire.

**target**: the Element to bind to the method. Defaults to the current Element if omitted.

### Element.prototype.releaseKeyAction(key)

Stop associating a key press or key press combination to a given Element or any of it's children.

#### Arguments:

**key**: the key press or key press combination to stop listening for on behalf of this elements children

### Element.prototype.getCaptureKeyAction(key)

Return an Element's associated capture function, if any, based on the given key press or key press combination

#### Arguments:

**key**: the key press or key press combination associated to the desired function.

**returns**: `Function` The associated function or `undefined` if no function exists.

_Note_: The function provided will be bound to target Element of the original capturedKeyAction call.

### Element.prototype.hasCaptureKeyAction(key)

check if an Element has an associated capture function, if any, based on the given key press or key press combination

#### Arguments:

**key**: the key press or key press combination associated to the desired function.

**returns**: `Boolean`
