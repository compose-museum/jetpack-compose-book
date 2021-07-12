## 1. Draggable能做什么

 <code>draggable</code> 修饰符允许开发者监听UI组件的拖动手势偏移量，通过偏移量从而可以定制UI动画效果。

值得注意的是， <code>draggable</code> 修饰符只能监听垂直方向偏移或水平方向偏移。

## 2. Draggable参数列表

使用 <code>draggable</code> 修饰符至少需要传入两个参数 <code>draggableState</code> 、 <code>orientation</code> 

draggableState：通过 draggableState 可以获取到拖动手势的偏移量，并允许开发者动态控制偏移量

orientation：监听的拖动手势方向，只能是水平方向(Orientation.Horizontal)或垂直方向(Orientation.Vertical)

```kotlin
fun Modifier.draggable(
    state: DraggableState,
    orientation: Orientation,
    enabled: Boolean = true,
    interactionSource: MutableInteractionSource? = null,
    startDragImmediately: Boolean = false,
    onDragStarted: suspend CoroutineScope.(startedPosition: Offset) -> Unit = {},
    onDragStopped: suspend CoroutineScope.(velocity: Float) -> Unit = {},
    reverseDirection: Boolean = false
)
```

## 3. Draggable使用示例

在本节中，我们将使用 <code>Draggable</code> 修饰符完成一个简单的滑块拖动动画。

首先我们定义了滑块偏移量以及滑块的边长。

通过 <code>rememberDraggableState</code> 方法获取 DraggableState 实例，通过回调lambda监听当前的偏移量并进行累加，并且限制了滑块的偏移区间。

```kotlin
var offsetX by remember {
		mutableStateOf(0f)
}
val boxSideLengthDp = 50.dp
val boxSildeLengthPx = with(LocalDensity.current) {
    boxSideLengthDp.toPx()
}
val draggableState = rememberDraggableState {
    offsetX = (offsetX + it).coerceIn(0f, 3 * boxSildeLengthPx)
}
```

接下来我们将为 <code>draggable</code> 修饰符提供给draggableState与orientation了。

**注意：由于Modifer链式执行，此时offset必需在draggable与background前面。**

**⚠️错误示例1(draggable在offset前面)**: 第二次拖动时UI控件拖动只能拖动初始位置才生效，不会跟随UI控件而移动监听，原因是每次拖动时draggable都监听的都是初始位置，不是偏移后位置。

**⚠️错误示例2(background在offset前面)**: UI控件绘制的黑块不会跟手，原因在于每次绘制时background都在初始位置绘制，不是偏移后位置。

```kotlin
Box(
    Modifier
        .width(boxSideLengthDp * 4)
        .height(boxSideLengthDp)
        .background(Color.LightGray)
) {
    Box(
        Modifier
            .size(boxSideLengthDp)
            .offset {
                IntOffset(offsetX.roundToInt(), 0)
            }
            .draggable(
                orientation = Orientation.Horizontal,
                state = draggableState
            )
            .background(Color.DarkGray)

    )
}
```

效果展示

<img src = "{{config.assets}}/design/gesture/draggable/demo1.gif" width = "50%" height = "50%">

