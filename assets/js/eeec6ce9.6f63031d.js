"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[4550],{3905:function(e,t,n){n.d(t,{Zo:function(){return m},kt:function(){return s}});var o=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,o,a=function(e,t){if(null==e)return{};var n,o,a={},r=Object.keys(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=o.createContext({}),d=function(e){var t=o.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},m=function(e){var t=d(e.components);return o.createElement(p.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},u=o.forwardRef((function(e,t){var n=e.components,a=e.mdxType,r=e.originalType,p=e.parentName,m=i(e,["components","mdxType","originalType","parentName"]),u=d(n),s=a,h=u["".concat(p,".").concat(s)]||u[s]||c[s]||r;return n?o.createElement(h,l(l({ref:t},m),{},{components:n})):o.createElement(h,l({ref:t},m))}));function s(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var r=n.length,l=new Array(r);l[0]=u;var i={};for(var p in t)hasOwnProperty.call(t,p)&&(i[p]=t[p]);i.originalType=e,i.mdxType="string"==typeof e?e:a,l[1]=i;for(var d=2;d<r;d++)l[d]=n[d];return o.createElement.apply(null,l)}return o.createElement.apply(null,n)}u.displayName="MDXCreateElement"},1186:function(e,t,n){n.r(t),n.d(t,{assets:function(){return c},contentTitle:function(){return d},default:function(){return h},frontMatter:function(){return p},metadata:function(){return m},toc:function(){return u}});var o=n(7462),a=n(3366),r=(n(7294),n(3905)),l=n.p+"assets/images/demo-7760f110f41acbc9f8e1f87d84d9d084.gif",i=["components"],p={title:"ModalBottomSheetLayout"},d=void 0,m={unversionedId:"layout/modalbottomsheetlayout",id:"layout/modalbottomsheetlayout",title:"ModalBottomSheetLayout",description:"ModalBottomSheetLayout \u53ef\u4ee5\u5728 App \u7684\u5e95\u90e8\u5f39\u51fa\uff0c\u5e76\u4e14\u80fd\u591f\u5c06\u80cc\u666f\u6697\u5316\u3002",source:"@site/docs/layout/modalbottomsheetlayout.mdx",sourceDirName:"layout",slug:"/layout/modalbottomsheetlayout",permalink:"/docs/layout/modalbottomsheetlayout",draft:!1,editUrl:"https://github.com/compose-museum/jetpack-compose-book/tree/master/docs/layout/modalbottomsheetlayout.mdx",tags:[],version:"current",frontMatter:{title:"ModalBottomSheetLayout"},sidebar:"docs",previous:{title:"Column",permalink:"/docs/layout/column"},next:{title:"Row",permalink:"/docs/layout/row"}},c={},u=[{value:"2. \u6536\u56de ModalBottomSheet",id:"2-\u6536\u56de-modalbottomsheet",level:2},{value:"3. \u8bbe\u7f6e\u52a8\u753b\u65f6\u95f4",id:"3-\u8bbe\u7f6e\u52a8\u753b\u65f6\u95f4",level:2},{value:"4. \u66f4\u591a",id:"4-\u66f4\u591a",level:2}],s={toc:u};function h(e){var t=e.components,n=(0,a.Z)(e,i);return(0,r.kt)("wrapper",(0,o.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-kotlin"},"@Composable\n@ExperimentalMaterialApi\nfun ModalBottomSheetLayout(\n    sheetContent: @Composable ColumnScope.() -> Unit,\n    modifier: Modifier = Modifier,\n    sheetState: ModalBottomSheetState =\n        rememberModalBottomSheetState(ModalBottomSheetValue.Hidden),\n    sheetShape: Shape = MaterialTheme.shapes.large,\n    sheetElevation: Dp = ModalBottomSheetDefaults.Elevation,\n    sheetBackgroundColor: Color = MaterialTheme.colors.surface,\n    sheetContentColor: Color = contentColorFor(sheetBackgroundColor),\n    scrimColor: Color = ModalBottomSheetDefaults.scrimColor,\n    content: @Composable () -> Unit\n)\n")),(0,r.kt)("img",{src:"https://developer.android.com/images/reference/androidx/compose/material/modal-bottom-sheet.png"}),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"ModalBottomSheetLayout")," \u53ef\u4ee5\u5728 App \u7684\u5e95\u90e8\u5f39\u51fa\uff0c\u5e76\u4e14\u80fd\u591f\u5c06\u80cc\u666f\u6697\u5316\u3002"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"ModalSheetLayout")," \u603b\u5171\u6709\u4e09\u79cd\u72b6\u6001\uff1a"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"Hidden")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"HalfExpanded")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"Expanded"))),(0,r.kt)("p",null,"\u4e00\u4e2a\u7b80\u5355\u7684 ",(0,r.kt)("inlineCode",{parentName:"p"},"ModalBottomSheetLayout")," \u7684\u4f8b\u5b50\u662f\u8fd9\u6837\u7684\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-kotlin"},'val state = rememberModalBottomSheetState(ModalBottomSheetValue.Hidden)\nval scope = rememberCoroutineScope()\nModalBottomSheetLayout(\n    sheetState = state,\n    sheetContent = {\n        Column{\n            ListItem(\n                text = { Text("\u9009\u62e9\u5206\u4eab\u5230\u54ea\u91cc\u5427~") }\n            )\n\n            ListItem(\n                text = { Text("github") }, \n                icon = {\n                    Surface(\n                        shape = CircleShape,\n                        color = Color(0xFF181717)\n                    ) {\n                        Icon(\n                            painterResource(R.drawable.github),\n                            null,\n                            tint = Color.White,\n                            modifier = Modifier.padding(4.dp)\n                        )\n                    }\n                },\n                modifier = Modifier.clickable {  }\n            )\n\n            ListItem(\n                text = { Text("\u5fae\u4fe1") }, \n                icon = {\n                    Surface(\n                        shape = CircleShape,\n                        color = Color(0xFF07C160)\n                    ) {\n                        Icon(\n                            painterResource(R.drawable.wechat),\n                            null,\n                            tint = Color.White,\n                            modifier = Modifier.padding(4.dp)\n                        )\n                    }\n                },\n                modifier = Modifier.clickable {  }\n            )\n        }\n    }\n) {\n    Column(\n        modifier = Modifier\n            .fillMaxSize()\n            .padding(16.dp),\n        horizontalAlignment = Alignment.CenterHorizontally\n    ) {\n        Button(\n            onClick = { scope.launch { state.show() } }\n        ) {\n            Text("\u70b9\u6211\u5c55\u5f00")\n        }\n    }\n}\n')),(0,r.kt)("img",{src:l,width:"30%",height:"30%"}),(0,r.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"Tips")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"\u76ee\u524d\u4f7f\u7528 ",(0,r.kt)("inlineCode",{parentName:"p"},"ModalBottomSheetLayout")," \u9700\u8981\u6807\u660e ",(0,r.kt)("inlineCode",{parentName:"p"},"@ExperimentalMaterialApi")))),(0,r.kt)("h2",{id:"2-\u6536\u56de-modalbottomsheet"},"2. \u6536\u56de ModalBottomSheet"),(0,r.kt)("p",null,"\u4e00\u822c\u60c5\u51b5\u4e0b\uff0c",(0,r.kt)("inlineCode",{parentName:"p"},"ModalBottomSheet")," \u65e0\u6cd5\u81ea\u52a8\u5904\u7406\u6309\u4e0b\u8fd4\u56de\u952e\u5c31\u6536\u8d77\uff0c\u6240\u4ee5\u6211\u4eec\u53ef\u4ee5\u7528 ",(0,r.kt)("inlineCode",{parentName:"p"},"BackHandler")," \u6765\u5904\u7406"),(0,r.kt)("p",null,"\u5728 ",(0,r.kt)("inlineCode",{parentName:"p"},"ModalBottomSheet")," \u540e\u6dfb\u52a0\u4ee3\u7801\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-kotlin"},"BackHandler(\n    enabled = (state.currentValue == ModalBottomSheetValue.HalfExpanded\n            || state.currentValue == ModalBottomSheetValue.Expanded),\n    onBack = {\n        scope.launch {\n            state.hide()\n        }\n    }\n)\n")),(0,r.kt)("h2",{id:"3-\u8bbe\u7f6e\u52a8\u753b\u65f6\u95f4"},"3. \u8bbe\u7f6e\u52a8\u753b\u65f6\u95f4"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"ModalSheetLayout")," \u9ed8\u8ba4\u7528 ",(0,r.kt)("inlineCode",{parentName:"p"},"state.show()")," \u6216\u8005 ",(0,r.kt)("inlineCode",{parentName:"p"},"state.hidden()")," \u6765\u5f39\u51fa\u548c\u6536\u56de"),(0,r.kt)("p",null,"\u6211\u4eec\u53ef\u4ee5\u901a\u8fc7\u8fd9\u6837\u7684\u65b9\u5f0f\u6765\u81ea\u5b9a\u4e49\u52a8\u753b\u65f6\u95f4"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-kotlin"},"state.animateTo(ModalBottomSheetValue.Hidden, tween(1000))\n")),(0,r.kt)("p",null,"\u5f39\u51fa\u540c\u7406 "),(0,r.kt)("h2",{id:"4-\u66f4\u591a"},"4. \u66f4\u591a"),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://developer.android.com/reference/kotlin/androidx/compose/material/package-summary#ModalBottomSheetLayout(kotlin.Function1,androidx.compose.ui.Modifier,androidx.compose.material.ModalBottomSheetState,androidx.compose.ui.graphics.Shape,androidx.compose.ui.unit.Dp,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,kotlin.Function0)"},"ModalBottomSheet \u53c2\u6570\u8be6\u60c5")))}h.isMDXComponent=!0}}]);