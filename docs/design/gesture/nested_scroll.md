## nestedScroll 介绍

`nestedScroll` 修饰符主要用于处理嵌套滑动的场景，为父布局劫持消费子布局滑动手势提供了可能。

## nestedScroll 参数列表

使用 `nestedScroll` 参数列表中有一个必选参数 `connection` 和一个可选参数 `dispatcher`

connection: 嵌套滑动手势处理的核心逻辑，内部回调可以在子布局获得滑动事件前预先消费掉部分或全部手势偏移量，也可以获取子布局消费后剩下的手势偏移量。

dispatcher：调度器，内部包含用于父布局的 `NestedScrollConnection` , 可以调用 `dispatch*` 方法来通知父布局发生滑动

```kotlin
fun Modifier.nestedScroll(
    connection: NestedScrollConnection,
    dispatcher: NestedScrollDispatcher? = null
)
```

## NestedScrollConnection

`NestedScrollConnection` 提供了四个回调方法。

```kotlin
interface NestedScrollConnection {
    fun onPreScroll(available: Offset, source: NestedScrollSource): Offset = Offset.Zero

    fun onPostScroll(
        consumed: Offset,
        available: Offset,
        source: NestedScrollSource
    ): Offset = Offset.Zero

    suspend fun onPreFling(available: Velocity): Velocity = Velocity.Zero

    suspend fun onPostFling(consumed: Velocity, available: Velocity): Velocity {
        return Velocity.Zero
    }
}
```

### onPreScroll

方法描述：预先劫持滑动事件，消费后再交由子布局。

参数列表：

* available：当前可用的滑动事件偏移量
* source：滑动事件的类型

返回值：当前组件消费的滑动事件偏移量，如果不想消费可返回`Offset.Zero`

### onPostScroll

方法描述：获取子布局处理后的滑动事件

参数列表：

* consumed：之前消费的所有滑动事件偏移量
* available：当前剩下还可用的滑动事件偏移量
* source：滑动事件的类型

返回值：当前组件消费的滑动事件偏移量，如果不想消费可返回 `Offset.Zero` ，则剩下偏移量会继续交由当前布局的父布局进行处理

### onPreFling

方法描述：获取 `Fling` 开始时的速度。

参数列表：

* available：`Fling` 开始时的速度

返回值：当前组件消费的速度，如果不想消费可返回 `Velocity.Zero`

### onPostFling

方法描述：获取 ` Fling` 结束时的速度信息。

参数列表：

* consumed：之前消费的所有速度

* available：当前剩下还可用的速度

返回值：当前组件消费的速度，如果不想消费可返回`Velocity.Zero`，剩下速度会继续交由当前布局的父布局进行处理。



!!! note "注意"
	Fling含义：当我们手指在滑动列表时，如果是快速滑动并抬起，则列表会根据惯性继续飘一段距离后停下，这个行为就是 `Fling `，`onPreFling` 在你手指刚抬起时便会回调，而 `onPostFling` 会在飘一段距离停下后回调。



## 示例：下滑刷新

像下滑刷新这样涉及到嵌套滑动的手势行为就可以使用 `nestedScroll` 修饰符来完成。

### 示例介绍

<div align="center">
  <img src="{{config.assets}}/design/gesture/nested_scroll/smart_refresh.gif" width="30%" height="30%" />
</div>

在这个示例中存在着加载动画和列表数据。当我们手指向下滑时，此时如果列表顶部没有数据则会逐渐出现加载动画。与之相反，当我们手指向上滑时，此时如果加载动画还在，则加载动画逐渐向上消失，直到加载动画完全消失后，列表才会被向下滑动。

### 设计实现方案

为实现这个滑动刷新的需求，我们可以设计如下方案。我们首先需要将加载动画和列表数据放到一个父布局中统一管理。

1. 当我们手指向下滑时，我们希望滑动手势首先交给子布局中的列表进行处理，如果列表已经滑到顶部说明此时滑动手势事件没有被消费，此时再交由父布局进行消费。父布局可以消费列表消费剩下的滑动手势事件（为加载动画增加偏移）。

2. 当我们手指向上滑时，我们希望滑动手势首先被父布局消费（为加载动画减小偏移），如果加载动画本身仍未出现时，则不进行消费。然后将剩下的滑动手势交给子布局列表进行消费。

### NestedScrollConnection 实现

使用 `nestedScroll` 修饰符最重要的就是根据自己的业务场景来定制 `NestedScrollConnection` 的实现，接下来我们就逐个分析 `NestedScrollConnection` 重的借口该如何进行实现。

#### 实现 onPostScroll

向我们之前设计的实现方案一样，当我们手指向下滑时，我们希望滑动手势首先交给子布局中的列表进行处理，如果列表已经滑到顶部说明此时滑动手势事件没有被消费，此时再交由父布局进行消费。 `onPostScroll` 回调时机是符合我们的需求的。

我们首先需要判断该滑动事件是不是拖动事件，通过 `available.y > 0` 判断是否是下滑手势，如果都没问题时，通知加载动画增加偏移量。返回值 `Offset(x = 0f, y = available.y)` 意味着将剩下的所有偏移量全部消费调，不再向外层父布局继续传播了。

```kotlin
override fun onPostScroll(
    consumed: Offset,
    available: Offset,
    source: NestedScrollSource
): Offset {
    if (source == NestedScrollSource.Drag && available.y > 0) {
        state.updateOffsetDelta(available.y)
        return Offset(x = 0f, y = available.y)
    } else {
        return Offset.Zero
    }
}
```

#### 实现 onPreScroll

与上面相反，此时我们希望下滑收回加载动画，当我们手指向上滑时，我们希望滑动手势首先被父布局消费（为加载动画减小偏移），如果加载动画本身仍未出现时，则不进行消费。然后将剩下的滑动手势交给子布局列表进行消费。`onPreScroll` 回调时机是符合这个需求的。

我们首先需要判断该滑动事件是不是拖动事件，通过 `available.y < 0` 判断是否是上滑手势。此时可能加载动画本身未出现，所以需要额外进行判断。如果未出现则返回 `Offset.Zero` 不消费，如果出现了则返回 `Offset(x = 0f, y = available.y)` 进行消费。

```kotlin
override fun onPreScroll(available: Offset, source: NestedScrollSource): Offset {
    if (source == NestedScrollSource.Drag && available.y < 0) {
        state.updateOffsetDelta(available.y)
        return if (state.isSwipeInProgress) Offset(x = 0f, y = available.y) else Offset.Zero
    } else {
        return Offset.Zero
    }
}
```

#### 实现 onPreFling

接下来，我们需要一个松手时的吸附效果。如果拉过加载动画高度的一般则进行加载，否则就收缩回初始状态。前问我提到了 `onPreFling` 在松手时回调，即符合我们当前这个的场景。

!!! note "注意"
	即使你松手时速度很慢或静止，`onPreFling` 与 `onPostFling`都会回调，只是速度数值很小。

这里我们只需要吸引效果，并不希望消费速度，所以返回 `Velocity.Zero` 即可

```kotlin
override suspend fun onPreFling(available: Velocity): Velocity {
    if (state.indicatorOffset > height / 2) {
        state.animateToOffset(height)
        state.isRefreshing = true
    } else {
        state.animateToOffset(0.dp)
    }
    return Velocity.Zero
}
```

#### 实现 onPreFling

由于我们的下滑刷新手势处理不涉及 `onPreFling` 回调时机，所以不进行额外的实现。

### 示例源码

本示例的完整源码已经开源在我的 [Github Repo](https://github.com/RugerMcCarthy/SmartSwipeRefresh) 中，欢迎进行阅读并提交任何反馈。

## 示例 伸缩 ToolBar

### 效果图

![](https://user-images.githubusercontent.com/46998172/136773785-2dd2176f-378a-4011-a6f5-881dd0dd7e2f.mp4)

* 当列表向上移动时，会先带动 `ToolBar` 向上位移，等 `ToolBar` 向上移动到最大位移量时列表向上滑动
* 当列表向下移动时，会先带动 `ToolBar` 向下位移，等` ToolBar` 向下移动到最大位移量时列表向下滑动

### NestedScrollConnection 实现

#### 位移量定义

```kotlin
// 定义 ToolBar 的高度
val toolbarHeight = 200.dp
// ToolBar 最大向上位移量
// 56.dp 参考自 androidx.compose.material AppBar.kt 里面定义的 private val AppBarHeight = 56.dp
val maxUpPx = with(LocalDensity.current) { toolbarHeight.roundToPx().toFloat() - 56.dp.roundToPx().toFloat() }
// ToolBar 最小向上位移量
val minUpPx = 0f
// Title 偏移量参考值
val xOffsetReferenceValue = with(LocalDensity.current) { 50.dp.roundToPx().toFloat() }
// ToolBar 偏移量
val toolbarOffsetHeightPx = remember { mutableStateOf(0f) }
```

#### onPreScroll 实现

```kotlin
val nestedScrollConnection = remember {
    object : NestedScrollConnection {
        override fun onPreScroll(available: Offset, source: NestedScrollSource): Offset {
            val delta = available.y
            val newOffset = toolbarOffsetHeightPx.value + delta
            // 设置 ToolBar 的位移范围
            toolbarOffsetHeightPx.value = newOffset.coerceIn(-maxUpPx, -minUpPx)
            return Offset.Zero
        }
    }
}
```

#### 布局实现

```kotlin
Box(
    Modifier
        .fillMaxSize()
        .nestedScroll(nestedScrollConnection) // 作为父级附加到嵌套滚动系统
) {
    // 列表带有内置的嵌套滚动支持，它将通知我们它的滚动
    LazyColumn(
        contentPadding = PaddingValues(top = toolbarHeight)
    ) {
        items(100) { index ->
            Text("I'm item $index", modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp))
        }
    }

    // 模拟 ToolBar
    Box(
        modifier = Modifier
            .height(toolbarHeight)
            .offset { IntOffset(x = 0, y = toolbarOffsetHeightPx.value.roundToInt()) }
    ){
        // ToolBar 背景图
        Image(
            painter = painterResource(id = R.drawable.top_bar),
            contentDescription = null,modifier = Modifier.fillMaxWidth(),
            contentScale = ContentScale.FillBounds
        )

        // 图标和标题
        Box(modifier = Modifier.fillMaxHeight()
        ) {
            Icon(
                imageVector = Icons.Filled.ArrowBack,
                contentDescription = null,modifier = Modifier
                    .size(50.dp)
                    .padding(horizontal = 10.dp)
                    .offset {
                        IntOffset(
                            x = 0,
                            // 和 ToolBar 相反的位移量
                            // 保证 Icon 始终处于原位置
                            y = -toolbarOffsetHeightPx.value.roundToInt()
                        )
                    },
                tint = Color.White
            )

            Text(
                text="主页",
                modifier = Modifier
                    .align(Alignment.BottomStart).height(IntrinsicSize.Min)
                    .padding(16.dp)
                    .offset {
                        IntOffset(
                            // 按照 ToolBar 向上的位移量成比例的向右位移 Title
                            x = -((toolbarOffsetHeightPx.value / maxUpPx) * xOffsetReferenceValue).roundToInt(), y = 0
                        )
                    },
                textAlign = TextAlign.Start, fontSize = 20.sp, color = Color.White
            )
        }
    }
}
```
