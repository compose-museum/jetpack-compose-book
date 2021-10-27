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
