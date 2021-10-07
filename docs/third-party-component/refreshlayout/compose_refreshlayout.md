## 前言
下拉刷新是我们开发中的常见的需求，官方提供了`SwipeRefreshLayout`来实现下拉刷新，但我们常常需要定制`Header`或者`Header`与内容一起向下滚动，因此`SwipeRefreshLayout`往往不能满足我们的需求        
在使用`XML`开发时,`Github`上有不少开源库如[SmartRefreshLayout](https://github.com/scwang90/SmartRefreshLayout)实现了下拉刷新功能，可以方便地定制化`Header`与滚动方式        
本文主要介绍如何开发一个简单易用的`Compose`版`SmartRefreshLayout`,快速实现下拉刷新功能，如果对您有所帮助可以点个`Star`:[Compose版SmartRefreshLayout](https://github.com/shenzhen2017/compose-refreshlayout)

## 效果图
我们首先看下最终的效果图

|基本使用|自定义Header|
|:---:|:---:|
|![](https://raw.githubusercontents.com/shenzhen2017/resource/main/2021/october/p1.gif)|![](https://raw.githubusercontents.com/shenzhen2017/resource/main/2021/october/p2.gif)|

|Lottie Header|FixedBehind(固定在背后)|
|:---:|:---:|
|![](https://raw.githubusercontents.com/shenzhen2017/resource/main/2021/october/p3.gif)|![](https://raw.githubusercontents.com/shenzhen2017/resource/main/2021/october/p4.gif)|

|FixedFront(固定在前面)|FixedContent(内容固定)|
|:---:|:---:|
|![](https://raw.githubusercontents.com/shenzhen2017/resource/main/2021/october/p5.gif)|![](https://raw.githubusercontents.com/shenzhen2017/resource/main/2021/october/p6.gif)|

## 特性
1. 接入方便，使用简单，快速实现下拉刷新功能         
2. 支持自定义`Header`,`Header`可观察下拉状态并更新`UI`     
3. 自定义`Header`支持`Lottie`,并支持观察下拉状态开始与暂停动画     
4. 支持自定义`Translate`,`FixedBehind`,`FixedFront`,`FixedContent`等滚动方式       
5. 支持与`Paging`结合实现上滑加载更多功能

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
        implementation 'io.github.shenzhen2017:compose-refreshlayout:1.0.0'
}
```

### 简单使用
`SwipeRefreshLayout`函数主要包括以下参数:   
1. `isRefreshing`: 是否正在刷新    
2. `onRefresh`: 触发刷新回调     
3. `modifier`: 样式修饰符
4. `swipeStyle`: 下拉刷新方式      
5. `swipeEnabled`: 是否允许下拉刷新   
6. `refreshTriggerRate`: 刷新生效高度与`indicator`高度的比例       
7. `maxDragRate`: 最大刷新距离与`indicator`高度的比例
8. `indicator`: 自定义的`indicator`,有默认值

在默认情况下，我们只需要传入`isRefreshing`(是否正在刷新)与`onRefresh`触发刷新回调两个参数即可       
```kotlin
@Composable
fun BasicSample() {
    var refreshing by remember { mutableStateOf(false) }
    LaunchedEffect(refreshing) {
        if (refreshing) {
            delay(2000)
            refreshing = false
        }
    }
    SwipeRefreshLayout(isRefreshing = refreshing, onRefresh = { refreshing = true }) {
        //...
    }
}
```
如上所示:在触发刷新回调时将`refreshing`设置为`true`,并在刷新完成后设置为`false`即可实现简单的下拉刷新功能     

### 自定义`Header`
`SwipeRefreshLayout`支持传入自定义的`Header`，如下所示：   
```kotlin
@Composable
fun CustomHeaderSample() {
    var refreshing by remember { mutableStateOf(false) }
    LaunchedEffect(refreshing) {
        if (refreshing) {
            delay(2000)
            refreshing = false
        }
    }

    SwipeRefreshLayout(
        isRefreshing = refreshing,
        onRefresh = { refreshing = true },
        indicator = {
            BallRefreshHeader(state = it)
        }) {
        	//...
    }
}
```
如上所示：`BallRefreshHeader`即为自定义的`Header`,`Header`中会传入`SwipeRefreshState`，我们通过`SwipeRefreshState`可获得以下参数    
1. `isRefreshing`: 是否正在刷新    
2. `isSwipeInProgress`: 是否正在滚动     
3. `maxDrag`: 最大下拉距离           
4. `refreshTrigger`: 刷新触发距离    
5. `headerState`: 刷新状态，包括`PullDownToRefresh`,`Refreshing`,`ReleaseToRefresh`三个状态     
6. `indicatorOffset`: `Header`偏移量

这些参数都是`MutableState`我们可以观察这些参数的变化以实现`Header UI`的更新  

### 自定义`Lottile Header`
`Compose`目前已支持`Lottie`，我们接入`Lottie`依赖后，就可以很方便地实现一个`Lottie Header`，并且在正在刷新时播放动画，其它时间暂停动画，示例如下：    

```kotlin
@Composable
fun LottieHeaderOne(state: SwipeRefreshState) {
    var isPlaying by remember {
        mutableStateOf(false)
    }
    val speed by remember {
        mutableStateOf(1f)
    }
    isPlaying = state.isRefreshing
    val lottieComposition by rememberLottieComposition(
        spec = LottieCompositionSpec.RawRes(R.raw.refresh_one),
    )
    val lottieAnimationState by animateLottieCompositionAsState(
        composition = lottieComposition, // 动画资源句柄
        iterations = LottieConstants.IterateForever, // 迭代次数
        isPlaying = isPlaying, // 动画播放状态
        speed = speed, // 动画速度状态
        restartOnPlay = false // 暂停后重新播放是否从头开始
    )
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .wrapContentHeight(), contentAlignment = Alignment.Center
    ) {
        LottieAnimation(
            lottieComposition,
            lottieAnimationState,
            modifier = Modifier.size(150.dp)
        )

    }
}
```

### 自定义下滑方式
`SwipeRefreshLayout`支持以下4种下滑方式
```kotlin
enum class SwipeRefreshStyle {
    Translate,  //平移，即内容与Header一起向下滑动，Translate为默认样式
    FixedBehind, //固定在背后，即内容向下滑动，Header不动
    FixedFront, //固定在前面, 即Header固定在前，Header与Content都不滑动
    FixedContent //内容固定,Header向下滑动,即官方样式
}
```
如上所示，其中默认方式为`Translate`,即内容与`Header`一起向下滑动      
各位可根据需求选择相应的下滑方式，比如要实现类似官方的下滑效果，即可使用`FixedContent`    

### 上拉加载更多
在`Compose`中，上拉加载更多直接使用`Paging3`看起来已经足够用了，因此本库没有实现上拉加载更多相关功能       
因此如果想要实现上拉加载更多，可自行结合`Paging3`使用     

## 主要原理
下拉刷新功能，其实主要是嵌套滚动的问题,我们将`Header`与`Content`放到一个父布局中统一管理，然后需要做以下事           
1. 当我们的手指向下滚动时，首先交由`Content`处理，如果`Content`滚动到顶部了，再交由父布局处理，然后父布局根据手势进行一定的偏移,增加`offset`      
2. 当我们松手时，判断偏移的距离，如果大于刷新触发距离则触发刷新，否则回弹到顶部(`offset`置为0)
3. 当我们手指向上滚动时，首先交由父布局处理，如果父布局的`offset`>0则由父布局处理，减少`offset`，否则则由`Content`消费手势    

### `NestedScrollConnection`介绍
为了实现上面说的需求，我们需要对滚动进行拦截，`Compose`提供了`NestedScrollConnection`来实现嵌套滚动      
```kotlin
interface NestedScrollConnection {
    fun onPreScroll(available: Offset, source: NestedScrollSource): Offset = Offset.Zero

    fun onPostScroll(consumed: Offset, available: Offset, source: NestedScrollSource): Offset = Offset.Zero

    suspend fun onPreFling(available: Velocity): Velocity = Velocity.Zero

    suspend fun onPostFling(consumed: Velocity, available: Velocity) = return Velocity.Zero
}
```
如上所示，`NestedScrollConnection`主要提供了4个接口   
1. `onPreScroll`: 先拦截滑动事件，消费后再交给子布局     
2. `onPostScroll`: 子布局处理完滑动事件后再交给父布局，可获取当前还剩下多少可用的滑动事件偏移量     
3. `onPreFling`: `Fling`开始前回调    
4. `onPostFling`: `Fling`完成后回调    

> `Fling`含义：当我们手指在滑动列表时，如果是快速滑动并抬起，则列表会根据惯性继续飘一段距离后停下，这个行为就是 `Fling` ，`onPreFling` 在你手指刚抬起时便会回调，而 `onPostFling` 会在飘一段距离停下后回调。

### 具体实现
上面我们已经介绍了总体思路与`NestedScrollConnection API`，然后我们应该需要重写以下方法     
1. `onPostScroll`: 当`Content`滑动到顶部时，如果继续往上滑，我们就应该增加父布局的`offset`,因此在`onPostScroll`中判断`available.y > 0`，然后进行相应的偏移,对我们来说是个合适的时机      
2. `onPreScroll`: 当我们上滑时，如果`offset>0`,则说明父布局有偏移，因此我们应先减小父布局的`offset`直到0,然后将剩余的偏移量传递给`Content`，因此下滑时应该使用`onPreScroll`拦截判断    
3. `onPreFling`: 当我们松开手时，应判断当前的偏移量是否大于刷新触发距离，如果大于则触发刷新，否则父布局的`offset`置为0,这个判断在`onPreFling`时做比较合适    

具体实现如下：   
```kotlin
internal class SwipeRefreshNestedScrollConnection() : NestedScrollConnection {
    override fun onPreScroll(
        available: Offset,source: NestedScrollSource
    ): Offset = when {
        // 如果用户正在上滑，需要在这里拦截处理
        source == NestedScrollSource.Drag && available.y < 0 -> onScroll(available)
        else -> Offset.Zero
    }

    override fun onPostScroll(
        consumed: Offset,available: Offset,source: NestedScrollSource
    ): Offset = when {
        // 如果用户正在下拉，在这里处理剩余的偏移量
        source == NestedScrollSource.Drag && available.y > 0 -> onScroll(available)
        else -> Offset.Zero
    }

    override suspend fun onPreFling(available: Velocity): Velocity {
        //如果偏移量大于刷新触发距离，则触发刷新
        if (!state.isRefreshing && state.indicatorOffset >= refreshTrigger) {
            onRefresh()
        }
        //不消费速度，直接返回0
        return Velocity.Zero
    }
}
```

## 总结
本文主要介绍如何使用及实现一个`Compose`版的`SmartRefreshLayout`，它具有以下特性:     
1. 接入方便，使用简单，快速实现下拉刷新功能         
2. 支持自定义`Header`,`Header`可观察下拉状态并更新`UI`     
3. 自定义`Header`支持`Lottie`,并支持观察下拉状态开始与暂停动画     
4. 支持自定义`Translate`,`FixedBehind`,`FixedFront`,`FixedContent`等滚动方式       
5. 支持与`Paging`结合实现上滑加载更多功能   

### 项目地址
[Compose版SmartRefreshLayout](https://github.com/shenzhen2017/compose-refreshlayout)      
开源不易，如果项目对你有所帮助，欢迎点赞,`Star`,收藏~   

