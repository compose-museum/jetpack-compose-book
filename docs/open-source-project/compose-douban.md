## 前言
`Compose` 正式发布也有一段时间了，感觉要上手还是得实战一波。     
所以借着空闲时间，参照豆瓣榜单页面的设计，开发了几个 `Compose` 版的豆瓣榜单页面       
`UI` 效果还是挺好看的，有兴趣的同学可以点个`Star`:[Compose 仿豆瓣榜单客户端](https://github.com/shenzhen2017/ComposeDouban)    

## 效果图
首先看下最终的效果图    
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d56ca7d86b34863b71201d1e9150c75~tplv-k3u1fbpfcp-watermark.awebp)
## 特性
在项目中主要用到了以下几个特性，以美化 `UI` 及体验    
1. 支持设置沉浸式状态栏及状态栏颜色     
2. 支持水平方向滚动，竖直方向滚动等多种 `UI` 效果     
3. 支持给 `Image` 设置渐变滤镜，以美化显示效果      
4. 支持标题与列表页联动      
5. 通过 `Paging` 支持了分页加载    

## 主要实现
具体源码可以直接查看，这里主要介绍一些主要功能的实现      

### 沉浸式状态栏设置
状态栏主要是通过 `accompanist-insets` 及 `accompanist-systemuicontroller` 库设置的     
[accompanist](https://github.com/google/accompanist)上提供了一系列常用的，如状态栏，权限，`FlowLayout`,`ViewPager` 等 `Compose` 库      
如果有时你发现基础库里没有相应的内容，可以去这里查找下     

设置状态栏主要分为以下几步       
1. 设置沉浸时状态栏    
2. 获取状态栏高度   
3. 设置状态栏颜色   

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // 1. 设置状态栏沉浸式
        WindowCompat.setDecorFitsSystemWindows(window, false)

        setContent {
            BD_ToolTheme {
            	// 加入ProvideWindowInsets
                ProvideWindowInsets {
                    // 2. 设置状态栏颜色
                    rememberSystemUiController().setStatusBarColor(
                        Color.Transparent, darkIcons = MaterialTheme.colors.isLight)
                    Column {
                    	// 3. 获取状态栏高度并设置占位
                        Spacer(modifier = Modifier
                            .statusBarsHeight()
                            .fillMaxWidth())
                        Text(text = "首页\r\n首页1\r\n首页2\r\n首页3")
                    }
                }
            }
        }
    }
```
通过以上方法，就可以比较简单的实现沉浸状态栏的设置    

### `Image` 设置渐变滤镜
豆瓣榜单页面都给 `Image` 设置了渐变滤镜，以美化`UI`效果         
其实实现起来也比较简单，给 `Image` 前添加一层渐变的蒙层即可       
```kotlin
@Composable
fun TopRankItem(item: HomeTopRank) {
    Box(
        modifier = Modifier
            .size(180.dp, 220.dp)
            .padding(8.dp)
            .clip(RoundedCornerShape(10.dp))
    ) {
    	// 1. 图片
        Image(
            painter = rememberCoilPainter(request = item.imgUrl),
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize()
        )
        Column(
            modifier = Modifier
                .fillMaxSize()
                // 渐变滤镜
                .background(
                    brush = Brush.linearGradient(
                        colors = listOf(Color(item.startColor), Color(item.endColor)),
                        start = Offset(0f, Float.POSITIVE_INFINITY),
                        end = Offset(Float.POSITIVE_INFINITY, 0f)
                    )
                )
                .padding(8.dp)

        ) {
            //内容
        }
    }
}
```
如上所示，使用 `Box` 布局，给前景设置一个从左下到右上渐变的背景即可       

### 标题与列表联动
具体效果可见上面的动图，即在列表滚动时标题会有一个渐现渐隐效果       
这个效果其实我们在 `Android View` 体系中也很常见，主要思路也很简单:       
1. 监听列表滚动，获取列表滚动 `offset`      
2. 根据列表滚动 `offset` 设置 `Header` 效果,如背景或者高度变化等   

```kotlin
@Composable
fun RankScreen(viewModel: RankViewModel = RankViewModel()) {
    val scrollState = rememberLazyListState()
    Box {
    	// 1. 监听列表
        LazyColumn(state = scrollState) {
            //列表内容
        }
        RankHeader(scrollState)
    }
}

@Composable
fun RankHeader(scrollState: LazyListState) {
    val target = LocalDensity.current.run {
        200.dp.toPx()
    }
    // 2. 根据列表偏移量计算比例
    val scrollPercent: Float = if (scrollState.firstVisibleItemIndex > 0) {
        1f
    } else {
        scrollState.firstVisibleItemScrollOffset / target
    }
    val activity = LocalContext.current as Activity
    val backgroundColor = Color(0xFF7F6351)
    Column() {
        Spacer(
            modifier = Modifier
                .fillMaxWidth()
                .statusBarsHeight()
                // 3. 根据比例设置Header的alpha，以实现渐变效果
                .alpha(scrollPercent)
                .background(backgroundColor)
        )
        //....
    }
}
```
如上所示，主要有三步：  
1. 监听列表     
2. 根据列表偏移量计算比例    
3. 根据比例设置 `Header` 的 `alpha`，以实现渐变效果

### 利用 `Paging` 实现分页
目前 `Pagin3` 已经支持了 `Compose`，我们可以利用 `Paging` 轻松实现分页效果      
主要分为以下几步：  
1. 在 `ViewModel` 中设置数据源    
2. 在页面中监听 `Paging` 数据     
3. 根据加载状态设置加载更多 `footr` 状态         

```kotlin
//1. 设置数据源
class RankViewModel : ViewModel() {
    val rankItems: Flow<PagingData<RankDetail>> =
        Pager(PagingConfig(pageSize = 10, prefetchDistance = 1)) {
            MovieSource()
        }.flow
}

@Composable
fun RankScreen(viewModel: RankViewModel = RankViewModel()) {
    val lazyMovieItems = viewModel.rankItems.collectAsLazyPagingItems()
    Box {
        LazyColumn(state = scrollState) {
            // 2. 在页面中监听paging
            items(lazyMovieItems) {
                it?.let {
                    RankListItem(it)
                }
            }
            // 3. 根据paging状态设置加载更多footer状态等
            lazyMovieItems.apply {
                when (loadState.append) {
                    is LoadState.Loading -> {
                        item { LoadingItem() }
                    }
                }
            }
        }
    }
}
```
通过以上步骤，就可以比较简单方便地实现分页了   
## 总结
### 项目地址
[ComposeDouban](https://github.com/shenzhen2017/ComposeDouban)         
开源不易，如果项目对你有所帮助，欢迎点赞,`Star`,收藏~        

### 参考资料
[Android Jetpack Compose 沉浸式/透明状态栏](https://blog.csdn.net/sinat_38184748/article/details/119345811)       
[Collapsing Toolbar made easy with Compose](https://codingtroops.com/android/collapsing-toolbar-made-easy-with-compose/)        
[Infinite Lists With Paging 3 in Jetpack Compose](https://proandroiddev.com/infinite-lists-with-paging-3-in-jetpack-compose-b095533aefe6)
