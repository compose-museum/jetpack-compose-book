## 1. Swipeable能做什么

与 <code>draggable</code> 修饰符不同的是， <code>swipeable</code> 修饰符允许开发者通过锚点设置从而实现组件呈现吸附效果的动画，常用于开关等动画，也可用于下拉刷新等特殊效果的实现。

但是值得注意的是， <code>swipeable</code> 修饰符不会为被修饰的组件提供任何默认动画，只能为组件提供手势偏移量等信息。开发者可根据自身需求根据偏移量结合其他修饰符定制动画展示。

## 2. Swipeable参数列表

使用 <code>swipeable</code> 修饰符至少需要传入三个参数 <code>swipeableState</code> 、 <code>anchors</code> 、 <code>orientation</code> 

swipeableState：通过 swipeableState 的设置可以获取到当前手势的偏移量信息

anchors：锚点，可以通过锚点设置在不同状态时所应该对应的偏移量信息

orientation：手势方向，被修饰组件的手势方向只能是水平或垂直

thresholds (常用非必需)：常用作定制不同锚点间吸附效果的临界阈值，常用有 <code>FixedThreshold(Dp)</code> 和<code>FractionalThreshold(Float)</code>等

```kotlin
fun <T> Modifier.swipeable(
    state: SwipeableState<T>,
    anchors: Map<Float, T>,
    orientation: Orientation,
    enabled: Boolean = true,
    reverseDirection: Boolean = false,
    interactionSource: MutableInteractionSource? = null,
    thresholds: (from: T, to: T) -> ThresholdConfig = { _, _ -> FixedThreshold(56.dp) },
    resistance: ResistanceConfig? = resistanceConfig(anchors.keys),
    velocityThreshold: Dp = VelocityThreshold
)
```

## 3. Swipeable使用示例

在本节中，我们将使用 <code>swipeable</code> 修饰符完成一个简单的开关动画。

首先我们定义了两个枚举项用于描述开关的状态，并设置了开关的尺寸。

我们通过 <code>rememberSwipeableState</code> 方法获取 SwipeableState 实例，并将初始状态设置为 Status.CLOSE。

```kotlin
enum class Status{
    CLOSE, OPEN
}
var blockSize = 48.dp
var blockSizePx = with(LocalDensity.current) { blockSize.toPx() }
var swipeableState = rememberSwipeableState(initialValue = Status.CLOSE)
```

在我们的示例中每个状态都相对应一个锚点，接下来我们需要声明每个锚点所对应数值，锚点以键值对进行表示。

于此同时，Compose 也得知了开发者所希望的初始状态数值。

```kotlin
var anchors = mapOf(
	0f to Status.CLOSE,
 	blockSizePx to Status.OPEN
)
```

我们接下来说明锚点间吸附动画的阈值。我们希望从关闭状态到开启状态，滑块仅需移动超过 30% 则会自动吸附到开启状态，从开启状态到关闭状态，滑块需移动超过 50% 才会自动吸附到关闭状态。

```kotlin
Modifier.swipeable(
    state = swipeableState,
    anchors = mapOf(
        0f to Status.CLOSE,
        blockSizePx to Status.OPEN
    ),
    thresholds = { from, to ->
        if (from == Status.CLOSE) {
            FractionalThreshold(0.3f)
        } else {
            FractionalThreshold(0.5f)
        }
    },
    orientation = Orientation.Horizontal
)
```

接下来，我们就可以通过 SwipeableState 获取到偏移量信息了，我们希望滑块根据偏移量进行移动，在我们的示例中使用 <code>offset</code> 描述符即达成需求。

!!! note "注意"
	由于 Modifer 是链式执行，此时 offset 必需在 draggable 与 background 前面。

```kotlin
@ExperimentalMaterialApi
@Preview
@Composable
fun SwipeableDemo() {
    var blockSize = 48.dp
    var blockSizePx = with(LocalDensity.current) { blockSize.toPx() }
    var swipeableState = rememberSwipeableState(initialValue = Status.CLOSE)
    var anchors = mapOf(
        0f to Status.CLOSE,
        blockSizePx to Status.OPEN
    )
    Box(
        modifier = Modifier
            .size(height = blockSize, width = blockSize * 2)
            .background(Color.LightGray)
    ) {
        Box(
            modifier = Modifier
                .offset {
                    IntOffset(swipeableState.offset.value.toInt(), 0)
                }
                .swipeable(
                    state = swipeableState,
                    anchors = mapOf(
                        0f to Status.CLOSE,
                        blockSizePx to Status.OPEN
                    ),
                    thresholds = { from, to ->
                        if (from == Status.CLOSE) {
                            FractionalThreshold(0.3f)
                        } else {
                            FractionalThreshold(0.5f)
                        }
                    },
                    orientation = Orientation.Horizontal
                )
                .size(blockSize)
                .background(Color.DarkGray)
        )
    }
}
```

 效果展示

<img src = "{{config.assets}}/design/gesture/swipeable/demo1.gif" width = "50%" height = "50%">

