"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2670],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return s}});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var u=r.createContext({}),l=function(e){var t=r.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},p=function(e){var t=l(e.components);return r.createElement(u.Provider,{value:t},e.children)},f={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},g=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,u=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),g=l(n),s=o,A=g["".concat(u,".").concat(s)]||g[s]||f[s]||i;return n?r.createElement(A,a(a({ref:t},p),{},{components:n})):r.createElement(A,a({ref:t},p))}));function s(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,a=new Array(i);a[0]=g;var c={};for(var u in t)hasOwnProperty.call(t,u)&&(c[u]=t[u]);c.originalType=e,c.mdxType="string"==typeof e?e:o,a[1]=c;for(var l=2;l<i;l++)a[l]=n[l];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}g.displayName="MDXCreateElement"},6633:function(e,t,n){n.r(t),n.d(t,{assets:function(){return p},contentTitle:function(){return u},default:function(){return s},frontMatter:function(){return c},metadata:function(){return l},toc:function(){return f}});var r=n(7462),o=n(3366),i=(n(7294),n(3905)),a=["components"],c={title:"Box"},u=void 0,l={unversionedId:"layout/box",id:"layout/box",title:"Box",description:"Box \u662f\u4e00\u4e2a\u80fd\u591f\u5c06\u91cc\u9762\u7684\u5b50\u9879\u4f9d\u6b21\u6309\u7167\u987a\u5e8f\u5806\u53e0\u7684\u5e03\u5c40\u7ec4\u4ef6\u3002",source:"@site/docs/layout/box.mdx",sourceDirName:"layout",slug:"/layout/box",permalink:"/docs/layout/box",draft:!1,editUrl:"https://github.com/compose-museum/jetpack-compose-book/tree/master/docs/layout/box.mdx",tags:[],version:"current",frontMatter:{title:"Box"},sidebar:"docs",previous:{title:"TextField",permalink:"/docs/elements/textfield"},next:{title:"BottomNavigation",permalink:"/docs/layout/bottomnavigation"}},p={},f=[],g={toc:f};function s(e){var t=e.components,n=(0,o.Z)(e,a);return(0,i.kt)("wrapper",(0,r.Z)({},g,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Box \u662f\u4e00\u4e2a\u80fd\u591f\u5c06\u91cc\u9762\u7684\u5b50\u9879\u4f9d\u6b21\u6309\u7167\u987a\u5e8f\u5806\u53e0\u7684\u5e03\u5c40\u7ec4\u4ef6\u3002"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},'Box {\n    Box(\n        modifier = Modifier.size(150.dp).background(Color.Green)\n    )\n    Box(\n        modifier = Modifier.size(80.dp).background(Color.Red)\n    )\n    Text(\n        text = "\u4e16\u754c"\n    )\n}\n')),(0,i.kt)("img",{src:"data:image/png;base64,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"}))}s.isMDXComponent=!0}}]);