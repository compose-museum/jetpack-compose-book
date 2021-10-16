## 1. [Button](https://docs.compose.net.cn/api/elements/button/#1-button)属性

```kotlin
@OptIn(ExperimentalMaterialApi::class)
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

**Compose** 的 `Button` 是基于 **Material Design** 实现的，和传统的 **XML Button** 截然不同

## 2. 使用示例

### 2.1 基本使用

以下是简单创建一个默认的 `Button` 代码：

``` kotlin
import androidx.compose.material.Button
import androidx.compose.material.Text

@Composable
fun ButtonDemo() {
    Button(onClick = { /*TODO*/ }) {
        Text("确认")
    }
}
```

效果如图所示：

![Button example 1]({{config.assets}}/elements/button/button1.png)

也许您想添加图标在文字的旁边，也只需：

``` kotlin
@Composable
fun ButtonDemo() {
    Button(onClick = { /*TODO*/ }) {
        Icon(
            // Material 库中的图标，有 Filled, Outlined, Rounded, Sharp, Two Tone 等
            Icons.Filled.Favorite,
            contentDescription = null,
            modifier = Modifier.size(ButtonDefaults.IconSize)
        )
        // 添加间隔
        Spacer(Modifier.size(ButtonDefaults.IconSpacing))
        Text("喜欢")
    }
}
```

![Button example 2]({{config.assets}}/elements/button/button2.png)

### 2.2 不同点击状态下的按钮状态

创建 `Data class` 来记录不同状态下按钮的样式

```kotlin
data class ButtonState(var text: String, var textColor: Color, var buttonColor: Color)
```

使用 [`MutableInteractionSource()`](https://developer.android.com/reference/kotlin/androidx/compose/foundation/interaction/MutableInteractionSource) 获取状态，根据不同状态创建样式

```kotlin
// 获取按钮的状态
val interactionState = remember { MutableInteractionSource() }

// 使用Kotlin的解构方法
val (text, textColor, buttonColor) = when {
    interactionState.collectIsPressedAsState().value  -> ButtonState("Just Pressed", Color.Red, Color.Black)
    else -> ButtonState( "Just Button", Color.White, Color.Red)
}
```

`Button` 的实现

```kotlin
Button(
    onClick = { /*TODO*/ },
    interactionSource = interactionState,
    elevation = null,
    shape = RoundedCornerShape(50),
    colors = ButtonDefaults.buttonColors(
        backgroundColor = buttonColor,
    ),
    modifier = Modifier.width(IntrinsicSize.Min).height(IntrinsicSize.Min)
) {
    Text(
        text = text, color = textColor
    )
}
```

![Button example 3](https://img-blog.csdnimg.cn/20201208200319838.gif#pic_center)

## 更多

[Button 参数详情](https://developer.android.com/reference/kotlin/androidx/compose/material/package-summary#button)