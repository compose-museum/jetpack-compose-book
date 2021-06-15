

`Jeptack Compose` 主要用来提高 `UI` 层的开发效率，但一个完整项目还少不了逻辑层、数据层的配合。幸好 `Jetpack` 中不少组件库已经与 `Compose` 进行了适配，开发者可以使用这些组件库完成 `UI` 以外的功能。

**Bloom** 是一个 `Compose` 最佳实践的 Demo App，主要用来展示各种植物列表以及详细信息。

![Bloom](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/580baeee44b847bd96f3c7c134aa2c6d~tplv-k3u1fbpfcp-watermark.image)



接下来以 `Bloom` 为例，看一下如何在 `Compose` 中使用 `Jetpack` 进行开发


<br/>


## 1. 整体架构：App Architecture


在架构上，Bloom 完全基于 Jetpack + Compose 搭建

![Architecture](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/000f0b2c6171422898e5cd0252b91733~tplv-k3u1fbpfcp-watermark.image)

从下往上依次用到的 `Jetpack` 组件如下：

- **Room**： 作为数据源提供数据持久化能力
- **Paging**： 分页加载能力。分页请求 Room 的数据并进行显示
- **Corouinte Flow**：响应式能力。`UI` 层通过 `Flow` 订阅 `Paging` 的数据变化
- **ViewModel**：数据管理能力。`ViewModel` 管理 `Flow` 类型的数据供 `UI` 层订阅
- **Compose**：UI 层完全使用 `Compose` 实现
- **Hilt**：依赖注入能力。`ViewModel` 等依赖 Hilt 来构建

`Jetpack MVVM` 指导我们将 `UI` 层、逻辑层、数据层进行了很好地解耦。上图除了 `UI` 层的 `Compose` 以外，与一个常规的 `Jetpack MVVM` 项目并无不同。

接下来通过代码，看看 `Compose` 如何配合各 `Jetpack` 完成 `HomeScreen` 和 `PlantDetailScreen` 的实现。

<br/>

## 2. 列表页：HomeScreen


HomeScreen 在布局上主要由三部分组成，最上面的搜索框，中间的轮播图，以及下边的的列表


![HomeScreen](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60a0166056194bd092ab4fb1147492fe~tplv-k3u1fbpfcp-watermark.image)

### ViewModel + Compose


我们希望 `Composable` 只负责 `UI`，状态管理放到 `ViewModel` 中。 `HomeScreen` 作为入口的 `Composable` 一般在 `Activity` 或者 `Fragment` 中调用。 

> **viewmodel-compose** 可以方便地从当前 ViewModelStore 中获取 ViewModel：<br/> `"androidx.lifecycle:lifecycle-viewmodel-compose:$version"`

```kotlin
@Composable
fun HomeScreen() {

    val homeViewModel = viewModel<HomeViewModel>() 
    
    //...

}
```

### Stateless Composable

持有 `ViewModel` 的 `Composalbe` 相当于一个 **“Statful Composalbe”** ，这样的 `ViewModel` 很难复用和单测，而且携带 `ViewModel` 的 `Composable` 也无法在 `IDE` 中预览。 因此，我们更欢迎 `Composable` 是一个 **"Stateless Composable"**。 

创建 `StatelessComposable` 的常见做法是将 `ViewModel` 上提，`ViewModel` 的创建委托给父级，仅作为参数传入，这可以使得 `Composalbe` 专注 `UI`


```kotlin
@Composable
fun HomeScreen(
    homeViewModel = viewModel<HomeViewModel>() 
) {
    
    //...

}
```
当然，也可以直接将 `State` 作为参数传入，可以进一步摆脱对 `ViewMode`l 具体类型的依赖。

接下来看一下 `HomeViewModel` 的实现，以及其内部 `State` 的定义

<br/>

## 3. HomeViewModel


`HomeViewModel` 是一个标准的 Jetpack ViewModel 子类, 可以在ConfigurationChanged时保持数据。

```kotlin
@HiltViewModel
class HomeViewModel @Inject constructor(
    private val plantsRepository: PlantsRepository
) : ViewModel() {


    private val _uiState = MutableStateFlow(HomeUiState(loading = true))
    val uiState: StateFlow<HomeUiState> = _uiState

    val pagedPlants: Flow<PagingData<Plant>> = plantsRepository.plants

    init {

        viewModelScope.launch {
            val collections = plantsRepository.getCollections()
            _uiState.value = HomeUiState(plantCollections = collections)
        }
    }
}

```
添加了 `@AndroidEntryPoint` 的 Activity 或者 Fragment ，可以使用 Hilt 为 Composalbe 创建 ViewModel。 Hilt 可以帮助 ViewModel 注入 `@Inject` 声明的依赖。例如本例中使用的 `PlantsRepository`

`pagedPlants` 通过 Paging 向 Composable 提供分页加载的列表数据，数据源来自 Room 。

分页列表以外的数据在 `HomeUiState` 中集中管理，包括轮播图中所需的植物集合以及页面加载状态等信息：

```kotlin
data class HomeUiState(
    val plantCollections: List<Collection<Plant>> = emptyList(),
    val loading: Boolean = false,
    val refreshError: Boolean = false,
    val carouselState: CollectionsCarouselState
        = CollectionsCarouselState(emptyList()) //轮播图状态，后文介绍
)
```

HomeScreen 中通过 `collectAsState()` 将 Flow 转换为 Composalbe 可订阅的 State：

```kotlin
@Composable
fun HomeScreen(
    homeViewModel = viewModel<HomeViewModel>() 
) {
    
    val uiState by homeViewModel.uiState.collectAsState()
    
    if (uiState.loading) {
        //...
    } else {
        //...
    }

}
```

## LiveData + Compose

此处的 Flow 也可以替换成 `LiveData`
> **livedata-compose** 将 LiveData 转换为 Composable 可订阅的 state :<br/> `"androidx.compose.runtime:runtime-livedata:$compose_version"`


```kotlin
@Composable
fun HomeScreen(
    homeViewModel = viewModel<HomeViewModel>() 
) {
    
    val uiState by homeViewModel.uiState.observeAsState() //uiState is a LiveData
    
    //...

}
```

此外，还有 **rxjava-compose** 可供使用，功能类似。

<br/>

# 4. 分页列表：PlantList


`PlantList` 分页加载并显示植物列表。

```kotlin
@Composable
fun PlantList(plants: Flow<PagingData<Plant>>) {
    val pagedPlantItems = plants.collectAsLazyPagingItems()

    LazyColumn {
        if (pagedPlantItems.loadState.refresh == LoadState.Loading) {
            item { LoadingIndicator() }
        }

        itemsIndexed(pagedPlantItems) { index, plant ->
            if (plant != null) {
                PlantItem(plant)
            } else {
                PlantPlaceholder()
            }

        }

        if (pagedPlantItems.loadState.append == LoadState.Loading) {
            item { LoadingIndicator() }
        }
    }
}

```

## Paging + Compose

> **paging-compose** 提供了 pagging 的分页数据 LazyPagingItems：<br/> `"androidx.paging:paging-compose:$version"`



注意此处的 `itemsIndexed` 来自paging-compoee，如果用错了，可能无法loadMore

```kotlin
public fun <T : Any> LazyListScope.itemsIndexed(
    lazyPagingItems: LazyPagingItems<T>,
    itemContent: @Composable LazyItemScope.(index: Int, value: T?) -> Unit
) {
    items(lazyPagingItems.itemCount) { index ->
        itemContent(index, lazyPagingItems.getAsState(index).value)
    }
}
```
`itemsIndexed` 接受 `LazyPagingItems` 参数， `LazyPagingItems#getAsState` 中从 `PagingDataDiffer` 中获取数据，当 index 处于列表尾部时，触发 loadMore 请求，实现分页加载。


<br/>

# 5. 轮播图：CollectionsCarousel


`CollectionsCarousel` 是显示轮播图的 Composable。 

在下面页面中都有对轮播图的使用，因此我们要求 `CollectionsCarousel` 具有可复用性。

![CollectionsCarousel](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4520abe0e9c34b569696c3e61b197295~tplv-k3u1fbpfcp-watermark.image)

## Reusable Composable

对于有复用性要求的 Composable，我们需要特别注意：**可复用组件不应该通过 ViewModel 管理 State**。 因为 ViewModel 在 Scope 内是共享的，但是在同一 Scope 内复用的 Composable 需要独享其 State 实例。

因此 CollectionsCarousel 不能使用 ViewModel 管理 State，必须通过参数传入状态以及事件回调。

```kotlin
@Composable
fun CollectionsCarousel(
    // State in,
    // Events out
) {
    // ...
}
```
参数传递的方式使得 CollectionsCarousel 将自己的状态委托给了父级 Composable。


##  CollectionsCarouselState

既然委托到了父级, 为了方便父级的使用，可以对 State 进行一定封装，被封装后的 State 与 Composable 配套使用。这在 Compose 中也是常见的做法，比如 `LazyColumn` 的 `LazyListState` ，或者 `Scallfold` 的 `ScaffoldState` 等


对于 CollectionsCarousel 我们有这样一个需求：点击某一 Item 时，轮播图的布局会展开

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/20f9f112f9e94df1b9a7e94ffbbde960~tplv-k3u1fbpfcp-watermark.image)

由于不能使用 ViewModel， 所以使用常规 Class 定义 `CollectionsCarouselState` 并实现 `onCollectionClick` 等相关逻辑 

```kotlin
data class PlantCollection(
    val name: String,
    @IdRes val asset: Int,
    val plants: List<Plant>
)

class CollectionsCarouselState(
    private val collections: List<PlantCollection>
) {
    private var selectedIndex: Int? by mutableStateOf(null)
        
    val isExpended: Boolean
        get() = selectedIndex != null

    privat var plants by mutableStateOf(emptyList<Plant>())
        
    val selectPlant by mutableStateOf(null)
        private set

    //...

    fun onCollectionClick(index: Int) {
        if (index >= collections.size || index < 0) return
        if (index == selectedIndex) {
            selectedIndex = null
        } else {
            plants = collections[index].plants
            selectedIndex = index
        }
    }
}
```
然后将其定义为 `CollectionsCarousel` 的参数

```kotlin
@Composable
fun CollectionsCarousel(
    carouselState: CollectionsCarouselState,
    onPlantClick: (Plant) -> Unit
) {
    // ...
}
```

为了进一步方便父级调用，可以提供
`rememberCollectionsCarouselState()`方法， 效果相当于
`remember { CollectionsCarouselState() }`


最后，父Composalbe 访问 CollectionsCarouselState 时，可以将它放置父级的 ViewModel 中保存，以支持 ConfigurationChanged 。例如本例中会放到  `HomeUiState` 中管理。

<br/>

# 6. 详情页：PlantDetailScreen & PlantViewModel

`PlantDetailScreen` 中除了复用 `CollectionsCarousel` 以外，大部分都是常规布局，比较简单。

重点说明一下 `PlantViewModel`， 通过 `id` 从 `PlantsRepository` 中获取详情信息。

```kotlin
class PlantViewModel @Inject constructor(
    plantsRepository: PlantsRepository,
    id: String
) : ViewModel() {

    val plantDetails: Flow<Plant> = plantsRepository.getPlantDetails(id)
    
}
```

此处的 id 该如何传入呢？

一个做法是借助 `ViewModelProvider.Factory` 构造 ViewModel 并传入 id

```kotlin
@Composable
fun PlantDetailScreen(id: String) {
    
    val plantViewModel : PlantViewModel = viewModel(id, remember {
        object : ViewModelProvider.Factory {
            override fun <T : ViewModel> create(modelClass: Class<T>): T {
                return PlantViewModel(PlantRepository, id)
            }
        }
    })
}

```

这种构造方式成本较高，而且按照前文介绍的，如果想保证 `PlantDetailScreen` 的可复用性和可测试性，最好将 ViewModel 的创建委托到父级。

除了委托到父级创建，我们还可以配合 `Navigation` 和 `Hilt` 更合理的创建 `PlantViewModel`，这将在后文中介绍。

<br/>

# 7. 页面跳转：Navigation


在 `HomeScreen` 列表中点击某 Plant 后跳转 `PlantDetailScreen`。

实现多个页面之间跳转，其中一个常见思路是为 Screen 包装一个 Framgent，然后借助 `Navigation` 实现对 Fragment 的跳转

```kotlin
@AndroidEntryPoint
class HomeFragment : Fragment() {
    override fun onCreateView(inflater: LayoutInflater, 
        container： ViewGroup?,  savedInstanceState: Bundle?
    ) = ComposeView(requireContext()).apply {
        setContent {
            HomeScreen(...)
        }
    }
}
```
Navigation 将回退栈中的节点抽象成一个 `Destination` , 所以这个 Destination 不一定非要用 Fragment 实现， 没有 Fragment 也可以实现 Composable 级别的页面跳转。

## Navigation + Compose

> **navigation-compose** 可以将 Composalbe 作为 Destination 在 Navigation 中使用 <br/> `"androidx.navigation:navigation-compose:$version"`

因此，我们摆脱 Framgent 实现页面跳转：


```kotlin
@AndroidEntryPoint
class BloomAcivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?, persistentState: PersistableBundle?) {
        setContent {

            val navController = rememberNavController()

            Scaffold(
                bottomBar = {/*...*/ }
            ) {
                NavHost(navController = navController, startDestination = "home") {
                    composable(route = "home") {
                        HomeScreen(...) { plant ->
                            navController.navigate("plant/${plant.id}")
                        }
                    }
                    composable(
                        route = "plant/{id}",
                        arguments = listOf(navArgument("id") { type = NavType.IntType })
                    ) {
                        PlantDetailScreen(...)
                    }
                }
            }

        }
    }
}
```

Navigaion 的使用依靠两个东西： `NavController` 和 `NavHost`：

- `NavController` 保存了当前 Navigation 的 BackStack 信息，因此是一个携带状态的对象，需要像 `CollectionsCarouselState` 那样，跨越 `NavHost` 的 Scope 之外创建。 

- `NavHost` 是 `NavGraph` 的容器， 将 `NavController` 作为参数传入。 NavGraph 中的Destinations（各Composable）将 NavController 作为 **SSOT（Single Source Of Truth）** 监听其变化。


## NavGraph

不同于传统的 XML 方式， navigation-compose 则使用 Kotlin DSL 定义 NavGraph:

```kotlin
comosable(route = “$id”) {
    //...
}
```
`route` 设置 Destination 的索引 id。 HomeScreen 使用 `“home”` 作为唯一id; 而  PlantDetailScreen 使用 `“plant/{id}”` 作为id。 其中 `{id}`中的 id 来自前一页面跳转时携带的 URI 中的参数 key。 本例中就是 `plant.id`:
```kotlin
HomeScreen(...) { plant ->
    navController.navigate("plant/${plant.id}")
}
```
```kotlin
composable(
    route = "plant/{id}",
    arguments = listOf(navArgument("id") { type = NavType.IntType })
) { //it: NavBackStackEntry 
    val id = it.arguments?.getString("id") ?: ""
    ...
}
```
`navArgument`可以将 URI 中的参数转化为 Destination 的 `arguments` , 并通过 `NavBackStackEntry` 获取

如上所述，我们可以利用 Navigation 进行 Screen 之间的跳转并携带一些基本参数。此外， Navigation 帮助我们管理回退栈，大大降低了开发成本。 


## Hilt + Compose
前文中介绍过，为了保证 Screen 的独立复用，我们可以将 ViewModel 创建委托到父级 Composable。 那么在 Navigation 的 NavHost 中我们该如何创建 ViewModel 呢？

> **hilt-navigation-compose** 允许我们在 Navigation 中使用 Hilt 构建 ViewModel：<br/> `"androidx.hilt:hilt-navigation-compose:$version"`




```kotlin
NavHost(navController = navController, 
        startDestination = "home",
        route = "root" // 此处为 NavGraph 设置 id。
        ) {
      composable(route = "home") {
            val homeViewModel: HomeViewModel = hiltNavGraphViewModel()
            val uiState by homeViewModel.uiState.collectAsState()
            val plantList = homeViewModel.pagedPlants
            
            HomeScreen(uiState = uiState) { plant ->
                   navController.navigate("plant/${plant.id}")
            }
        }
        
        composable(
            route = "plant/{id}",
            arguments = listOf(navArgument("id") { type = NavType.IntType })
        ) {
            val plantViewModel: PlantViewModel = hiltNavGraphViewModel()
            val plant: Plant by plantViewModel.plantDetails.collectAsState(Plant(0))
            
            PlantDetailScreen(plant = plant)
        }
}

```

Navigation 中，每个 Destination 都是一个 ViewModelStore, 因此 ViewModel 的 Scope 可以限制在 Destination 内部而不用放大到整个 Activity，更加合理。而且，当 Destination 从 BackStack 弹出时， 对应的 Screen 从视图树上卸载，同时 Scope 内的 ViewModel 被清空，避免泄露。


- `hiltNavGraphViewModel()` : 可以获取 Destination Scope 的 ViewModel，并使用 Hilt 构建。

- `hiltNavGraphViewModel("root")` : 指定 NavHost 的 routeId，则可以在 NavGraph Scope 内共享ViewModel

Screen 的 ViewModel 被代理到 NavHost 中进行， 不持有 ViewModel 的 Screen 具有良好的可测试性。

## 再看一看 PlantViewModel
```kotlin
@HiltViewModel
class PlantViewModel @Inject constructor(
    plantsRepository: PlantsRepository,
    savedStateHandle: SavedStateHandle
) : ViewModel() {

    val plantDetails: Flow<Plant> = plantsRepository.getPlantDetails(
        savedStateHandle.get<Int>("id")!!
    )
}

```

`SavedStateHandle` 实际上是一个键值对的 map。 当使用 Hilt 在构建 ViewModel 时，此 map 会被自动填充 `NavBackStackEntry` 中的 arguments，之后被参数注入 ViewModel。 此后在 ViewModel 内部可以通过 `get(xxx)` 获取键值。

至此， `PlantViewModel` 通过 Hilt 完成了创建，相比与之前的 `ViewModelProvider.Factory` 简单得多。

<br/>

# Recap


一句话总结各 `Jetpack` 库为 `Compose` 带来的能力：

- **viewmodel-compose** 可以从当前 ViewModelStore 中获取 ViewModel
- **livedate-compose** 将 LiveData 转换为 Composable 可订阅的 state 。
- **paging-compose** 提供了 pagging 的分页数据 LazyPagingItems
- **navigation-compose** 可以将 Composalbe 作为 Destination 在 Navigation 中使用
- **hilt-navigation-compose** 允许我们在 Navigation 中使用 Hilt 构建 ViewModel

此外，还有几点设计规范需要遵守：

- 将 `Composable` 的 `ViewModel` 上提，有利于保持其可复用性和可测试性
- 当 `Composable` 在同一 `Scope` 内复用时，避免使用 `ViewModel` 管理 `State`



参考 ： https://www.youtube.com/watch?v=0z_dwBGQQWQ
