## 1. Button

```kotlin
@Composable
fun Button(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    interactionSource: MutableInteractionSource = remember { MutableInteractionSource() },
    elevation: ButtonElevation? = ButtonDefaults.elevation(),
    shape: Shape = MaterialTheme.shapes.small,
    border: BorderStroke? = null,
    colors: ButtonColors = ButtonDefaults.buttonColors(),
    contentPadding: PaddingValues = ButtonDefaults.ContentPadding,
    content: @Composable RowScope.() -> Unit
)
```

| 参数 | |
| ----| ----- |
| **onClick:() -> Unit** | 当用户点击按钮时将被调用，如果不提供该回调，那么按钮将变为禁用状态 |
| **modifier: [Modifier](https://developer.android.com/reference/kotlin/androidx/compose/ui/Modifier) = Modifier** | 应用于该布局节点的 `Modifier` |
| **enabled: [Boolean](https://developer.android.com/reference/kotlin/java/lang/Boolean) = true** | 控制按钮的启用状态。如果为 `false` ，则该按钮将不可单击； |
| **interactionSource: [MutableInteractionSource](https://developer.android.com/reference/kotlin/androidx/compose/foundation/interaction/MutableInteractionSource) = remember { MutableInteractionSource() }** | 表示交互的状态信息，也就是相当于我们之前给按钮设置的各种selector，来实现普通、点击效果等 |
| **elevation: [ButtonElevation?](https://developer.android.com/reference/kotlin/androidx/compose/material/ButtonElevation) = ButtonDefaults.elevation()** | 用于解析此按钮在不同状态下的高度。这控制了按钮下方阴影的大小。在此处传递 `null` 以禁用此按钮的高度。请参阅 `ButtonDefaults.elevation`。 |
| **shape: [Shape](https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/Shape) = MaterialTheme.shapes.small** | 定义按钮的形状及其阴影 |
| **border: [BorderStroke?](https://developer.android.com/reference/kotlin/androidx/compose/foundation/BorderStroke) = null** | 在按钮周围绘制边框 |
| **colors: [ButtonColors](https://developer.android.com/reference/kotlin/androidx/compose/material/ButtonColors) = ButtonDefaults.buttonColors()** | 颜色 `ButtonColors` 将用于解析此按钮在不同状态下的背景和内容颜色。参见 `ButtonDefaults.buttonColors` |
| **contentPadding: [PaddingValues](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/PaddingValues) = ButtonDefaults.ContentPadding** | 在容器和内容之间内部应用的间距值 |
| **content: @Composable RowScope.() -> Unit** | 按钮的内容，按钮可能包含文本信息，也可能包含图标信息，这个参数就是让你组合你需要的控件的，注意它是横向的。 |