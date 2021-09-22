## 前言
在页面中常常需要展示网络请求状态，以带来更好的用户体验，具体来说通常有`加载中`，`加载失败`，`加载为空`，`加载成功`等状态.       
在`XML`中我们通常用一个`ViewGroup`封装各种状态来实现，那么使用`Compose`该如何实现这种效果呢?     
本文主要介绍`Compose`如何封装一个简单易用的`StateLayout`,有兴趣的同学可以点个`Star`:[Compose版StateLayout](https://github.com/shenzhen2017/ComposeStateLayout)    

## 效果图
首先看下最终的效果图     
![](https://raw.githubusercontents.com/shenzhen2017/resource/main/2021/september/p10.gif)     

## 特性
1. 支持配置全局默认布局,如默认加载中，默认成功失败等     
2. 支持自定义默认样式文案，图片等细节     
3. 支持完全自定义样式，如自定义加载中样式     
4. 支持自定义处理点击重试事件     
5. 完全使用数据驱动，使用简单，接入方便    

## 使用
### 接入
第 1 步:在工程的`build.gradle`中添加：       
```groovy
allprojects {
	repositories {
		...
		mavenCentral()
	}
}
```

第2步：在应用的`build.gradle`中添加：     
```groovy
dependencies {
        implementation 'io.github.shenzhen2017:compose-statelayout:1.0.0'
}
```

### 简单使用
#### 定义全局样式
在框架中没有指定任何默认样式，因此你需要自定义自己的默认加载中，加载失败等页面样式        
同时需要自定义传给自定义样式的数据结构类型，方便数据驱动   
```kotlin
data class StateData(
    val tipTex: String? = null,
    val tipImg: Int? = null,
    val btnText: String? = null
)

@Composable
fun DefaultStateLayout(
    modifier: Modifier = Modifier,
    pageStateData: PageStateData,
    onRetry: OnRetry = { },
    loading: @Composable (StateLayoutData) -> Unit = { DefaultLoadingLayout(it) },
    empty: @Composable (StateLayoutData) -> Unit = { DefaultEmptyLayout(it) },
    error: @Composable (StateLayoutData) -> Unit = { DefaultErrorLayout(it) },
    content: @Composable () -> Unit = { }
) {
    ComposeStateLayout(
        modifier = modifier,
        pageStateData = pageStateData,
        onRetry = onRetry,
        loading = { loading(it) },
        empty = { empty(it) },
        error = { error(it) },
        content = content
    )
}
```
如上所示,初始化时我们主要需要做以下事    
1. 自定义默认加载中，加载失败，加载为空等样式    
2. 自定义`StateData`，即传给默认样式的数据结构，比如文案，图片等，这样后续需要修改的时候只需修改`StateData`即可      

#### 直接使用
如果我们直接使用默认样式，直接如下使用即可   
```kotlin
@Composable
fun StateDemo() {
    var pageStateData by remember {
        mutableStateOf(PageState.CONTENT.bindData())
    }
    DefaultStateLayout(
        modifier = Modifier.fillMaxSize(),
        pageStateData = pageStateData,
        onRetry = {
            pageStateData = PageState.LOADING.bindData()
        }
    ) {
        //Content
    }
}
```
如上所示，可以直接使用，如果需要修改状态，修改`pageStateData`即可      

#### 自定义文案
如果我们需要自定义文案或者图片等细节，可简单直接修改`StateData`即可    
```kotlin
fun StateDemo() {
    var pageStateData by remember {
        mutableStateOf(PageState.CONTENT.bindData())
    }
    //....
    pageStateData = PageState.LOADING.bindData(StateData(tipTex = "自定义加载中文案"))
}
```

#### 自定义布局
有时页面的加载中样式与全局的并不一样，这就需要自定义布局样式了     
```kotlin
@Composable
fun StateDemo() {
    var pageStateData by remember {
        mutableStateOf(PageState.CONTENT.bindData())
    }
    DefaultStateLayout(
        modifier = Modifier.fillMaxSize(),
        pageStateData = pageStateData,
        loading = { CustomLoadingLayout(it) },
        onRetry = {
            pageStateData = PageState.LOADING.bindData()
        }
    ) {
        //Content
    }
}
```

## 主要原理
其实`Compose`要实现不同的状态非常简单，传入不同的数据即可，如下所示:    
```kotlin
    Box(modifier = modifier) {
        when (pageStateData.status) {
            PageState.LOADING -> loading()
            PageState.EMPTY -> empty()
            PageState.ERROR -> error()
            PageState.CONTENT -> content()
        }
    }
```
其实代码非常简单，但是这段代码是个通用逻辑，如果每个页面都要写这一段代码可能也挺烦的        
所以这段代码其实是模板代码，我们想到`Scaffold`脚手架，提供了组合各个组件的`API`，包括标题栏、底部栏、`SnackBar`（类似吐司功能）、浮动按钮、抽屉组件、剩余内容布局等，让我们可以快速定义一个基本的页面结构。    

仿照`Scaffold`,我们也可以定义一个模板组件，用户可以传入自定义的`looading`,`empty`,`error`,`content`等组件，再将它们组合起来，这样就形成了`ComposeStateLayout`        
```kotlin
data class PageStateData(val status: PageState, val tag: Any? = null)

data class StateLayoutData(val pageStateData: PageStateData, val retry: OnRetry = {})

typealias OnRetry = (PageStateData) -> Unit

@Composable
fun ComposeStateLayout(
    modifier: Modifier = Modifier,
    pageStateData: PageStateData,
    onRetry: OnRetry = { },
    loading: @Composable (StateLayoutData) -> Unit = {},
    empty: @Composable (StateLayoutData) -> Unit = {},
    error: @Composable (StateLayoutData) -> Unit = {},
    content: @Composable () -> Unit = { }
) {
    val stateLayoutData = StateLayoutData(pageStateData, onRetry)
    Box(modifier = modifier) {
        when (pageStateData.status) {
            PageState.LOADING -> loading(stateLayoutData)
            PageState.EMPTY -> empty(stateLayoutData)
            PageState.ERROR -> error(stateLayoutData)
            PageState.CONTENT -> content()
        }
    }
}
```
如上所示，代码很简单，主要需要注意以下几点：   
1. `PageStateData`的`tag`即传递给自定义`loading`等页面的信息，为`Any`类型，没有任何限制，用户可灵活处理     
2. 自定义`loading`等页面也传入了`OnRetry`,因此我们也可以处理自定义点击事件   

## 总结
本文主要实现了一个`Compose`版的`StateLayout`，它具有以下特性      
1. 支持配置全局默认布局,如默认加载中，默认成功失败等     
2. 支持自定义默认样式文案，图片等细节     
3. 支持完全自定义样式，如自定义加载中样式     
4. 支持自定义处理点击重试事件     
5. 完全使用数据驱动，使用简单，接入方便    
### 项目地址
[简单易用的Compose版StateLayout](https://github.com/shenzhen2017/ComposeStateLayout)     
开源不易，如果项目对你有所帮助，欢迎点赞,Star,收藏~
