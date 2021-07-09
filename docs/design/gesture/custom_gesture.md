## 概述

Jetpack Compose 为我们提供了许多手势处理 Modifier，对于常见业务需求来说已足够我们使用了，然而如果说我们对手势有定制需求，就需要具备自定义手势处理的能力了。通过使用官方所提供的基础 API 来完成各类手势交互需求，触摸反馈基础 API 类似传统 View 系统的 `onTouchEvent()`。 当然 Compose 中也支持类似传统 ViewGroup 通过 `onInterceptTouchEvent()`定制手势事件分发流程。通过对自定义手势处理的学习将帮助大家掌握处理绝大多数场景下手势需求的能力。

## 使用 PointerInput Modifier

对于所有手势操作的处理都需要封装在这个 Modifier 中，我们知道 Modifier 是用来修饰 UI 组件的，所以将手势操作的处理封装在 Modifier 符合开发者设计直觉，这同时也做到了手势处理逻辑与 UI 视图的解耦，从而提高复用性。

通过翻阅 `Swipeable Modifier` 、`Draggable Modifier ` 以及 `Transformer Modifier`，我们都能看到 `PointerInput Modifier` 的身影。因为这类上层的手势处理 Modifier 其实都是基于这个基础 Modifier 实现的。所以既然要自定义手势处理流程，自定义逻辑也必然要在这个 Modifier 中进行实现。

通过 `PointerInput Modifier` 实现我们可以看出，我们所定义的自定义手势处理流程均发生在 `PointerInputScope` 中，suspend 关键字也告知我们自定义手势处理流程是发生在协程中。这其实是无可厚非的，在探索重组工作原理的过程中我们也经常能够看到协程的身影。伴随着越来越多的主流开发技术拥抱协程，这也就意味着协程成了 Android 开发者未来必须掌握的技能。推广协程同时其实也是在推广 Kotlin，即使官方一直强调不会放弃 Java，然而谁又会在 Java 中使用 Kotlin 协程呢？ 

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

### 拖动类型基础 API

#### API 介绍

| API名称                          | 作用                 |
| -------------------------------- | -------------------- |
| detectDragGestures               | 监听拖动手势         |
| detectDragGesturesAfterLongPress | 监听长按后的拖动手势 |
| detectHorizontalDragGestures     | 监听水平拖动手势     |
| detectVerticalDragGestures       | 监听垂直拖动手势     |

谈及拖动，许多人第一个反应就是 `Draggable Modifier`，因为 `Draggable Modifier` 为我们提供了监听 UI 组件拖动能力。然而 `Draggable Modifier` 在提供了监听 UI 组件拖动能力的同时也拓展增加其他功能，我们通过 `Draggable Modifier` 参数列表即可看出。例如通过使用 `DraggableState` 允许开发者根据需求使 UI 组件自动被拖动。

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

我们上面所罗列的这些拖动 API 只提供了监听 UI 组件拖动的能力，我们可以根据需求为其拓展功能，这也是这些API所存在的意义。我们从字面上就可以看出每个 API 所对应的含义，由于这些API的功能与参数相近，这里我们仅以 `detectDragGestures` 作为举例说明。

#### 举例说明

接下来我们将完成一个绿色方块的手势拖动。在 `Draggabel Modifier` 中我们还只能监听垂直或水平中某一个方向的手势拖动，而使用 `detectDragGestures` 所有手势信息都是可以拿到的。如果我们还是只希望拿到某一个方向的手势拖动，使用 `detectHorizontalDragGestures`  或 `detectVerticalDragGestures` 即可，当然我们也可以使用 `detectDragGestures` 并且忽略掉某个方向的手势信息。如果我们希望在长按后才能拿到手势信息可以使用 `detectDragGesturesAfterLongPress`。

`detectDragGestures` 提供了四个参数。

onDragStart (可选)：拖动开始时回调

onDragEnd (可选)：拖动结束时回调

onDragCancel (可选)：拖动取消时回调

onDrag (必须)：拖动时回调

`decectDragGestures` 的源码分析在 *awaitTouchSlopOrCancellation* 小节会有讲解。

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
> 有些同学可能困惑 `onDragCancel` 触发时机。在一些场景中，当组件拖动时会根据事件分发顺序进行事件分发，当前面先处理事件的组件满足了设置的消费条件，导致手势事件被消费，导致本组件拿到的是被消费的手势事件，从而会执行 `onDragCancel` 回调。如何定制事件分发顺序并消费事件后续会进行详细的描述。

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

### 点击类型基础 API

#### API 介绍

| API名称           | 作用         |
| ----------------- | ------------ |
| detectTapGestures | 监听点击手势 |

与 `Clickable Modifier` 不同的是，`detectTapGestures` 可以监听更多的点击事件。作为手机监听的基础 API，必然不会存在 `Clickable Modifier` 所拓展的涟漪效果。

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

#### API 介绍

| API名称                 | 作用                     |
| ----------------------- | ------------------------ |
| detectTransformGestures | 监听拖动、缩放与旋转手势 |

与 `Transfomer Modifier` 不同的是，通过这个 API 可以监听单指的拖动手势，和拖动类型基础 API所提供的功能一样，除此之外还支持监听双指缩放与旋转手势。反观`Transfomer Modifier` 只能监听到双指拖动手势，不知设计成这样的行为不一致是否是 Google 有意而为之。

#### 举例说明

接下来我们为这个绿色方块添加变化手势处理逻辑。`detectTransformGestures` 方法提供了两个参数。

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
>2. 若offset发生在scale之前时，scale也会对offset造成影响。具体表现为UI组件在拖动时不跟手

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

### forEachGesture

在传统 View 系统中，一次手指按下、移动到抬起过程中的所有手势事件可以共同构成一个手势事件序列。我们可以通过自定义手势处理来对于每一个手势事件序列进行定制处理。Compose 提供了 `forEachGesture` 以允许用户可以对每一个手势事件序列进行相同的定制处理。如果我们忘记使用 `forEachGesture` ，那么只会处理第一次手势事件序列。有些同学可能会问，为什么我不能在手势处理逻辑最外层套一层 `while(true) ` 呢，通过 `forEachGesture` 的实现我们可以看到 `forEachGesture` 其实内部也是由`while ` 实现的，除此之外他保证了协程只有存活时才能监听手势事件，同时也保证了每次交互结束时所有手指都是离开屏幕的。有些同学看到 `while` 可能新生疑问，难道这样不会阻塞主线程嘛？其实我们在介绍 `PointerInput Modifier` 时就提到过，我们的手势操作处理均发生在协程中。其实前面我们所提到的绝大多数 API 其内部实现均使用了 `forEachGesture` 。有些特殊场景下我们仅使用前面所提出的 API 可能仍然无法满足我们的需求，当然如果可以满足的话我们直接使用其分别对应的 `Modifier` 即可，前面所提出的 API 存在的意义是为了方便开发者为其进行功能拓展。既然要掌握自定义手势处理，我们就要从更底层角度来看这些上层 API 是如何实现的，了解原理我们就可以轻松自定义了。

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

## 手势事件作用域 awaitPointerEventScope

在 `PointerInputScope` 中我们可以找到一个名为 `awaitPointerEventScope` 的 API 方法。

通过翻阅方法声明可以发现这是个挂起方法，其尾部 lambda 在 `AwaitPointerEventScope` 作用域中。 通过这个 `AwaitPointerEventScope` 作用域我们可以获取到更加底层的 API 手势事件，这也为自定义手势处理提供了可能。

```kotlin
suspend fun <R> awaitPointerEventScope(
    block: suspend AwaitPointerEventScope.() -> R
): R
```

我们在 `AwaitPointerEventScope` 中发现了以下这些基础手势方法，可以发现这些 API 均是挂起函数，接下来我们会对每个 API 进行描述说明。

| API名称                                | 作用                 |
| -------------------------------------- | -------------------- |
| awaitPointerEvent                      | 手势事件             |
| awaitFirstDown                         | 第一根手指的按下事件 |
| drag                                   | 拖动事件             |
| horizontalDrag                         | 水平拖动事件         |
| verticalDrag                           | 垂直拖动事件         |
| awaitDragOrCancellation                | 单次拖动事件         |
| awaitHorizontalDragOrCancellation      | 单次水平拖动事件     |
| awaitVerticalDragOrCancellation        | 单次垂直拖动事件     |
| awaitTouchSlopOrCancellation           | 有效拖动事件         |
| awaitHorizontalTouchSlopOrCancellation | 有效水平拖动事件     |
| awaitVerticalTouchSlopOrCancellation   | 有效垂直拖动事件     |

### 万物之源 awaitPointerEvent

`awaitPointerEvent` 类似于传统 View 系统的 `onTouchEvent()` 。无论用户是按下、移动或抬起都将视作一次手势事件，当手势事件发生时 `awaitPointerEvent` 会恢复执行并将手势事件返回。

```kotlin
suspend fun awaitPointerEvent(
  pass: PointerEventPass = PointerEventPass.Main
): PointerEvent
```

通过 API 声明可以看到 `awaitPointerEvent` 有个可选参数 `PointerEventPass`

我们知道手势事件的分发是由父组件到子组件的单链结构。这个参数目的是用以设置父组件与子组件的事件分发顺序，`PointerEventPass` 有 3 个枚举值可供选择，每个枚举值的具体含义如下

| 枚举值                   | 含义                                                         |
| ------------------------ | ------------------------------------------------------------ |
| PointerEventPass.Initial | 本组件优先处理手势，处理后交给子组件                         |
| PointerEventPass.Main    | 若子组件为Final，本组件优先处理手势。否则将手势交给子组件处理，结束后本组件再处理。 |
| PointerEventPass.Final   | 若子组件也为Final，本组件优先处理手势。否则将手势交给子组件处理，结束后本组件再处理。 |

大家可能觉得 Main 与 Final 是等价的。但其实两者在作为子组件时分发顺序会完全不同，举个例子。

当父组件为Final，子组件为Main时，事件分发顺序： 子组件  -> 父组件

当父组件为Final，子组件为Final时，事件分发顺序： 父组件 -> 子组件

文字描述可能并不直观，接下来进行举例说明。

#### 事件分发流程

接下来，我将通过一个嵌套了三层 Box 的示例来直观表现事件分发过程。我们为这嵌套的三层Box 中的每一层都进行手势获取。

<img src = "../../../assets/design/gesture/custom_gesture/box_nest.jpg" width = "50%" height = "50%">

如果我们点击中间的绿色方块时，便会触发手势事件。

当三层 Box 均使用默认 Main 模式时，事件分发顺序为：第三层 -> 第二层 -> 第一层

当第一层Box使用 Inital 模式，第二层使用 Final 模式，第三层使用 Main 模式时，事件分发顺序为：第一层 -> 第三层 -> 第二层

```kotlin
@Preview
@Composable
fun NestedBoxDemo() {
    Box(
        contentAlignment = Alignment.Center,
        modifier = Modifier
            .fillMaxSize()
            .pointerInput(Unit) {
                awaitPointerEventScope {
                    awaitPointerEvent(PointerEventPass.Initial)
                    Log.d("compose_study", "first layer")
                }
            }
    ) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .size(400.dp)
                .background(Color.Blue)
                .pointerInput(Unit) {
                    awaitPointerEventScope {
                        awaitPointerEvent(PointerEventPass.Final)
                        Log.d("compose_study", "second layer")
                    }
                }
        ) {
            Box(
                Modifier
                    .size(200.dp)
                    .background(Color.Green)
                    .pointerInput(Unit) {
                        awaitPointerEventScope {
                            awaitPointerEvent()
                            Log.d("compose_study", "third layer")
                        }
                    }
            )
        }
    }
}

// Output:
// first layer
// third layer
// second layer
```

能够自定义事件分发顺序之后，我们就可以决定手势事件由事件分发流程中哪个组件进行消费。那么如何进行消费呢，这就需要我们看看 `awaitPointerEvent` 返回的手势事件了。通过 `awaintPointerEvent` 声明，我们可以看到返回的手势事件是个 `PointerEvent` 实例。

通过 `PointerEvent` 类声明，我们可以看到两个成员属性 changes 与 motionEvent。

motionEvent 我们再熟悉不过了，就是传统 View 系统中的手势事件，然而却被声明了 internal 关键字，看来是不希望我们使用。

changes 是一个 List，其中包含了每次发生手势事件时，屏幕上所有手指的状态信息。

当只有一根手指时，这个 List 的大小为 1。在多指操作时，我们通过这个 List 获取其他手指的状态信息就可以轻松定制多指自定义手势处理了。

```kotlin
actual data class PointerEvent internal constructor(
    actual val changes: List<PointerInputChange>,
    internal val motionEvent: MotionEvent?
)
```

#### PointerInputChange

```kotlin
class PointerInputChange(
    val id: PointerId, // 手指Id
    val uptimeMillis: Long, // 当前手势事件的时间戳
    val position: Offset, // 当前手势事件相对组件左上角的位置
    val pressed: Boolean, // 当前手势是否按下
    val previousUptimeMillis: Long, // 上一次手势事件的时间戳
    val previousPosition: Offset, // 上一次手势事件相对组件左上角的位置
    val previousPressed: Boolean, // 上一次手势是否按下
    val consumed: ConsumedData, // 当前手势是否已被消费
    val type: PointerType = PointerType.Touch // 手势类型(鼠标、手指、手写笔、橡皮) 
)
```

| API名称                       | 作用                                          |
| ----------------------------- | --------------------------------------------- |
| changedToDown                 | 是否已经按下(按下手势已消费则返回false)       |
| changedToDownIgnoreConsumed   | 是否已经按下(忽略按下手势已消费标记)          |
| changedToUp                   | 是否已经抬起(按下手势已消费则返回false)       |
| changedToUpIgnoreConsumed     | 是否已经抬起(忽略按下手势已消费标记)          |
| positionChanged               | 是否位置发生了改变(移动手势已消费则返回false) |
| positionChangedIgnoreConsumed | 是否位置发生了改变(忽略已消费标记)            |
| positionChange                | 位置改变量(移动手势已消费则返回Offset.Zero)   |
| positionChangeIgnoreConsumed  | 位置改变量(忽略移动手势已消费标记)            |
| positionChangeConsumed        | 当前移动手势是否已被消费                      |
| anyChangeConsumed             | 当前按下手势或移动手势是否有被消费            |
| consumeDownChange             | 消费按下手势                                  |
| consumePositionChange         | 消费移动手势                                  |
| consumeAllChanges             | 消费按下与移动手势                            |
| isOutOfBounds                 | 当前手势是否在固定范围内                      |

这些 API 会在我们自定义手势处理时会被用到。可以发现的是，Compose 通过 `PointerEventPass` 来定制事件分发流程，在事件分发流程中即使前一个组件先获取了手势信息并进行了消费，后面的组件仍然可以通过带有 `IgnoreConsumed` 系列 API 来获取到手势信息。这也极大增加了手势操作的可定制性。就好像父组件先把事件消费，希望子组件不要处理这个手势了，但子组件完全可以不用听从父组件的话。

我们通过一个实例来看看该如何进行手势消费，处于方便我们的示例不涉及移动，只消费按下手势事件来进行举例。和之前的样式一样，我们将手势消费放在了第三层 Box，根据事件分发规则我们知道第三层Box是第2个处理手势事件的，所以输出结果如下。

```kotlin
@Preview
@Composable
fun Demo() {
    Box(
        contentAlignment = Alignment.Center,
        modifier = Modifier
            .fillMaxSize()
            .pointerInput(Unit) {
                awaitPointerEventScope {
                    var event = awaitPointerEvent(PointerEventPass.Initial)
                    Log.d("compose_study", "first layer, downChange: ${event.changes[0].consumed.downChange}")
                }
            }
    ) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .size(400.dp)
                .background(Color.Blue)
                .pointerInput(Unit) {
                    awaitPointerEventScope {
                        var event = awaitPointerEvent(PointerEventPass.Final)
                        Log.d("compose_study", "second layer, downChange: ${event.changes[0].consumed.downChange}")
                    }
                }
        ) {
            Box(
                Modifier
                    .size(200.dp)
                    .background(Color.Green)
                    .pointerInput(Unit) {
                        awaitPointerEventScope {
                            var event = awaitPointerEvent()
                            event.changes[0].consumeDownChange()
                            Log.d("compose_study", "third layer, downChange: ${event.changes[0].consumed.downChange}")
                        }
                    }
            )
        }
    }
}

// Output:
// first layer, downChange: false
// third layer, downChange: true
// second layer, downChange: true
```



⚠️ **注意事项**

如果我们是在定制事件分发流程，那么需要注意以下两种写法

```kotlin
// 正确写法
awaitPointerEventScope {
    var event = awaitPointerEvent() 
  	event.changes[0].consumeDownChange()
}

// 错误写法
var event = awaitPointerEventScope {
    awaitPointerEvent()
}
event.changes[0].consumeDownChange()
```

他们的区别在于 `awaitPointerEventScope` 会在其内部所有手势在事件分发流程结束后返回，当所有组件都已经完成手势处理再进行消费已经没有什么意义了。我们仍然用刚才的例子来直观说明这个问题。我们在每一层Box `awaitPointerEventScope` 后面添加了日志信息。

通过输出结果可以发现，这三层执行的相对顺序没有发生变化，然而却是在事件分发流程结束后才进行输出的。

```kotlin
@Preview
@Composable
fun Demo() {
    Box(
        contentAlignment = Alignment.Center,
        modifier = Modifier
            .fillMaxSize()
            .pointerInput(Unit) {
                awaitPointerEventScope {
                    var event = awaitPointerEvent(PointerEventPass.Initial)
                    Log.d("compose_study", "first layer, downChange: ${event.changes[0].consumed.downChange}")
                }
                Log.d("compose_study", "first layer Outside")
            }
    ) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .size(400.dp)
                .background(Color.Blue)
                .pointerInput(Unit) {
                    awaitPointerEventScope {
                        var event = awaitPointerEvent(PointerEventPass.Final)
                        Log.d("compose_study", "second layer, downChange: ${event.changes[0].consumed.downChange}")
                    }
                    Log.d("compose_study", "second layer Outside")
                }
        ) {
            Box(
                Modifier
                    .size(200.dp)
                    .background(Color.Green)
                    .pointerInput(Unit) {
                        awaitPointerEventScope {
                            var event = awaitPointerEvent()
                            event.changes[0].consumeDownChange()
                            Log.d("compose_study", "third layer, downChange: ${event.changes[0].consumed.downChange}")
                        }
                        Log.d("compose_study", "third layer Outside")
                    }
            )
        }
    }
}

// Output:
// first layer, downChange: false
// third layer, downChange: true
// second layer, downChange: true
// first layer Outside
// third layer Outside
// second layer Outside
```

### awaitFirstDown

`awaitFirstDown` 将等待第一根手指按下事件时恢复执行，并将手指按下事件返回。分析源码我们可以发现 `awaitFirstDown` 也使用的是 `awaitPointerEvent` 实现的，默认使用 Main 模式。

```kotlin
suspend fun AwaitPointerEventScope.awaitFirstDown(
    requireUnconsumed: Boolean = true
): PointerInputChange {
    var event: PointerEvent
    do {
        event = awaitPointerEvent()
    } while (
        !event.changes.fastAll {
            if (requireUnconsumed) it.changedToDown() else it.changedToDownIgnoreConsumed()
        }
    )
    return event.changes[0]
}
```

### drag

看到 `drag` 可能很多同学疑惑为什么又是拖动。其实前面所提到的拖动类型基础API `detectDragGestures` 其内部就是使用 `drag` 而实现的。与 `detectDragGestures` 不同的是，`drag` 需要主动传入一个 `PointerId` 用以表示要具体获取到哪根手指的拖动事件。

```kotlin
suspend fun AwaitPointerEventScope.drag(
    pointerId: PointerId,
    onDrag: (PointerInputChange) -> Unit
)
```

翻阅源码可以发现，其实 drag 内部实现最终使用的仍然还是 `awaitPointerEvent` 。这里就不具体展开看了，感兴趣的可以自己去跟源码。

#### 举例说明

通过结合 `awaitFirstDown` 与 `drag` 这些基础 API 我们已经可以自己实现 UI 拖动手势流程了。我们仍然以我们的绿色方块作为实例，为其添加拖动手势。

```kotlin
@Preview
@Composable
fun BaseDragGestureDemo() {
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
                forEachGesture { // 循环监听每一组事件序列
                    awaitPointerEventScope {
                        var downEvent = awaitFirstDown()
                        drag(downEvent.id) {
                            offset += it.positionChange()
                        }
                    }
                }
            }
        )
    }
}
```

<div align = "center">
  <img src = "../../../assets/design/gesture/custom_gesture/drag.gif" width = "50%" height = "50%">
</div>

### awaitDragOrCancellation

与 `drag` 不同的是，`awaitDragOrCancellation` 负责监听单次拖动事件。当手指已经抬起或拖动事件已经被消费时会返回 null。当然我们也可以使用 `awaitDragOrCancellation` 来完成 UI 拖动手势处理流程。通过翻阅源码可以发现 `drag` 其实内部也是使用 `awaitDragOrCancellation` 进行实现的。而 `awaitDragOrCancellation` 内部仍然是 `awaitPointerEvent`。

```kotlin
@Preview
@Composable
fun BaseDragGestureDemo() {
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
                forEachGesture {
                    awaitPointerEventScope {
                        var downPointer = awaitFirstDown()
                        while (true) {
                            var event = awaitDragOrCancellation(downPointer.id)
                            if (event == null) {
                                break
                            }
                            offset += event.positionChange()
                        }
                    }
                }
            }
        )
    }
}
```

### awaitTouchSlopOrCancellation

`awaitTouchSlopOrCancellation` 用于监测当前拖动手势是否是一次有效的拖动。有效指的是当前手势滑动的欧式距离(位移)是否超过设定的阈值。若拖动手势还没有达到阈值便抬起或拖动手势事件已经被消费时将返回null，翻阅源码我们又找到了`awaitPointerEvent` ，所以说 `awaitPointerEvent` 是万物之源嘛～。

```kotlin
suspend fun AwaitPointerEventScope.awaitTouchSlopOrCancellation(
    pointerId: PointerId,
    onTouchSlopReached: (change: PointerInputChange, overSlop: Offset) -> Unit
): PointerInputChange? {
   	...
    val touchSlop = viewConfiguration.touchSlop
    var pointer = pointerId
    while (true) {
        val event = awaitPointerEvent()
        ...
        if (dragEvent.positionChangeConsumed()) {
            ...
        } else if (dragEvent.changedToUpIgnoreConsumed()) {
            ...
        } else {
            ...
          	if (distance >= touchSlop) {
                ...
            }
            ...
        }
    }
}
```

我们前面所提到的 `detectDragGestures` 其内部不仅使用了 `drag` 还使用了 `awaitTouchSlopOrCancellation` 来判断手势拖动操作。仅当监测为一次有效的拖动时，才会执行 onDragStart 回调。接下来就是使用 `drag` 来监听拖动手势，仅当 `drag` 返回 false (即在拖动过程中事件分发流程前面的组件达成定制条件消费了这次的拖动手势事件) 会执行 onDragCancel 回调，否则如果所有手指抬起正常结束则会执行 onDragEnd 回调。

```kotlin
suspend fun PointerInputScope.detectDragGestures(
    onDragStart: (Offset) -> Unit = { },
    onDragEnd: () -> Unit = { },
    onDragCancel: () -> Unit = { },
    onDrag: (change: PointerInputChange, dragAmount: Offset) -> Unit
) {
    forEachGesture {
        awaitPointerEventScope {
            ....
            do {
                drag = awaitTouchSlopOrCancellation(down.id) { change, over ->
                    change.consumePositionChange()
                    overSlop = over
                }
            } while (drag != null && !drag.positionChangeConsumed())
            if (drag != null) {
                onDragStart.invoke(drag.position) // 拖动开始
                onDrag(drag, overSlop)
                if (
                    !drag(drag.id) {
                        onDrag(it, it.positionChange())
                        it.consumePositionChange()
                    }
                ) {
                    onDragCancel() // 拖动取消
                } else {
                    onDragEnd()
                }
            }
        }
    }
}
```

