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