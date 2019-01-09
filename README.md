# keynavagable
lightweight keyboard navigation manager

## Properties
### Element.protoype.tabNext
Set the element to focus on when tab is pressed. 
Value can either be an Element or a string reperesnting the id of an element. Will also read the id value set in a `tab-next` attribute.

### Element.prototype.tabPrevious
Set the element to focus on when shift-tab is pressed. 
Value can either be an Element or a string reperesnting the id of an element. Will also read the id value set in a `tab-next` attribute.

## Methods
### Element.protoype.setKeyAction(key,method[,target])
#### Arguments:
**key**: the key press, or key press combination, to listen for while this element has focus. Maps to the keyboard event key value (with the exception of ' ', which becomes 'Space').
   if modifier keys are required, those should added as suffixes (e.g. `Shift-UpArrow` or `Alt-Control-PageDown`) in alpabetical order
   note, for alpha-nummeric keys, Shift does not need to be be provided, as the key value will already detail this 
   (e.g. `Shift-w` will not work, but `W` will)
**method**: the function to fire when this key combination is pressed. Can be an actual function, or a string that represents ther name of the method to fire.
**target**: the element to bind to the method. Defaults to the current element if omitted.
### Element.protoype.removeKeyAction(key)
#### Arguments:
**key**: the key press, or key press combination, to stop listening listen for while this element has focus. Maps to the keyboard event key value (with the exception of ' ', which becomes 'Space').
   if modifier keys are required, those should added as suffixes (e.g. `Shift-UpArrow` or `Alt-Control-PageDown`) in alpabetical order
   note, for alpha-nummeric keys, Shift does not need to be be provided, as the key value will already detail this 
   (e.g. `Shift-w` will not work, but `W` will)
