var bluegenesToolReactome=function(e){var t={};function o(r){if(t[r])return t[r].exports;var n=t[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,o),n.l=!0,n.exports}return o.m=e,o.c=t,o.d=function(e,t,r){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(o.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)o.d(r,n,function(t){return e[t]}.bind(null,n));return r},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=0)}([function(e,t,o){"use strict";function r(e,t,o,r,n){var i,a={attemptsLeft:5,timer:1e3},l=n.columnMapping[o.class][o.format],c=new imjs.Service(t);if("Pathway"==o.class){var s=function(e){return{from:"Pathway",select:["identifier","name","dataSets.name"],orderBy:[{path:"identifier",direction:"ASC"}],where:[{path:"id",op:"=",value:e},{path:"dataSets.name",op:"==",value:"Reactome pathways data set"}]}}(o.value);c.records(s).then(function(t){t.length>0?(i=t[0].identifier,u()):function(e,t,o){console.log(e),t?o.parentNode.removeChild(o):o.innerHTML=e}("Non-reactome pathway. Removing reactome pathway viewer",!0,e)})}else"Gene"==o.class&&c.findById(o.class,o.value).then(function(e){i=e[l],console.log("%cidentifier","color:darkseagreen;font-weight:bold;",i),u()});function u(){void 0!==_toolAPIGlobals.fireworksReady?(!function(e){var t=Reactome.Fireworks.create({proxyPrefix:"https://reactome.org",placeHolder:e.id,width:930,height:500});t.onFireworksLoaded(function(e){console.log("%cFireworks loaded successfully","border-bottom:chartreuse solid 3px;"),t.flagItems(i)})}(e),console.log("Initialising Fireworks Reactome script")):a.attemptsLeft>0&&(console.log("%cTrying to load Reactome Fireworks. Attempts left: ","color:darkseagreen;font-weight:bold;",a.attemptsLeft),window.setTimeout(u,a.timer),a.attemptsLeft--,a.timer=2*a.timer)}}o.r(t),o.d(t,"main",function(){return r})}]);