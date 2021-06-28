## 概述

 Jetpack Compose 已经为我们提供了各类手势处理的 Modifier，对于常见业务需求来说这已足够使用了，然后在一些对手势有定制需求场景中，就需要我们具备手势处理的自定义能力。通过使用官方所提供的基础 API 来完成以完成各类需求，手势操作的基础 API 类似传统 View 系统的 `onTouchEvent()`。 当然 Compose 中同样也支持类似于传统 ViewGroup 中的 `onInterceptTouchEvent()` 的手势处理。Compose 对于这些手势处理操作的使用方法，都会在本节中详细说明。通过对自定义触摸反馈的学习将允许你能够完成绝大多数场景下的手势处理需求。

## 使用 PointerInput Modifier

对于所有手势操作的处理都需要封装在这个 Modifier 中，我们知道 Modifier 是用来修饰 UI 组件对，所以将手势操作的处理封装在 Modifier 是符合开发者的设计直觉的。由于你所定制的手势处理逻辑被封装在一个 Modifier 中，这也说明你可以将手势操作施加在各类 UI 组件中，这也做到了手势处理逻辑与 UI 视图的解耦，从而提高了复用性。

通过翻阅 `Swipeable Modifier` 、`Draggable Modifier `以及 `Transformer Modifier`， 你都能看到 `PointerInput Modifier` 的身影。因为这类手势处理 Modifier 其实都是基于这个基础 Modifier 进行实现的。所以我们的自定义手势处理的流程也必然需要在这个 Modifier 中实现。

通过 `PointerInput Modifier` 实现我们可以看出，对于自定义的手势处理过程均发生在 `PointerInputScope` 中，通过 suspend 关键字我们也可以看出 Compose 的手势处理流程是发生在协程作用域中的。这其实是无可厚非的，在探索重组工作原理的过程中我们也经常能够看到协程的身影。伴随着越来越多的主流开发技术拥抱协程，这也就意味着协程成了 Android 开发者未来必须掌握的技能。推广协程同时其实也是在推广 Kotlin，即使官方一直强调不会放弃 Java，然而谁又会在 Java 中使用 Kotlin 协程呢？ 

```kotlin
fun Modifier.pointerInput(
    vararg keys: Any?,
    block: suspend PointerInputScope.() -> Unit
): Modifier = composed(
    ...
) {
    ...
    remember(density) { SuspendingPointerInputFilter(viewConfiguration, density) }.apply {
        LaunchedEffect(this, *keys) {
            block()
        }
    }
}
```



接下来我们就看看 `PointerInputScope` 作用域中，为我们可以使用哪些 API 来处理手势交互。本文将会根据手势能力分类进行解释说明。

### forEachGesture

在传统 View 系统中，当手指按下、移动到抬起的过程被称作一次手势事件序列的处理。 Compose 提供了 `forEachGesture` 来支持这个理念，以允许用户可以多次对 UI 组件进行手势交互处理。有些同学可能会问，为什么我不能在手势处理逻辑最外层套一层 `while(true) ` 呢，通过 `forEachGesture` 的实现我们可以看到 `forEachGesture` 其实内部也是由`while(true) ` 实现的，不过他可以保证协程只有存活时才能监听手势事件，同时也可以保证每次交互结束时所有手指都是离开屏幕的。

```kotlin
suspend fun PointerInputScope.forEachGesture(block: suspend PointerInputScope.() -> Unit) {
    val currentContext = currentCoroutineContext()
    while (currentContext.isActive) {
        try {
            block()
            // 挂起等待所有手指抬起
            awaitAllPointersUp()
        } catch (e: CancellationException) {
            ...
        }
    }
}
```

### 拖动类型基础 API

#### API 

| API名称                          | 作用                 |
| -------------------------------- | -------------------- |
| detectDragGestures               | 监听拖动手势         |
| detectDragGesturesAfterLongPress | 监听长按后的拖动手势 |
| detectHorizontalDragGestures     | 监听水平拖动手势     |
| detectVerticalDragGestures       | 监听垂直拖动手势     |

谈及拖动，许多人第一个反应就是 `Draggable Modifier`，因为 `Draggable Modifier` 为我们提供了监听 UI 组件拖动能力。然而 `Draggable Modifier` 在提供了监听 UI 组件拖动能力的同时也增加其他功能，我们通过 `Draggable Modifier` 参数列表即可看出。例如通过使用 `DraggableState` 允许开发者根据需求来动态使 UI 组件自动被拖动。

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

我们上面所罗列的这些拖动 API 只提供了监听 UI 组件拖动的能力，我们可以根据需求为其拓展功能，这也是这些API他们所存在的意义。我们从字面上就可以看出每个 API 所对应的含义，由于这些API的功能与参数相近，仅以 `detectDragGestures` 作为举例说明。

#### 举例说明

接下来我们将完成一个绿色方块的手势拖动。在 `Draggabel Modifier` 中我们还只能监听垂直或水平中某一个方向的手势拖动，而使用 `detectDragGestures` 所有手势信息都是可以拿到的。如果你还是只希望拿到某一个方向的手势拖动，使用 `detectHorizontalDragGestures`  或 `detectVerticalDragGestures` 即可，当然你也可以使用 `detectDragGestures` 并且忽略掉某个方向的手势信息。如果你希望在长按后才能拿到手势信息可以使用 `detectDragGesturesAfterLongPress`。

`detectDragGestures` 提供了四个参数。

onDragStart (可选)：拖动开始时回调

onDragEnd (可选)：拖动结束时回调

onDragCancel (可选)：拖动取消时回调

onDrag (必须)：拖动时回调

```kotlin
suspend fun PointerInputScope.detectDragGestures(
    onDragStart: (Offset) -> Unit = { },
    onDragEnd: () -> Unit = { },
    onDragCancel: () -> Unit = { },
    onDrag: (change: PointerInputChange, dragAmount: Offset) -> Unit
)
```

> 💡 **Tips **
>
> 有些同学可能困惑 `onDragCancel` 的触发时机。在一些场景中，当组件拖动时达到了父组件所设置的条件，导致手势事件被父组件先拿到后先消费掉了，从而会导致 `onDragCancel` 的回调。父组件如何预先拿到事件并消费后续会进行讲解。

示例如下所示

```kotlin
@Preview
@Composable
fun DragGestureDemo() {
    var boxSize = 100.dp
    var offset by remember { mutableStateOf(Offset.Zero) }
    Box(contentAlignment = Alignment.Center,
        modifier = Modifier.fillMaxSize()
    ) {
        Box(Modifier
            .size(boxSize)
            .offset {
                IntOffset(offset.x.roundToInt(), offset.y.roundToInt())
            }
            .background(Color.Green)
            .pointerInput(Unit) {
                detectDragGestures(
                    onDragStart = { offset ->
                        // 拖动开始
                    },
                    onDragEnd = {
                        // 拖动结束
                    },
                    onDragCancel = {
                        // 拖动取消
                    },
                    onDrag = { change: PointerInputChange, dragAmount: Offset ->
                        // 拖动时
                        offset += dragAmount
                    }
                )
            }
        )
    }
}
```

<div align = "center">
  <img src = "../../../assets/design/gesture/custom_gesture/drag.gif" width = "50%" height = "50%">
</div>

### 敲击类型基础 API

#### API 

| API名称           | 作用         |
| ----------------- | ------------ |
| detectTapGestures | 监听点击手势 |

与 `Clickable Modifier` 不同的是，`detectTapGestures` 可以监听更多的敲击事件。作为手机监听的基础 API，必然不会存在 `Clickable Modifier` 所拓展的涟漪效果。

#### 举例说明

接下来我们将为一个绿色方块添加点击手势处理逻辑。`detectTapGestures` 提供了四个可选参数，用来监听不同点击事件。

onDoubleTap (可选)：双击时回调

onLongPress (可选)：长按时回调

onPress (可选)：按下时回调

onTap (可选)：轻触时回调

```kotlin
suspend fun PointerInputScope.detectTapGestures(
    onDoubleTap: ((Offset) -> Unit)? = null,
    onLongPress: ((Offset) -> Unit)? = null,
    onPress: suspend PressGestureScope.(Offset) -> Unit = NoPressGesture,
    onTap: ((Offset) -> Unit)? = null
)
```

> 💡 **Tips ** 
>
> onPress 普通按下事件
>
> onDoubleTap 前必定会先回调 2 次 Press
>
> onLongPress 前必定会先回调 1 次 Press（时间长）
>
> onTap 前必定会先回调 1 次 Press（时间短）

示例如下所示

```kotlin
@Preview
@Composable
fun TapGestureDemo() {
    var boxSize = 100.dp
    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Box(Modifier
            .size(boxSize)
            .background(Color.Green)
            .pointerInput(Unit) {
                detectTapGestures(
                    onDoubleTap = { offset: Offset ->
                        // 双击
                    },
                    onLongPress = { offset: Offset ->
                        // 长按
                    },
                    onPress = {  offset: Offset ->
                        // 按下
                    },
                    onTap = {  offset: Offset ->
                        // 轻触
                    }
                )
            }
        )
    }
}
```

### 变换类型基础 API

#### API 

| API名称                 | 作用                     |
| ----------------------- | ------------------------ |
| detectTransformGestures | 监听拖动、缩放与旋转手势 |

与 `Transfomer Modifier` 不同的是，通过这个 API 可以监听单指的拖动手势，和拖动类型基础 API所提供的功能一样，除此之外还支持监听双指缩放与旋转手势。反观`Transfomer Modifier` 只能监听到双指拖动手势，不知设计成这样的行为不一致是否是 Google 有意而为之。

#### 举例说明

接下来我们仍然为这个绿色方块添加变化手势处理逻辑。`detectTransformGestures` 提供了两个参数。

panZoomLock(可选)： 当拖动或缩放手势发生时是否支持旋转

onGesture(必须)：当拖动、缩放或旋转手势发生时回调

```kotlin
suspend fun PointerInputScope.detectTransformGestures(
    panZoomLock: Boolean = false,
    onGesture: (centroid: Offset, pan: Offset, zoom: Float, rotation: Float) -> Unit
)
```

>💡 **Tips**
>
>关于偏移、缩放与旋转，我们建议的调用顺序是 rotate -> scale -> offset
>
>1. 若offset发生在rotate之前时，rotate会对offset造成影响。具体表现为当出现拖动手势时，组件会以当前角度为坐标轴进行偏移。
>
>2. 若offset发生在scale之前是，scale也会对offset造成影响。具体表现为UI组件在拖动时不跟手

```kotlin
@Preview
@Composable
fun TransformGestureDemo() {
    var boxSize = 100.dp
    var offset by remember { mutableStateOf(Offset.Zero) }
    var ratationAngle by remember { mutableStateOf(0f) }
    var scale by remember { mutableStateOf(1f) }
    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Box(Modifier
            .size(boxSize)
            .rotate(ratationAngle) // 需要注意offset与rotate的调用先后顺序
            .scale(scale)
            .offset {
                IntOffset(offset.x.roundToInt(), offset.y.roundToInt())
            }
            .background(Color.Green)
            .pointerInput(Unit) {
                detectTransformGestures(
                    panZoomLock = true, // 平移或放大时是否可以旋转
                    onGesture = { centroid: Offset, pan: Offset, zoom: Float, rotation: Float ->
                        offset += pan
                        scale *= zoom
                        ratationAngle += rotation
                    }
                )
            }
        )
    }
}
```

<div align = "center">
  <img src = "../../../assets/design/gesture/custom_gesture/transform.gif" width = "50%" height = "50%">
</div>