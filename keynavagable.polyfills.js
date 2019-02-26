/*!
 * weakmap-polyfill v2.0.0 - ECMAScript6 WeakMap polyfill
 * https://github.com/polygonplanet/weakmap-polyfill
 * Copyright (c) 2015-2016 polygon planet <polygon.planet.aqua@gmail.com>
 * @license MIT
 */
(function(e){"use strict";if(e.WeakMap){return}var t=Object.prototype.hasOwnProperty;var r=function(e,t,r){if(Object.defineProperty){Object.defineProperty(e,t,{configurable:true,writable:true,value:r})}else{e[t]=r}};e.WeakMap=function(){function WeakMap(){if(this===void 0){throw new TypeError("Constructor WeakMap requires 'new'")}r(this,"_id",genId("_WeakMap"));if(arguments.length>0){throw new TypeError("WeakMap iterable is not supported")}}r(WeakMap.prototype,"delete",function(e){checkInstance(this,"delete");if(!isObject(e)){return false}var t=e[this._id];if(t&&t[0]===e){delete e[this._id];return true}return false});r(WeakMap.prototype,"get",function(e){checkInstance(this,"get");if(!isObject(e)){return void 0}var t=e[this._id];if(t&&t[0]===e){return t[1]}return void 0});r(WeakMap.prototype,"has",function(e){checkInstance(this,"has");if(!isObject(e)){return false}var t=e[this._id];if(t&&t[0]===e){return true}return false});r(WeakMap.prototype,"set",function(e,t){checkInstance(this,"set");if(!isObject(e)){throw new TypeError("Invalid value used as weak map key")}var n=e[this._id];if(n&&n[0]===e){n[1]=t;return this}r(e,this._id,[e,t]);return this});function checkInstance(e,r){if(!isObject(e)||!t.call(e,"_id")){throw new TypeError(r+" method called on incompatible receiver "+typeof e)}}function genId(e){return e+"_"+rand()+"."+rand()}function rand(){return Math.random().toString().substring(2)}r(WeakMap,"_polyfill",true);return WeakMap}();function isObject(e){return Object(e)===e}})(typeof self!=="undefined"?self:typeof window!=="undefined"?window:typeof global!=="undefined"?global:this);

/*
 * keyboardevent-key polyfill
 * https://github.com/cvan/keyboardevent-key-polyfill
 * Licence:
 * https://github.com/cvan/keyboardevent-key-polyfill/blob/master/LICENSE.md
 */
!function(){var e,r={polyfill:function(){var e=navigator.userAgent.indexOf("MSIE ")>0||!!navigator.userAgent.match(/Trident.*rv\:11\./)||navigator.userAgent.indexOf("Edge/")>0;if(!("KeyboardEvent"in window)||"key"in KeyboardEvent.prototype&&!e)return!1;var o={get:function(e){var o=r.keys[this.which||this.keyCode];return Array.isArray(o)&&(o=o[+this.shiftKey]),o},enumerable:!0,configurable:!0};return Object.defineProperty(KeyboardEvent.prototype,"key",o),o},keys:{3:"Cancel",6:"Help",8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",28:"Convert",29:"NonConvert",30:"Accept",31:"ModeChange",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",41:"Select",42:"Print",43:"Execute",44:"PrintScreen",45:"Insert",46:"Delete",48:["0",")"],49:["1","!"],50:["2","@"],51:["3","#"],52:["4","$"],53:["5","%"],54:["6","^"],55:["7","&"],56:["8","*"],57:["9","("],91:"OS",93:"ContextMenu",106:"*",107:"+",109:"-",110:".",111:"/",144:"NumLock",145:"ScrollLock",181:"VolumeMute",182:"VolumeDown",183:"VolumeUp",186:[";",":"],187:["=","+"],188:[",","<"],189:["-","_"],190:[".",">"],191:["/","?"],192:["`","~"],219:["[","{"],220:["\\","|"],221:["]","}"],222:["'",'"'],224:"Meta",225:"AltGraph",246:"Attn",247:"CrSel",248:"ExSel",249:"EraseEof",250:"Play",251:"ZoomOut"}};for(e=1;e<25;e++)r.keys[111+e]="F"+e;var o="";for(e=65;e<91;e++)o=String.fromCharCode(e),r.keys[e]=[o.toLowerCase(),o.toUpperCase()];for(e=96;e<106;e++)o=String.fromCharCode(e-48),r.keys[e]=o;"function"==typeof define&&define.amd?define("keyboardevent-key-polyfill",r):"undefined"!=typeof exports&&"undefined"!=typeof module?module.exports=r:window&&(window.keyboardeventKeyPolyfill=r)}();
keyboardeventKeyPolyfill.polyfill();
/*
 * CustomEvent polyfill
 * https://github.com/krambuhl/custom-event-polyfill
 * License:
 * https://github.com/krambuhl/custom-event-polyfill/blob/master/LICENSE
 */
 !function(){if("undefined"!=typeof window)try{var e=new window.CustomEvent("test",{cancelable:!0});if(e.preventDefault(),!0!==e.defaultPrevented)throw new Error("Could not prevent default")}catch(e){var t=function(e,t){var n,r;return t=t||{bubbles:!1,cancelable:!1,detail:void 0},(n=document.createEvent("CustomEvent")).initCustomEvent(e,t.bubbles,t.cancelable,t.detail),r=n.preventDefault,n.preventDefault=function(){r.call(this);try{Object.defineProperty(this,"defaultPrevented",{get:function(){return!0}})}catch(e){this.defaultPrevented=!0}},n};t.prototype=window.Event.prototype,window.CustomEvent=t}}();
