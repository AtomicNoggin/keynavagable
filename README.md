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

Set the element to focus on when tab is pressed.
Value can either be an Element or a string representing the id of an Element. Will also read the id value set in a `tab-next` attribute.

### Element.prototype.tabPrevious

Set the element to focus on when shift-tab is pressed.
Value can either be an Element or a string representing the id of an Element. Will also read the id value set in a `tab-previous` attribute.

## Methods

### Element.prototype.setKeyAction(key,method[,target])

#### Arguments:

**key**: the key press or key press combination to listen for while this element has focus. Maps to the KeyboardEvent key value (with the exception of ' ', which becomes 'Space').
If modifier keys are required, those should added prior to the key (e.g. `Shift ArrowUp` or `Alt Control PageDown`) in alphabetical order

_Note_: for alpha-numeric keys, Shift does not need to be provided, as the key value will already detail this
(e.g. `Shift w` will not work, but `W` will)

**method**: the function to fire when this key combination is pressed. Can be an actual function, or a string that represents the name of the Element's method to fire.

**target**: the Element to bind to the method. Defaults to the current Element if omitted.

### Element.prototype.removeKeyAction(key)

#### Arguments:

**key**: the key press or key press combination to stop listening for.

### Element.prototype.captureKeyAction(key,method[,target])

#### Arguments:

**key**: the key press or key press combination to listen for while children of this element has focus.

**method**: the function to fire when this key combination is pressed. Can be an actual function, or a string that represents the name of the Element's method to fire.

**target**: the Element to bind to the method. Defaults to the current Element if omitted.

### Element.prototype.releaseKeyAction(key)

#### Arguments:

**key**: the key press or key press combination to stop listening for on behalf of this elements children
