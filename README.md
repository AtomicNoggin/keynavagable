# keynavagable

Lightweight keyboard navigation manager to allow custom key navigation events 
to be set on focusable elements, or capture key navigation events of child focusable elements.

## Usage

```js
// assumes aria tab elements are focusable (e.g. tabindex="-1")
let tabs = document.querySelectorAll('[role="tablist"] > [role="tab"]');
[].forEach.call(tabs, function(tab) {
  // set focus to appropriate sibling with arrow keys (assumes a focus event listener does the real work)
  KeyNabigable
    .setKeyAction(tab,"ArrowRight", function() {
      let nextTab = this.nextElementSibling;
      while (nextTab && !nextTab.matches('[role="tab"]')) {
        nextTab = nextTab.nextElementSibling;
      }
      nextTab && nextTab.focus();
    })
    .setKeyAction(tab, "ArrowLeft", function() {
      let prevTab = this.previousElementSibling;
      while (prevTab && !prevTab.matches('[role="tab"]')) {
        prevTab = preTab.previousElementSibling;
      }
      prevTab && prevTab.focus();
    })
    //if tabpanel is focusable, the tab key should takes you to it
    .setTabNext(tab,tab.getAttribute("aria-controls"));
    // NOTE: setting aria-flowto on the tab will implicitly make this connection as well.
});

// tablist does not need to be focusable to capture a key action
let lists = document.querySelectorAll('[role="tablist"]');
[].forEach.call(lists, function(list) {
  // if child element has focus move to top or bottom of list on Home/End
  KeyNavigable
    .captureKeyAction(list, "Home", function() {
      list.firstElementChild.focus();
    })
    .captureKeyAction("End", function() {
      list.lastElementChild.focus();
    });
});

let panels = document.querySelectorAll('[role="tabpanel"]');
[].forEach.call(panels, function(panel) {
  //Shift up arrow anywhere within the tab panel brings you to the tab element
  KeyNavigable.captureKeyAction(panel,"Shift ArrowUp", function() {
    myTab && document.getElementById(myTab).focus();
  });
  //if tabpanel is focasable, shift-tab return to the tab element
  let myTab = panel.getAttribute("aria-labelledby");
  myTab && KeyNavigable.setTabPrevious(panel,myTab);
  // NOTE: setting aria-flowto on the tab will implicitly make this connection as well.
});
```

## Methods

### KeyNavigable.setTabNext(element, target)

Set an element's alternate target to move focus to when the `Tab` key is pressed.

#### Arguments:

**element**: the element to costomize tab order for.

**target**: the element to `Tab` to, or method for finding it. It can either be an Element, a string representing the id of an element, or a function. 

If target is set to a function, it must either return an element or null. If null is returned, the default tab order will occur.

Otherwise, If target is a string or an element with an id, the target's setTabPrevious will also implicetly be set by virtue of having this element's `aria-flowto` being set.

### KeyNavigable.getTabNext(element)

Lookup an elements target, if any, that will recieve focus if `Tab` is pressed.

#### Arguments ####

**element** The element who's target you are looking for

**returns** one of 
  - the target set for `element` by setTabNext, either directly or by id reference,
  - the function set for `element` by setTabNext,
  - the Element who's id value is set in `element`'s `aria-flowto` attribute.
  - `null` if none of the above criteria are set

#### Arguments:

**element**: the element to move focus from.

This method is used internally

### KeyNavigable.setTabPrevious(element, value)

Set an element's alternate target to move focus to when the `Shift Tab` key is pressed.

#### Arguments:

**element**: the element to costomize tab order for.

**target**: the element to `Shift Tab` to, or method for finding it. It can either be an Element, a string representing the id of an element, or a function. 

If target is set to a function, it must either return an element or null. If null is returned, the default tab order will occur.

### KeyNavigable.getTabPrevious(element)

Lookup an elements target, if any, that will recieve focus if `Shift Tab` is pressed.

#### Arguments ####

**element** The element who's target you are looking for

**returns** one of 
  - the target set for `element` by setTabPrevious, either directly or by id reference,
  - the function set for `element` by setTabPrevious,
  - the Element who's id value is set in `element`'s `x-ms-aria-flowfrom` attribute.
  - the Element who's  `aria-flowto` attribute matches the `element`'s id.
  - `null` if none of the above criteria are set

#### Arguments:

**element**: the element to costomize tab order for.

**value**: can either be an Element,  a string representing the id of an element, or a function. 

Value can either be an Element, a function, or a string representing the id of an element. Will alternately read the id value set in a `x-ms-aria-flowfrom` attribute
or find an element whose `aria-flowto` arttribute points to the activewElement.

If tabPrevious is set to a function, it must either return an Element or null. If null is returned, the default tab order will occur.

### KeyNavigable.setKeyAction(element,key,method[,target])

Associate a key press or key press combination to a function for a given element.

#### Arguments:
**element**: the element to attach the key action to

**key**: the key press or key press combination to listen for while this element has focus. Maps to the [KeyboardEvent key](https://github.com/cvan/keyboardevent-key-polyfill) value (with the exception of `' '`, which becomes `Space`).
If modifier keys are required, those need to be added prior to the key (e.g. `Shift ArrowUp` or `Alt Control PageDown`) in alphabetical order

_Note_: for alpha-numeric keys, Shift does not need to be provided, as the key value will already detail this (e.g. `Shift w` will not work, but `W` will)

**method**: the function to fire when this key combination is pressed. Can be an actual function, or a string that represents the name of the Element's method to fire.

**target**: (optional) the Element to bind the method to. Defaults to the current Element if omitted.

### KeyNavigable.removeKeyAction(element, key)

Stop associating a key press or key press combination to an element

#### Arguments:

**element**: the element to remove the key action from

**key**: the key press or key press combination to stop listening for.

### KeyNavigable.getKeyAction(key)

return an element's associated function, if any, based on the given key press or key press combination

#### Arguments:

**key**: the key press or key press combination associated to the desired function.

#### Returns:

`Function` The associated function or `undefined` if no function exists.

_Note_: The function provided will be bound to target element of the original `setKeyAction` call.

### KeyNavigable.hasKeyAction(key)

check if an element has an associated function, if any, based on the given key press or key press combination

#### Arguments:

**key**: the key press or key press combination associated to the desired function.

#### Returns:

`Boolean`

### KeyNavigable.captureKeyAction(key,method[,target])

Associate a key press or key press combination to a function for a given element or any of it's children

_Note_: Any key press combination associated to an element with focus via `setKeyAction` will take precedence over an ancestor's `captureKeyAction` associated function.

If an element has functions set to the same key press combination via both `setKeyAction` and `captureKeyAction`, the `setKeyAction` will fire if the given element has focus, but the `captureKeyAction` function will fire if a child element has focus.

If nested elements have functions associated the same key press combination via `captureKeyAction`, only the most immediate (closest) ancestor to the focused element will fire its' function.

#### Arguments:

**key**: the key press or key press combination to listen for while this element or one of it's children has focus.

**method**: the function to fire when this key combination is pressed. Can be an actual function, or a string that represents the name of the element's method to fire.

**target**: the Element to bind to the method. Defaults to the current element if omitted.

### KeyNavigable.releaseKeyAction(key)

Stop associating a key press or key press combination to a given element or any of it's children.

#### Arguments:

**key**: the key press or key press combination to stop listening for on behalf of this elements children

### KeyNavigable.getCaptureKeyAction(key)

Return an element's associated capture function, if any, based on the given key press or key press combination

#### Arguments:

**key**: the key press or key press combination associated to the desired function.

#### Returns:

`Function` The associated function or `undefined` if no function exists.

_Note_: The function provided will be bound to target element of the original `capturedKeyAction` call.

### KeyNavigable.hasCaptureKeyAction(key)

check if an element has an associated capture function, if any, based on the given key press or key press combination

#### Arguments:

**key**: the key press or key press combination associated to the desired function.

#### Returns:

`Boolean`
