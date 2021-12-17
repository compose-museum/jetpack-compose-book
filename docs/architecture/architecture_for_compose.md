

![]({{config.assets}}/architecture/demo.png)

本次 I/O 大会上曝出了 Compose 1.0 即将发布的消息，虽然 API 层面已趋于稳定，但真正要在项目中落地还少不了一套合理的应用架构。传统 Android 开发中的 MVP、MVVM 等架构在声明式UI这一新物种中是否还依旧可用呢？

本文以一个简单的业务场景为例，试图找出一种与 Compose 最契合的架构模式

### Sample :  Wanandroid Search

> App基本功能：用户输入关键字，在 wanandroid 网站中搜索出相关内容并展示

![]({{config.assets}}/architecture/demo2.png)


功能虽然简单，但是集合了数据请求、UI展示等常见业务场景，可用来做UI层与逻辑层的解耦实验。

### 前期准备：Model层

其实无论 MVX 中 X 如何变化， Model 都可以用同一套实现。我们先定义一个 `DataRepository` ，用于从 wanandroid 获取搜索结果。 后文Sample中的 Model 层都基于此 Repo 实现

```kotlin
@ViewModelScoped
class DataRepository @Inject constructor(){

    private val okhttpClient by lazy {
        OkHttpClient.Builder().build()
    }

    private val apiService by lazy {
        Retrofit.Builder()
            .baseUrl("https://www.wanandroid.com/")
            .client(okhttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build().create(ApiService::class.java)
    }


    suspend fun getArticlesList(key: String) =
        apiService.getArticlesList(key)
}
```

<br/>
# Compose为什么需要架构？
---
首先，先看看不借助任何架构的 Compose 代码是怎样的？

不使用架构的情况下，逻辑代码将与UI代码偶合在一起，在Compose中这种弊端显得尤为明显。常规 Android 开发默认引入了 MVC 思想，XML的布局方式使得UI层与逻辑层有了初步的解耦。但是 Compose 中，布局和逻辑同样都使用Kotlin实现，当布局中夹了杂逻辑，界限变得更加模糊。

此外，Compose UI中混入逻辑代码会带来更多的潜在隐患。由于 Composable 会频繁重组，逻辑代码中如果涉及I/O 就必须当做 `SideEffect{}` 处理、一些不能随重组频繁创建的对象也必须使用 `remember{}` 保存，当这些逻辑散落在UI中时，无形中增加了开发者的心智负担，很容易发生遗漏。

Sample 的业务场景特别简单，UI中出现少许 `remember{}` 、`LaunchedEffect{}` 似乎也没什么不妥，对于一些相对简单的业务场景出现下面这样的代码没有问题：

```kotlin
@Composable
fun NoArchitectureResultScreen(
    answer: String
) {

    val isLoading = remember { mutableStateOf(false) }

    val dataRepository = remember { DataRepository() }

    var result: List<ArticleBean> by remember { mutableStateOf(emptyList()) }
    
    LaunchedEffect(Unit) {
        isLoading.value = true
        result = withContext(Dispatchers.IO) { dataRepository.getArticlesList(answer).data.datas }
        isLoading.value = false
    }

    SearchResultScreen(result, isLoading.value , answer)

}
```
但是，当业务足够复杂时，你会发现这样的代码是难以忍受的。这正如在 React 前端开发中，虽然 Hooks 提供了处理逻辑的能力，但却依然无法取代 Redux。

<br/>

# Android中的常见架构模式
---

**MVP**、**MVVM**、**MVI** 是 Android中的而一些常见架构模式，它们的目的都是服务于UI层与逻辑层的解耦，只是在解耦方式上有所不同，如何选择取决于使用者的喜好以及项目的特点

> “没有最好的架构，只有最合适的架构。”

那么在 Compose 项目中何种架构最合适呢？

<br/>


## 1. MVP

MVP 主要特点是 `Presenter` 与 `View` 之间通过接口通信， Presenter 通过调用 View 的方法实现UI的更新。


![mvp](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/993bec0ee3ad477a93f3b03c3b35732f~tplv-k3u1fbpfcp-watermark.image)

这要求 Presenter 需要持有一个 View 层对象的引用，但是 Compose 显然无法获得这种引用，因为用来创建 UI 的 Composable 必须要求返回 Unit，如下：

```kotlin
@Composable
fun HomeScreen() {
    Column {
        Text("Hello World!")
    }
}
```
官方文档中对无返回值的要求也进行了明确约束：

> The function doesn’t return anything. Compose functions that emit UI do not need to return anything, because they describe the desired screen state instead of constructing UI widgets.
>https://developer.android.com/jetpack/compose/mental-model

Compose UI 既然存在于 Android 体系中，必定需要有一个与 Android 世界连接的起点，起点处可能是一个 `Activity` 或者 `Fragment`，用他们做UI层的引用句柄不可以吗?

理论上可以，但是当 Activity 接收 Presenter 通知后，仍然无法在内部获取局部引用，只能设法触发整体Recomposition，这完全丧失了 MVP 的优势，即通过获取局部引用进行精准刷新。

> 通过分析可以得到结论： “MVP 这种依赖接口通信的解耦方式无法在 Compose 项目中使用”

<br/>

## 2. MVVM（Without Jetpack）


相对于 MVP 的接口通信 ，MVVM 基于观察者模式进行通信，当 UI 观察到来自 ViewModel 的数据变化时自我更新。 UI层是否能返回引用句柄已不再重要，这与 Compose 的工作方式非常契合。



![mvvm](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8485b8fe71dc44a088832bc63e1abb50~tplv-k3u1fbpfcp-watermark.image)

自从 Android 用 ViewModel 命名了某 Jetpack 组件后，在很多人心里，Jetpack 似乎就与 MVVM 画上了等号。这确实客观推动了 MVVM 的普及，但是 Jetpack 的 ViewModel 并非只能用在 MVVM 中（比如如后文介绍的 MVI 也可以使用 ）； 反之，没有 Jetpack ，照样可以实现 MVVM。

先来看看不借助 Jetpack 的情况下，MVVM 如何实现？

### Activity 中创建 ViewModel

首先 View 层创建 ViewModel 用于订阅

```kotlin
class MvvmActivity : AppCompatActivity() {

    private val mvvmViewModel = MvvmViewModel(DataRepository())

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ComposePlaygroundTheme {
                MvvmApp(mvvmViewModel) //将vm传给Composable
            }
        }
    }
}
```

Compose 项目一般使用单 Activity 结构， Activity 作为全局入口非常适合创建全局 ViewModel。 子 Compoable 之间需要基于 ViewModel 通信，所以构建 Composable 时将 ViewModel 作为参数传入。

Sample 中我们在 Activity 中创建的 ViewModel 仅仅是为了传递给 `MvvmApp` 使用，这种情况下也可以通过传递 `Lazy<MvvmViewModel>`，将创建延迟到真正需要使用的时候以提高性能。 

### 定义 NavGraph
当涉及到 Compose 页面切换时，`navigation-compose` 是一个不错选择，Sample中也特意设计了`SearchBarScreen` 和  `SearchResultScreen` 的切换场景

```groovy
// build.gradle
implementation "androidx.navigation:navigation-compose:$latest_version"
```

```kotlin

@Composable
fun MvvmApp(
    mvvmViewModel: MvvmViewModel
) {
    val navController = rememberNavController()

    LaunchedEffect(Unit) {
        mvvmViewModel.navigateToResults
            .collect { 
                navController.navigate("result") //订阅VM路由事件通知，处理路由跳转
            } 
    }

    NavHost(navController, startDestination = "searchBar") {
        composable("searchBar") {
            MvvmSearchBarScreen(
                mvvmViewModel,
            )
        }
        composable("result") {
            MvvmSearchResultScreen(
                mvvmViewModel,
            )
        }
    }
}

```
- 在 root-level 的 MvvmApp 中定义 `NavGraph`， `composable("$dest_id"){}` 中构造路由节点的各个子 Screen，构造时传入 ViewModel 用于 Screen 之间的通信

- 每个 Composable 都有一个 `CoroutineScope` 与其 Lifecycle 绑定，`LaunchedEffect{}` 可以在这个 Scope 中启动协程处理副作用。 代码中使用了一个只执行一次的 Effect 订阅 ViewModel 的路由事件通知
- 当然我们可以将 navConroller 也传给 `MvvmSearchBarScreen` ，在其内部直接发起路由跳转。但在较复杂的项目中，跳转逻辑与页面定义应该尽量保持解耦，这更利于页面的复用和测试。
- 我们也可以在 Composeable 中直接  `mutableStateOf()` 创建 state 来处理路由跳转，但是既然选择使用 ViewModel 了，那就应该尽可能将所有 state 集中到 ViewModel 管理。 
> 注意: 上面例子中的处理路由跳转的  `navigateToResults` 是一个“事件”而非“状态”，关于这部分区别，在后文在详细阐述

### 定义子 Screen 
接下来看一下两个 Screen 的具体实现


```kotlin
@Composable
fun MvvmSearchBarScreen(
    mvvmViewModel: MvvmViewModel,
) {

    SearchBarScreen { 
        mvvmViewModel.searchKeyword(it)
    }

}

@Composable
fun MvvmSearchResultScreen(
    mvvmViewModel: MvvmViewModel
) {

    val result by mvvmViewModel.result.collectAsState()
    val isLoading by mvvmViewModel.isLoading.collectAsState()

    SearchResultScreen(result, isLoading, mvvmViewModel.key.value)

}
```
大量逻辑都抽象到 ViewModel 中，所以 Screen 非常简洁

- `SearchBarScreen` 接受用户输入，将搜索关键词发送给 ViewModel

- `MvvmSearchResultScreen` 作为结果页显示 ViewModel 发送的数据，包括 Loading 状态和搜索结果等。
- `collectAsState` 用来将 Flow 转化为 Compose 的 state，每当 Flow 接收到新数据时会触发 Composable 重组。 Compose 同时支持 LiveData、RxJava 等其他响应式库的`collectAsState`

UI层的更多内容可以查阅 `SearchBarScreen` 和 `SearchResultScreen` 的源码。经过逻辑抽离后，这两个 Composable 只剩余布局相关的代码，可以在任何一种 MVX 中实现复用。

### ViewModel 实现

最后看一下 ViewModel 的实现

```kotlin
class MvvmViewModel(
    private val searchService: DataRepository,
) {

    private val coroutineScope = MainScope()
    private val _isLoading: MutableStateFlow<Boolean> = MutableStateFlow(false)
    val isLoading = _isLoading.asStateFlow()
    private val _result: MutableStateFlow<List<ArticleBean>> = MutableStateFlow(emptyList())
    val result = _result.asStateFlow()
    private val _key = MutableStateFlow("")
    val key = _key.asStateFlow()
    
    //使用Channel定义事件
    private val _navigateToResults = Channel<Boolean>(Channel.BUFFERED)
    val navigateToResults = _navigateToResults.receiveAsFlow()

    fun searchKeyword(input: String) {
        coroutineScope.launch {
            _isLoading.value = true
            _navigateToResults.send(true)
            _key.value = input
            val result = withContext(Dispatchers.IO) { searchService.getArticlesList(input) }
            _result.emit(result.data.datas)
            _isLoading.value = false
        }
    }
}
```
- 接收到用户输入后，通过 `DataRepository` 发起搜索请求

- 搜索过程中依次更新 `loading`（loading显示状态）、`navigateToResult`(页面跳转事件)、 `key`（搜索关键词）、`result`（搜索结果）等内容，不断驱动UI刷新

所有状态集中在 ViewModel 管理，甚至页面跳转、Toast弹出等事件也由 ViewModel 负责通知，这对单元测试非常友好，在单测中无需再 mock 各种UI相关的上下文。

<br/>

## 3. Jetpack MVVM


> Jeptack 的意义在于降低 MVVM 在 Android平台的落地成本。

引入 Jetpack 后的代码变化不大，主要变动在于 ViewModel 的创建。

Jetpack 提供了多个组件，降低了 ViewModel 的使用成本：
- 通过 hilt 的 DI 降低 ViewModel 构造成本，无需手动传入 DataRepository 等依赖
- 任意 Composable 都可以从最近的 Scope 中获取 ViewModel，无需层层传参。

```kotlin
@HiltViewModel
class JetpackMvvmViewModel @Inject constructor(
    private val searchService: DataRepository // DataRepository 依靠DI注入
) : ViewModel() {
    ...
}
```

```kotlin
@Composable
fun JetpackMvvmApp() {
    val navController = rememberNavController()

    NavHost(navController, startDestination = "searchBar", route = "root") {
        composable("searchBar") {
            JetpackMvvmSearchBarScreen(
                viewModel(navController, "root") //viewModel 可以在需要时再获取, 无需实现创建好并通过参数传进来
            )
        }
        composable("result") {

            JetpackMvvmSearchResultScreen(
                viewModel(navController, "root") //可以获取跟同一个ViewModel实例
            )
        }
    }

}
```
```kotlin
@Composable
inline fun <reified VM : ViewModel> viewModel(
    navController: NavController,
    graphId: String = ""
): VM =
    //在 NavGraph 全局范围使用 Hilt 创建 ViewModel
    hiltNavGraphViewModel( 
        backStackEntry = navController.getBackStackEntry(graphId)
    )
```


Jetpack 甚至提供了 `hilt-navigation-compose` 库，可以在 Composable 中获取 NavGraph Scope 或  Destination Scope 的 ViewModel，并自动依赖 Hilt 构建。Destination Scope 的 ViewModel 会跟随 BackStack 的弹出自动 Clear ，避免泄露。

```groovy
// build.gradle
implementation androidx.hilt:hilt-navigation-compose:$latest_versioin
```

> “未来 Jetpack 各组件之间协同效应会变得越来越强。”
参考 https://developer.android.com/jetpack/compose/libraries#hilt

<br/>


## MVI
---

MVI 与 MVVM 很相似，其借鉴了前端框架的思想，更加强调**数据的单向流动**和**唯一数据源**，可以看做是 **MVVM + Redux** 的结合。

MVI 的 I 指 Intent，这里不是启动 Activity 那个 Intent，而是一种对用户操作的封装形式，为避免混淆，也可唤做 Action 等其他称呼。 用户操作以 Action 的形式送给 Model层 进行处理。代码中，我们可以用 Jetpack 的 ViewModel 负责 Intent 的接受和处理，因为 ViewModel 可以在 Composable 中方便获取。
 
 

![mvi](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/765d1d45817744728c78ceb1e2566b9a~tplv-k3u1fbpfcp-watermark.image)


在 `SearchBarScreen` 用户输入关键词后通过 `Action` 通知 ViewModel 进行搜索

```kotlin
@Composable
fun MviSearchBarScreen(
    mviViewModel: MviViewModel,
    onConfirm: () -> Unit
) {
    SearchBarScreen {
        mviViewModel.onAction(MviViewModel.UiAction.SearchInput(it))
    }
}
```

通过 `Action` 通信，有利于 View 与 ViewModel 之间的进一步解耦，同时所有调用以 Action 的形式汇总到一处，也有利于对行为的集中分析和监控


```kotlin
@Composable
fun MviSearchResultScreen(
    mviViewModel: MviViewModel
) {
    val viewState by mviViewModel.viewState.collectAsState()

    SearchResultScreen(
        viewState.result, viewState.isLoading, viewState.key
    )

}
```

MVVM 的 ViewModel 中分散定义了多个 State ，MVI 使用 `ViewState` 对 State 集中管理，只需要订阅一个 ViewState 便可获取页面的所有状态，相对 MVVM 减少了不少模板代码。


相对于 MVVM，ViewModel 也有一些变化


```kotlin
class MviViewModel(
    private val searchService: DataRepository,
) {

    private val coroutineScope = MainScope()

    private val _viewState: MutableStateFlow<ViewState> = MutableStateFlow(ViewState())
    val viewState = _viewState.asStateFlow()

    private val _navigateToResults = Channel<OneShotEvent>(Channel.BUFFERED)
    val navigateToResults = _navigateToResults.receiveAsFlow()

    fun onAction(uiAction: UiAction) {
        when (uiAction) {
            is UiAction.SearchInput -> {
                coroutineScope.launch {
                    _viewState.value = _viewState.value.copy(isLoading = true)
                    val result =
                        withContext(Dispatchers.IO) { searchService.getArticlesList(uiAction.input) }
                    _viewState.value =
                        _viewState.value.copy(result = result.data.datas, key = uiAction.input)
                    _navigateToResults.send(OneShotEvent.NavigateToResults)
                    _viewState.value = _viewState.value.copy(isLoading = false)
                }
            }
        }
    }

    data class ViewState(
        val isLoading: Boolean = false,
        val result: List<ArticleBean> = emptyList(),
        val key: String = ""
    )

    sealed class OneShotEvent {
        object NavigateToResults : OneShotEvent()
    }

    sealed class UiAction {
        class SearchInput(val input: String) : UiAction()
    }
}
```

- 页面所有的状态都定义在 `ViewState` 这个 data class 中，状态的修改只能在 `onAction` 中进行, 其余场所都是 immutable 的， 保证了数据流只能单向修改。 反观 MVVM ，`MutableStateFlow` 对外暴露时转成 immutable 才能保证这种安全性，需要增加不少模板代码且仍然容易遗漏。

- 事件则统一定义在 `OneShotEvent`中。 Event 不同于 State，同一类型的事件允许响应多次，因此定义事件使用 `Channel` 而不是 `StateFlow`。


> Compose 鼓励多使用 State 少使用 Event， Event 只适合用在弹 Toast 等少数场景中


通过浏览 ViewModel 的 ViewState 和 Aciton 定义就可以理清 ViewModel 的职责，可以直接拿来作为接口文档使用。


<br/>


# 页面路由
---

Sample 中之所以使用事件而非状态来处理路由跳转，一个主要原因是由于使用了 `Navigation`。Navigation 有自己的 `backstack` 管理，当点击 back 键时会自动帮助我们返回前一页面。倘若我们使用状态来描述当前页面，当点击 back时，没有机会更新状态，这将造成 ViewState 与 UI 的不一致。

> 关于路由方案的建议：简单项目使用**事件**控制页面跳转没有问题，但是对于复杂项目，推荐使用**状态**进行页面管理，有利于逻辑层时刻感知到当前的UI状态。

我们可以将 NavController 的 backstack 状态 与 ViewModel 的状态建立同步：

```kotlin

class MvvmViewModel(
    private val searchService: DataRepository,
) {

    ...
    //使用 StateFlow 描述页面
    private val _destination = MutableStateFlow(DestSearchBar)
    val destination = _destination.asStateFlow()

    fun searchKeyword(input: String) {
        coroutineScope.launch {
            ...
            _destination.value = DestSearchResult
            ...
        }
    }

    fun bindNavStack(navController: NavController) {
        //navigation 的状态时刻同步到 viewModel
        navController.addOnDestinationChangedListener { _, _, arguments ->
            run {
                _destination.value = requireNotNull(arguments?.getString(KEY_ROUTE))
            }
        }
    }
}

```
如上，当 navigation 状态变化时，会及时同步到 ViewModel ，这样就可以使用 StateFlow 而非 Channel 来描述页面状态了。

```kotlin
@Composable
fun MvvmApp(
    mvvmViewModel: MvvmViewModel
) {
    val navController = rememberNavController()

    LaunchedEffect(Unit) {
        with(mvvmViewModel) {
            bindNavStack(navController) //建立同步
            destination
                .collect {
                    navController.navigate(it)
                }
        }
    }
}
```
在入口处，为 NavController 和 ViewModel 建立同步绑定即可。

<br/>


# Clean Architecture
---
更大型的项目中，会引入 `Clean Architecture` ，通过 Use Case 将 ViewModel 内的逻辑进一步分解。 Compose 只是个 UI 框架，对于 ViewModel 以下的逻辑层的治理方式与传统的 Andorid 开发没有区别。所以 Clean Architecture 这样的复杂架构仍然可以在 Compose 项目中使用

<br/>


# 总结
---

比较了这么多种架构，那种与 Compose 最契合呢？ 

Compose 的声明式UI思想来自 React，所以同样来自 Redux 思想的 MVI 应该是 Compose 的最佳伴侣。当然 MVI 只是在 MVVM 的基础上做了一些改良，如果你已经有了一个 MVVM 的项目，只是想将 UI 部分改造成 Compose ，那么没必要为了改造成 MVI 而进行重构，MVVM 也可以很好地配合 Compose 使用的。 但是如果你想将一个 MVP 项目改造成 Compose 可能成本就有点大了。

关于 Jetpack，如果你的项目只用于 Android，那么 Jetpack 无疑是一个好工具。但是 Compose 未来的应用场景将会很广泛，如果你有预期未来会配合 KMP 开发跨平台应用，那么就需要学会不依赖 Jetpack 的开发方式，这也是本文为什么要介绍非 Jetpack 下的 MVVM 的一个初衷。

#### Sample 代码：

[点击这里](https://github.com/vitaviva/JetpackComposePlayground/tree/main/architecture)
