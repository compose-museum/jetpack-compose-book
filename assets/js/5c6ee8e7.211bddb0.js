"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1340],{3905:function(n,e,t){t.d(e,{Zo:function(){return p},kt:function(){return s}});var o=t(7294);function r(n,e,t){return e in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}function i(n,e){var t=Object.keys(n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(n);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),t.push.apply(t,o)}return t}function a(n){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?i(Object(t),!0).forEach((function(e){r(n,e,t[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(e){Object.defineProperty(n,e,Object.getOwnPropertyDescriptor(t,e))}))}return n}function c(n,e){if(null==n)return{};var t,o,r=function(n,e){if(null==n)return{};var t,o,r={},i=Object.keys(n);for(o=0;o<i.length;o++)t=i[o],e.indexOf(t)>=0||(r[t]=n[t]);return r}(n,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(n);for(o=0;o<i.length;o++)t=i[o],e.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(n,t)&&(r[t]=n[t])}return r}var l=o.createContext({}),m=function(n){var e=o.useContext(l),t=e;return n&&(t="function"==typeof n?n(e):a(a({},e),n)),t},p=function(n){var e=m(n.components);return o.createElement(l.Provider,{value:e},n.children)},d={inlineCode:"code",wrapper:function(n){var e=n.children;return o.createElement(o.Fragment,{},e)}},u=o.forwardRef((function(n,e){var t=n.components,r=n.mdxType,i=n.originalType,l=n.parentName,p=c(n,["components","mdxType","originalType","parentName"]),u=m(t),s=r,f=u["".concat(l,".").concat(s)]||u[s]||d[s]||i;return t?o.createElement(f,a(a({ref:e},p),{},{components:t})):o.createElement(f,a({ref:e},p))}));function s(n,e){var t=arguments,r=e&&e.mdxType;if("string"==typeof n||r){var i=t.length,a=new Array(i);a[0]=u;var c={};for(var l in e)hasOwnProperty.call(e,l)&&(c[l]=e[l]);c.originalType=n,c.mdxType="string"==typeof n?n:r,a[1]=c;for(var m=2;m<i;m++)a[m]=t[m];return o.createElement.apply(null,a)}return o.createElement.apply(null,t)}u.displayName="MDXCreateElement"},1284:function(n,e,t){t.r(e),t.d(e,{assets:function(){return p},contentTitle:function(){return l},default:function(){return s},frontMatter:function(){return c},metadata:function(){return m},toc:function(){return d}});var o=t(7462),r=t(3366),i=(t(7294),t(3905)),a=["components"],c={},l=void 0,m={unversionedId:"code/layout/bottomNavigation/bottomNavigation",id:"code/layout/bottomNavigation/bottomNavigation",title:"bottomNavigation",description:"",source:"@site/docs/code/layout/bottomNavigation/bottomNavigation.md",sourceDirName:"code/layout/bottomNavigation",slug:"/code/layout/bottomNavigation/",permalink:"/docs/code/layout/bottomNavigation/",draft:!1,editUrl:"https://github.com/compose-museum/jetpack-compose-book/tree/master/docs/code/layout/bottomNavigation/bottomNavigation.md",tags:[],version:"current",frontMatter:{}},p={},d=[],u={toc:d};function s(n){var e=n.components,t=(0,r.Z)(n,a);return(0,i.kt)("wrapper",(0,o.Z)({},u,t,{components:e,mdxType:"MDXLayout"}),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},"import androidx.compose.animation.AnimatedVisibility\nimport androidx.compose.animation.ExperimentalAnimationApi\nimport androidx.compose.foundation.clickable\nimport androidx.compose.foundation.interaction.MutableInteractionSource\nimport androidx.compose.foundation.layout.*\nimport androidx.compose.foundation.shape.CircleShape\nimport androidx.compose.material.*\nimport androidx.compose.material.icons.Icons\nimport androidx.compose.material.icons.filled.Home\nimport androidx.compose.material.icons.filled.Settings\nimport androidx.compose.runtime.Composable\nimport androidx.compose.runtime.CompositionLocalProvider\nimport androidx.compose.ui.Alignment\nimport androidx.compose.ui.Modifier\nimport androidx.compose.ui.graphics.Color\nimport androidx.compose.ui.res.painterResource\nimport androidx.compose.ui.unit.dp\n\n@ExperimentalAnimationApi\n@Composable\nfun MyBottomNavigation() {\n\n    var selectedItem by remember{ mutableStateOf(0) }\n\n    BottomNavigation(\n        backgroundColor = Color.White\n    ) {\n        for(index in 0..2 ) {\n            Column(\n                modifier = Modifier\n                    .fillMaxHeight()\n                    .weight(1f)\n                    .clickable(\n                        onClick = {\n                            selectedItem = index\n                        },\n                        indication = null,\n                        interactionSource = MutableInteractionSource()\n                    ),\n                verticalArrangement = Arrangement.Center,\n                horizontalAlignment = Alignment.CenterHorizontally\n            ) {\n                NavigationIcon(index, selectedItem)\n                Spacer(Modifier.padding(top = 2.dp))\n                AnimatedVisibility(visible = index == selectedItem) {\n                    Surface(shape = CircleShape, modifier = Modifier.size(5.dp),color = Color(0xFF252527)) { }\n                }\n            }\n        }\n    }\n}\n\n@Composable\nfun NavigationIcon(\n    index:Int,\n    selectedItem:Int\n){\n    val alpha = if (selectedItem != index ) 0.5f else 1f\n\n    CompositionLocalProvider(LocalContentAlpha provides alpha) {\n        when(index){\n            0 -> Icon(Icons.Filled.Home, contentDescription = null)\n            1 -> Icon(painterResource(R.drawable.musicnote), contentDescription = null)\n            else -> Icon(Icons.Filled.Settings, contentDescription = null)\n        }\n    }\n}\n")))}s.isMDXComponent=!0}}]);