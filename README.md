# keynavagable

Lightweight keyboard navigation manager. Extends the Element object to allow
custom key navigation events to be set on focusable Elements, or capture
key navigation events of child focusable Elements.

## Usage

```js
// assumes list Elements are focusable (e.g. tabindex="-1")
let listItems = document.querySelectorAll('[role="list"] > [role="listitem"]');
[].forEach.call(listItems, function(item) {
  // set focus to appropriate sibling with arrow keys
  item.setKeyAction('ArrowDown',function() { item.nextElementSibling.focus() });
  item.setKeyAction('ArrowUp',function() { item.previousElementSibling.focus() });
});

// list does not need to be focusable to capture a key action
let lists = document.querySelectorAll('[role="list"]');
[].forEach.call(lists, function(list) {
  // if child element has focus move to top or bottom of list on Home/End
  list.captureKeyAction('Home',function() { list.firstElementChild.focus(); });
  list.captureKeyAction('End',function() { list.lastElementChild.focus(); });
}
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
If modifier keys are required, those should added prior to the key (e.g. `Shift UpArrow` or `Alt Control PageDown`) in alphabetical order

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
