## 前言
今年七月底，`Google` 正式发布了 `Jetpack Compose` 的 `1.0` 稳定版本，这说明`Google`认为`Compose`已经可以用于生产环境了。相信`Compose`的广泛应用就在不远的将来，现在应该是学习`Compose`的一个比较好的时机    
在了解了`Compose`的基本知识与原理之后，通过一个完整的项目继续学习`Compose`应该是一个比较好的方式。本文主要基于`Compose`，`MVI`架构，单`Activity`架构等，快速实现一个`wanAndroid`客户端,如果对您有所帮助可以点个`Star`: [wanAndroid-compose](https://github.com/shenzhen2017/wanandroid-compose)

## 效果图
首先看下效果图   

| ![请添加图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96de754d85fc411891183bcc62e19e1d~tplv-k3u1fbpfcp-zoom-1.image) | ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/651d400f7a4a4c0c8779fe9626a06b9b~tplv-k3u1fbpfcp-zoom-1.image) |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![请添加图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/15a72ae384124b9e9aafddd7edc4ce4b~tplv-k3u1fbpfcp-zoom-1.image) | ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f55c5f1e366742ccb417450bfbe8a73e~tplv-k3u1fbpfcp-zoom-1.image) |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![请添加图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c25535ca6254623b638e29c72ac1251~tplv-k3u1fbpfcp-zoom-1.image) | ![请添加图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/541c8d1f70dd4b0daf3706d3bc953684~tplv-k3u1fbpfcp-zoom-1.image) |

## 主要实现介绍
各个页面的具体实现可以查看源码，这里主要介绍一些主要的实现与原理    

### 使用`MVI`架构
`MVI` 与 `MVVM` 很相似，其借鉴了前端框架的思想，更加强调数据的单向流动和唯一数据源,架构图如下所示     
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb3fe9361e244430bd2f69b70c7b0e75~tplv-k3u1fbpfcp-watermark.awebp)      
其主要分为以下几部分    
1. `Model`: 与`MVVM`中的`Model`不同的是，`MVI`的`Model`主要指`UI`状态（`State`）。例如页面加载状态、控件位置等都是一种`UI`状态       
2. `View`: 与其他`MVX`中的`View`一致，可能是一个`Activity`或者任意`UI`承载单元。`MVI`中的`View`通过订阅`Model`的变化实现界面刷新     
3. `Intent`: 此`Intent`不是`Activity`的`Intent`，用户的任何操作都被包装成`Intent`后发送给`Model`层进行数据请求      

例如登录页面的`Model`与`Intent`定义如下    
```kotlin
/**
* 页面所有状态
/
data class LoginViewState(
    val account: String = "",
    val password: String = "",
    val isLogged: Boolean = false
)

/**
 * 一次性事件
 */
sealed class LoginViewEvent {
    object PopBack : LoginViewEvent()
    data class ErrorMessage(val message: String) : LoginViewEvent()
}

/**
* 页面Intent,即用户的操作
/
sealed class LoginViewAction {
    object Login : LoginViewAction()
    object ClearAccount : LoginViewAction()
    object ClearPassword : LoginViewAction()
    data class UpdateAccount(val account: String) : LoginViewAction()
    data class UpdatePassword(val password: String) : LoginViewAction()
}
```
如上所示   
1. 通过`ViewState`定义页面所有状态        
2. `ViewEvent`定义一次性事件如`Toast`，页面关闭事件等    
3. 通过`ViewAction`定义所有用户操作    

`MVI`架构与`MVVM`架构的主要区别在于：   
1. `MVVM`并没有约束`View`层与`ViewModel`的交互方式，具体来说就是`View`层可以随意调用`ViewModel`中的方法，而`MVI`架构下`ViewModel`的实现对`View`层屏蔽，只能通过发送`Intent`来驱动事件。
2. `MVVM` 的 `ViewModle` 中分散定义了多个 `State` ，`MVI` 使用 `ViewState` 对 `State` 集中管理，只需要订阅一个 `ViewState` 便可获取页面的所有状态，相对 `MVVM` 减少了不少模板代码

`Compose` 的声明式`UI`思想来自 `React`，理论上同样来自 `Redux` 思想的 `MVI` 应该是 `Compose` 的最佳伴侣       
但是`MVI`也只是在`MVVM`的基础上做了一定的改良，`MVVM` 也可以很好地配合 `Compose` 使用,各位可根据自己的需要选择合适的架构      

关于`Compose`的架构选择可参考：[Jetpack Compose 架构如何选？ MVP, MVVM, MVI](https://juejin.cn/post/6969382803112722446)

### 单`Activity`架构   
早在`View`时代，就有不少推荐单`Activity`+多`Fragment`架构的文章，`Google`也推出了`Jetpack Navigation`库来支持这种单`Activity`架构     
对于`Compose`来说，因为`Activity`与`Compose`是通过`AndroidComposeView`来中转的，`Activity`越多，就需要创建出越多的`AndroidComposeView`,对性能有一定影响  
而使用单`Activity`架构，所有变换页面跳转都在`Compose`内部完成，可能也是出于这个原因，目前`Google`的示例项目都是基于单`Activity`+`Navigation`+多`Compose`架构的    

但是使用单`Activity`架构也需要解决一些问题     
1. 所有的`viewModel`都在一个`Activity`的`ViewModelStoreOwner`中，那么当一个页面销毁了，此页面用过的`viewModel`应该什么时候销毁呢？      
2. 有时候页面需要监听自己这个页面的`onResume`，`onPause`等生命周期，单`Activity`架构下如何监听生命周期呢?    

我们下面就一起来看下如何解决单`Activity`架构下的这两个问题    

### 页面`ViewModel`何时销毁?
在`Compose`中一般可以通过以下两种方式获取`ViewModel`     
```kotlin
//方式1   
@Composable
fun LoginPage(
    loginViewModel: LoginViewModel = viewModel()
) {
	//...
}

//方式2   
@Composable
fun LoginPage(
    loginViewModel: LoginViewModel = hiltViewModel()
) {
	//...
}
```
如上所示：  
1. 方式1将返回一个与`ViewModelStoreOwner`(一般是`Activity`或`Fragment`)绑定的`ViewModel`，如果不存在则创建，已存在则直接返回。很明显通过这种方式创建的`ViewModel`的生命周期将与`Activity`一致，在单`Activity`架构中将一直存在，不会释放。   
2. 方式2通过`Hilt`实现，可以在`Composable`中获取`NavGraph Scope`或`Destination Scope` 的 `ViewModel`，并自动依赖 `Hilt` 构建。`Destination Scope` 的 `ViewModel` 会跟随 `BackStack` 的弹出自动 `Clear` ，避免泄露。

总得来说，通过`hiltViewModel`与`Navigation`配合，是一个更好的选择    

### `Compose`如何获取生命周期?
为了在`Compose`中获取生命周期，我们需要先了解下[副作用](https://developer.android.google.cn/jetpack/compose/side-effects?hl=zh-cn)      
用一句话概括副作用：一个函数的执行过程中，除了返回函数值之外，对调用方还会带来其他附加影响，例如修改全局变量或修改参数等。      

副作用必须在合适的时机执行，我们首先需要明确一下`Composable`的生命周期：     
1. `onActive（or onEnter）`：当`Composable`首次进入组件树时      
2. `onCommit（or onUpdate）`：`UI`随着`recomposition`发生更新时        
3. `onDispose（or onLeave）`：当`Composable`从组件树移除时          

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07432c8e4f5c4492baff11f3f1fb4802~tplv-k3u1fbpfcp-watermark.awebp)      

了解了`Compose`的生命周期后，我们可以发现，如果我们在`onActive`时监听`Activity`的生命周期，在`onDispose`时取消监听，不就可以实现在`Compose`中获取生命周期了吗?     
`DisposableEffect`可以帮助我们实现这个需求，`DisposableEffect`在其监听的`Key`发生变化，或`onDispose`时会执行    
我们还可以通过添加参数，让其仅在`onActive`与`onDispose`时执行：例如`DisposableEffect(true)`或`DisposableEffect(Unit)`          

通过以下方式，就可以实现在`Compose`中监听页面生命周期    
```kotlin
@Composable
fun LoginPage(
    loginViewModel: LoginViewModel = hiltViewModel()
) {
    val lifecycleOwner = LocalLifecycleOwner.current
    DisposableEffect(key1 = Unit) {
        val observer = object : LifecycleObserver {
            @OnLifecycleEvent(Lifecycle.Event.ON_RESUME)
            fun onResume() {
                viewModel.dispatch(Action.Resume)
            }

            @OnLifecycleEvent(Lifecycle.Event.ON_PAUSE)
            fun onPause() {
                viewModel.dispatch(Action.Pause)
            }
        }
        lifecycleOwner.lifecycle.addObserver(observer)
        onDispose {
            lifecycleOwner.lifecycle.removeObserver(observer)
        }

    }
}
```

当然有时也不需要这么复杂，比如我们需要在进入或返回`ProfilePage`页面时刷新登录状态，并根据登录状态确认页面`UI`，就可以通过以下方式实现    
```kotlin
@Composable
fun ProfilePage(
    navCtrl: NavHostController,
    scaffoldState: ScaffoldState,
    viewModel: ProfileViewModel = hiltViewModel()
) {
    //...

    DisposableEffect(Unit) {
        Log.i("debug", "onStart")
        viewModel.dispatch(ProfileViewAction.OnStart)
        onDispose {
        }
    }
}    
```
如上所示，每当进入页面或返回该页面时，我们就可以刷新页面登录状态了     

### `Compose`如何保存`LazyColumn`列表状态
相信使用过`LazyColumn`的同学都碰到过下面的问题     
> 使用`Paging3`加载分页数据，并显示到页面`A`的`LazyColumn`上，向下滑动`LazyColumn`，然后`navigation.navigate`跳转到页面`B`，接着再`navigatUp`回到页面`A`，页面`A`的`LazyColumn`又回到了列表顶部    

`LazyColumn`出现这个问题的原因主要在于它用于记录滚动位置的参数`LazyListState`没有做持久化保存，当重新回到`A`页面时,`LazyListState`数据重新变为默认值0，自然就回到顶部了，如下图所示    
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/291ab6de0d274da2bb1d875faa3c7d7e~tplv-k3u1fbpfcp-watermark.awebp?)      

既然原因在于`LazyListState`没有被保存，那我们将`LazyListSate`保存在`ViewModel`中就可以了，如下所示    
```kotlin
@HiltViewModel
class SquareViewModel @Inject constructor(
    private var service: HttpService,
) : ViewModel() {
    private val pager by lazy { simplePager { service.getSquareData(it) }.cachedIn(viewModelScope) }
    val listState: LazyListState = LazyListState()
}

@Composable
fun SquarePage(
    navCtrl: NavHostController,
    scaffoldState: ScaffoldState,
    viewModel: SquareViewModel = hiltViewModel()
) {
    val squareData = viewStates.pagingData.collectAsLazyPagingItems()
    // val listState = viewStates.listState //一般这样就够了
    // 当使用`Paging`时的特殊处理，一般直接使用viewStates.listState即可    
    val listState = if (squareData.itemCount > 0) viewStates.listState else LazyListState()

    RefreshList(squareData, listState = listState) {
        itemsIndexed(squareData) { _, item ->
           //...
        }
    }
}
```
需要注意的是，针对一般的页面，直接使用`viewModel.listState`即可，不过我在使用`Paing`时发现返回页面时`Paging`的`itemCount`会暂时变为0，导致`listState`也变为0，所以需要做一些特殊处理      
关于`LazyColumn`滚动丢失的问题，更详细的讨论可参考：[Scroll position of LazyColumn built with collectAsLazyPagingItems is lost when using Navigation
](https://issuetracker.google.com/issues/177245496?pli=1)   

## 总结
### 项目地址
[https://github.com/shenzhen2017/wanandroid-compose](https://github.com/shenzhen2017/wanandroid-compose)         
开源不易，如果项目对你有所帮助，欢迎点赞,`Star`,收藏~    

### 参考资料
[https://github.com/manqianzhuang/HamApp](https://github.com/manqianzhuang/HamApp)     
[https://github.com/linxiangcheer/PlayAndroid](https://github.com/linxiangcheer/PlayAndroid)     
[从零到一写一个完整的 Compose 版本的天气](https://juejin.cn/post/7030986229512404999)        