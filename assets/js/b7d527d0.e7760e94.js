"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5913],{3905:function(e,n,r){r.d(n,{Zo:function(){return s},kt:function(){return m}});var t=r(7294);function a(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function o(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function l(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?o(Object(r),!0).forEach((function(n){a(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function i(e,n){if(null==e)return{};var r,t,a=function(e,n){if(null==e)return{};var r,t,a={},o=Object.keys(e);for(t=0;t<o.length;t++)r=o[t],n.indexOf(r)>=0||(a[r]=e[r]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)r=o[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var c=t.createContext({}),p=function(e){var n=t.useContext(c),r=n;return e&&(r="function"==typeof e?e(n):l(l({},n),e)),r},s=function(e){var n=p(e.components);return t.createElement(c.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},d=t.forwardRef((function(e,n){var r=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,s=i(e,["components","mdxType","originalType","parentName"]),d=p(r),m=a,f=d["".concat(c,".").concat(m)]||d[m]||u[m]||o;return r?t.createElement(f,l(l({ref:n},s),{},{components:r})):t.createElement(f,l({ref:n},s))}));function m(e,n){var r=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var o=r.length,l=new Array(o);l[0]=d;var i={};for(var c in n)hasOwnProperty.call(n,c)&&(i[c]=n[c]);i.originalType=e,i.mdxType="string"==typeof e?e:a,l[1]=i;for(var p=2;p<o;p++)l[p]=r[p];return t.createElement.apply(null,l)}return t.createElement.apply(null,r)}d.displayName="MDXCreateElement"},714:function(e,n,r){r.r(n),r.d(n,{assets:function(){return u},contentTitle:function(){return p},default:function(){return f},frontMatter:function(){return c},metadata:function(){return s},toc:function(){return d}});var t=r(7462),a=r(3366),o=(r(7294),r(3905)),l=r.p+"assets/images/demo-66b7784a0c8c420ecfb1f4c06f2fcc99.gif",i=["components"],c={title:"Slider"},p=void 0,s={unversionedId:"elements/slider",id:"elements/slider",title:"Slider",description:"Slider \u5141\u8bb8\u7528\u6237\u4ece\u4e00\u5b9a\u8303\u56f4\u7684\u6570\u503c\u4e2d\u8fdb\u884c\u9009\u62e9\u3002",source:"@site/docs/elements/slider.mdx",sourceDirName:"elements",slug:"/elements/slider",permalink:"/docs/elements/slider",draft:!1,editUrl:"https://github.com/compose-museum/jetpack-compose-book/tree/master/docs/elements/slider.mdx",tags:[],version:"current",frontMatter:{title:"Slider"},sidebar:"docs",previous:{title:"Image",permalink:"/docs/elements/image"},next:{title:"Text",permalink:"/docs/elements/text"}},u={},d=[],m={toc:d};function f(e){var n=e.components,r=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,t.Z)({},m,r,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-kotlin"},"@Composable\nfun Slider(\n    value: Float,\n    onValueChange: (Float) -> Unit,\n    modifier: Modifier = Modifier,\n    enabled: Boolean = true,\n    valueRange: ClosedFloatingPointRange<Float> = 0f..1f,\n    /*@IntRange(from = 0)*/\n    steps: Int = 0,\n    onValueChangeFinished: (() -> Unit)? = null,\n    interactionSource: MutableInteractionSource = remember { MutableInteractionSource() },\n    colors: SliderColors = SliderDefaults.colors()\n)\n")),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"Slider")," \u5141\u8bb8\u7528\u6237\u4ece\u4e00\u5b9a\u8303\u56f4\u7684\u6570\u503c\u4e2d\u8fdb\u884c\u9009\u62e9\u3002"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"Slider")," \u53cd\u6620\u4e86\u4e00\u4e2a\u6cbf\u6761\u7684\u6570\u503c\u8303\u56f4\uff0c\u7528\u6237\u53ef\u4ee5\u4ece\u4e2d\u9009\u62e9\u4e00\u4e2a\u5355\u4e00\u7684\u6570\u503c\u3002\u5b83\u4eec\u662f\u8c03\u6574\u97f3\u91cf\u3001\u4eae\u5ea6\u6216\u5e94\u7528\u56fe\u50cf\u8fc7\u6ee4\u5668\u7b49\u8bbe\u7f6e\u7684\u7406\u60f3\u9009\u62e9\u3002"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://material.io/components/sliders"},"Material Design Slider")),(0,o.kt)("p",null,"\u6765\u770b\u770b\u4e00\u4e2a\u7b80\u5355\u7684\u7528\u6cd5\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-kotlin"},"\nvar progress by remember{ mutableStateOf(0f)}\n\nSlider(\n    value = progress,\n    colors = SliderDefaults.colors(\n        thumbColor = Color.White, // \u5706\u5708\u7684\u989c\u8272\n        activeTrackColor = Color(0xFF0079D3)\n    ),\n    onValueChange = {\n        progress = it\n    },\n)\n")),(0,o.kt)("img",{src:l}),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-kotlin"},"@Composable\nfun colors(\n    thumbColor: Color = MaterialTheme.colors.primary,\n    disabledThumbColor: Color = MaterialTheme.colors.onSurface\n        .copy(alpha = ContentAlpha.disabled)\n        .compositeOver(MaterialTheme.colors.surface),\n    activeTrackColor: Color = MaterialTheme.colors.primary,\n    inactiveTrackColor: Color = activeTrackColor.copy(alpha = InactiveTrackAlpha),\n    disabledActiveTrackColor: Color = MaterialTheme.colors.onSurface.copy(alpha = DisabledActiveTrackAlpha),\n    disabledInactiveTrackColor: Color = disabledActiveTrackColor.copy(alpha = DisabledInactiveTrackAlpha),\n    activeTickColor: Color = contentColorFor(activeTrackColor).copy(alpha = TickAlpha),\n    inactiveTickColor: Color = activeTrackColor.copy(alpha = TickAlpha),\n    disabledActiveTickColor: Color = activeTickColor.copy(alpha = DisabledTickAlpha),\n    disabledInactiveTickColor: Color = disabledInactiveTrackColor.copy(alpha = DisabledTickAlpha)\n)\n")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-kotlin"},"// \u6ed1\u6761\u672a\u7ecf\u8fc7\u90e8\u5206\u7684\u9ed8\u8ba4 alpha \u503c\nconst val InactiveTrackAlpha = 0.24f\n\n// \u5f53\u6ed1\u6761\u88ab\u7981\u7528\u7684\u72b6\u6001\u4e0b\u5df2\u7ecf\u8fc7\u90e8\u5206\u7684\u9ed8\u8ba4 alpha \u503c\nconst val DisabledInactiveTrackAlpha = 0.12f\n\n// \u5f53\u6ed1\u6761\u88ab\u7981\u7528\u7684\u72b6\u6001\u4e0b\u672a\u7ecf\u8fc7\u90e8\u5206\u7684\u9ed8\u8ba4 alpha \u503c\nconst val DisabledActiveTrackAlpha = 0.32f\n\n// \u5728\u6ed1\u6761\u4e0a\u65b9\u663e\u793a\u7684\u523b\u5ea6\u7684\u9ed8\u8ba4\u7684 alpha \u503c\nconst val TickAlpha = 0.54f\n\n// \u5f53\u523b\u5ea6\u7ebf\u88ab\u7981\u7528\u65f6\uff0c\u9ed8\u8ba4\u7684 alpha \u503c\nconst val DisabledTickAlpha = 0.12f\n")),(0,o.kt)("p",null,"\u4ece\u6e90\u7801\u4e2d\uff0c\u6211\u4eec\u53ef\u4ee5\u77e5\u9053\uff0c\u8bbe\u7f6e\u6ed1\u6761\u7ecf\u8fc7\u533a\u57df\u7684\u989c\u8272\u662f ",(0,o.kt)("inlineCode",{parentName:"p"},"activeTrackColor"),", \u800c\u6ed1\u6761\u4e2d\u672a\u7ecf\u8fc7\u7684\u5730\u65b9\u662f ",(0,o.kt)("inlineCode",{parentName:"p"},"inactiveTrackColor"),"\uff0c\u5b83\u5c06 ",(0,o.kt)("inlineCode",{parentName:"p"},"activeTrackColor")," \u590d\u5236\uff0c\u5e76\u4e14\u8bbe\u7f6e\u4e86 ",(0,o.kt)("inlineCode",{parentName:"p"},"0.24f")," \u7684\u900f\u660e\u5ea6"),(0,o.kt)("p",null,"\u6240\u4ee5\u4e00\u822c\u6765\u8bf4\uff0c\u6211\u4eec\u53ea\u9700\u8981\u8bbe\u7f6e ",(0,o.kt)("inlineCode",{parentName:"p"},"activeTrackColor")," \u7684\u503c\u5c31\u53ef\u4ee5\u6539\u53d8\u6ed1\u6761\u7684\u603b\u4f53\u989c\u8272\uff08\u7ecf\u8fc7\u548c\u672a\u7ecf\u8fc7\u7684\u533a\u57df\uff09"))}f.isMDXComponent=!0}}]);