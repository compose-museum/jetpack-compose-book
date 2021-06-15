```kotlin
@Composable
fun Slider(
    value: Float,
    onValueChange: (Float) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    valueRange: ClosedFloatingPointRange<Float> = 0f..1f,
    /*@IntRange(from = 0)*/
    steps: Int = 0,
    onValueChangeFinished: (() -> Unit)? = null,
    interactionSource: MutableInteractionSource = remember { MutableInteractionSource() },
    colors: SliderColors = SliderDefaults.colors()
)
```

`Slider` 允许用户从一定范围的数值中进行选择。

`Slider` 反映了一个沿条的数值范围，用户可以从中选择一个单一的数值。它们是调整音量、亮度或应用图像过滤器等设置的理想选择。

[Material Design Slider](https://material.io/components/sliders)


来看看一个简单的用法：

``` kotlin

var progress by remember{ mutableStateOf(0f)}

Slider(
    value = progress,
    colors = SliderDefaults.colors(
        thumbColor = Color.White, // 圆圈的颜色
        activeTrackColor = Color(0xFF0079D3)
    ),
    onValueChange = {
        progress = it
    },
)
```

![](../assets/elements/slider/demo.gif)


``` kotlin
@Composable
fun colors(
    thumbColor: Color = MaterialTheme.colors.primary,
    disabledThumbColor: Color = MaterialTheme.colors.onSurface
        .copy(alpha = ContentAlpha.disabled)
        .compositeOver(MaterialTheme.colors.surface),
    activeTrackColor: Color = MaterialTheme.colors.primary,
    inactiveTrackColor: Color = activeTrackColor.copy(alpha = InactiveTrackAlpha),
    disabledActiveTrackColor: Color = MaterialTheme.colors.onSurface.copy(alpha = DisabledActiveTrackAlpha),
    disabledInactiveTrackColor: Color = disabledActiveTrackColor.copy(alpha = DisabledInactiveTrackAlpha),
    activeTickColor: Color = contentColorFor(activeTrackColor).copy(alpha = TickAlpha),
    inactiveTickColor: Color = activeTrackColor.copy(alpha = TickAlpha),
    disabledActiveTickColor: Color = activeTickColor.copy(alpha = DisabledTickAlpha),
    disabledInactiveTickColor: Color = disabledInactiveTrackColor.copy(alpha = DisabledTickAlpha)
)
```

``` kotlin
// 滑条未经过部分的默认 alpha 值
const val InactiveTrackAlpha = 0.24f

// 当滑条被禁用的状态下已经过部分的默认 alpha 值
const val DisabledInactiveTrackAlpha = 0.12f

// 当滑条被禁用的状态下未经过部分的默认 alpha 值
const val DisabledActiveTrackAlpha = 0.32f

// 在滑条上方显示的刻度的默认的 alpha 值
const val TickAlpha = 0.54f

// 当刻度线被禁用时，默认的 alpha 值
const val DisabledTickAlpha = 0.12f
```

从源码中，我们可以知道，设置滑条经过区域的颜色是 `activeTrackColor`, 而滑条中未经过的地方是 `inactiveTrackColor`，它将 `activeTrackColor` 复制，并且设置了 `0.24f` 的透明度

所以一般来说，我们只需要设置 `activeTrackColor` 的值就可以改变滑条的总体颜色（经过和未经过的区域）

