Compose 提供了多种 API，可帮助您检测用户互动生成的手势。API 涵盖各种用例：

其中一些**级别较高**，旨在覆盖最常用的手势。例如，[`clickable`](https://developer.android.com/reference/kotlin/androidx/compose/foundation/package-summary?hl=zh-cn#clickable(androidx.compose.ui.Modifier,kotlin.Boolean,kotlin.String,androidx.compose.ui.semantics.Role,kotlin.Function0)) 修饰符可用于轻松检测点击，此外它还提供无障碍功能，并在点按时显示视觉指示（例如涟漪）。

还有一些不太常用的手势检测器，它们在**较低级别**提供更大的灵活性，例如 `PointerInputScope.detectTapGestures` 或 `PointerInputScope.detectDragGestures`，但不提供额外功能。

## 1. 点击并按下

[`clickable`](https://developer.android.com/reference/kotlin/androidx/compose/foundation/package-summary?hl=zh-cn#clickable(androidx.compose.ui.Modifier,kotlin.Boolean,kotlin.String,androidx.compose.ui.semantics.Role,kotlin.Function0)) 修饰符允许应用检测对已应用该修饰符的元素的点击。

```kotlin
@Composable
fun ClickableSample() {
    val count = remember { mutableStateOf(0) }
    // content that you want to make clickable
    Text(
        text = count.value.toString(),
        modifier = Modifier.clickable { count.value += 1 }
    )
}
```

![clickable example](https://developer.android.com/images/jetpack/compose/gestures-taps.gif?hl=zh-cn)

当需要更大灵活性时，您可以通过 `pointerInput` 修饰符提供点按手势检测器：

```kotlin
Modifier.pointerInput(Unit) {
    detectTapGestures(
        onPress = { /* Called when the gesture starts */ },
        onDoubleTap = { /* Called on Double Tap */ },
        onLongPress = { /* Called on Long Press */ },
        onTap = { /* Called on Tap */ }
    )
}
```

!!! info 注意
    如果您想要显示项列表，请考虑使用 `LazyColumn` 和 `LazyRow` 而不是使用这些 API。 `LazyColumn` 和 `LazyRow` 具有滚动功能，它们的效率远高于滚动修饰符，因为它们仅在需要时组合各个项。如需了解详情，请参阅“列表”。

## 2. 滚动修饰符

[`verticalScroll`](https://developer.android.com/images/jetpack/compose/gestures-simplescroll.gif?hl=zh-cn) 和 [`horizontalScroll`](https://developer.android.com/reference/kotlin/androidx/compose/foundation/package-summary?hl=zh-cn#horizontalScroll(androidx.compose.ui.Modifier,androidx.compose.foundation.ScrollState,kotlin.Boolean,androidx.compose.foundation.gestures.FlingBehavior,kotlin.Boolean)) 修饰符提供一种最简单的方法，可让用户在元素内容边界大于最大尺寸约束时滚动元素。利用 `verticalScroll` 和 `horizontalScroll` 修饰符，您无需转换或偏移内容。

```kotlin
@Composable
fun ScrollBoxes() {
    Column(
        modifier = Modifier
            .background(Color.LightGray)
            .size(100.dp)
            .verticalScroll(rememberScrollState())
    ) {
        repeat(10) {
            Text("Item $it", modifier = Modifier.padding(2.dp))
        }
    }
}
```

![响应滚动手势的简单垂直列表](https://developer.android.com/images/jetpack/compose/gestures-simplescroll.gif?hl=zh-cn)

借助 `ScrollState` ，您可以更改滚动位置或获取当前状态。如需使用默认参数创建此列表，请使用 `rememberScrollState()` 。

```kotlin
@Composable
private fun ScrollBoxesSmooth() {

    // Smoothly scroll 100px on first composition
    val state = rememberScrollState()
    LaunchedEffect(Unit) { state.animateScrollTo(100) }

    Column(
        modifier = Modifier
            .background(Color.LightGray)
            .size(100.dp)
            .padding(horizontal = 8.dp)
            .verticalScroll(state)
    ) {
        repeat(10) {
            Text("Item $it", modifier = Modifier.padding(2.dp))
        }
    }
}
```

## 3. 可滚动的修饰符

[`scrollable`](https://developer.android.com/reference/kotlin/androidx/compose/foundation/gestures/package-summary?hl=zh-cn#scrollable(androidx.compose.ui.Modifier,androidx.compose.foundation.gestures.ScrollableState,androidx.compose.foundation.gestures.Orientation,kotlin.Boolean,kotlin.Boolean,androidx.compose.foundation.gestures.FlingBehavior,androidx.compose.foundation.interaction.MutableInteractionSource)) 修饰符与滚动修饰符不同，区别在于 `scrollable` 可检测滚动手势，但不会偏移其内容。此修饰符需要 `ScrollableController` 才能正常运行。构造 `ScrollableController` 时，您必须提供一个 `consumeScrollDelta` 函数，该函数将在每个滚动步骤（通过手势输入、平滑滚动或投掷）调用，并且增量以像素为单位。为了确保正确传播事件，必须从此函数返回使用的滚动距离量。

以下代码段可检测手势并显示偏移量的数值，但不会偏移任何元素：

```kotlin
@Composable
fun ScrollableSample() {
    // actual composable state
    var offset by remember { mutableStateOf(0f) }
    Box(
        Modifier
            .size(150.dp)
            .scrollable(
                orientation = Orientation.Vertical,
                // Scrollable state: describes how to consume
                // scrolling delta and update offset
                state = rememberScrollableState { delta ->
                    offset += delta
                    delta
                }
            )
            .background(Color.LightGray),
        contentAlignment = Alignment.Center
    ) {
        Text(offset.toString())
    }
}
```

![一种用于检测手指按下手势并显示手指位置数值的界面元素](https://developer.android.com/images/jetpack/compose/gestures-numeric-offset.gif?hl=zh-cn)
