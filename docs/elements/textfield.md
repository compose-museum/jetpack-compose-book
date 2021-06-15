```kotlin
@Composable
fun TextField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    textStyle: TextStyle = LocalTextStyle.current,
    label: @Composable (() -> Unit)? = null,
    placeholder: @Composable (() -> Unit)? = null,
    leadingIcon: @Composable (() -> Unit)? = null,
    trailingIcon: @Composable (() -> Unit)? = null,
    isError: Boolean = false,
    visualTransformation: VisualTransformation = VisualTransformation.None,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    keyboardActions: KeyboardActions = KeyboardActions(),
    singleLine: Boolean = false,
    maxLines: Int = Int.MAX_VALUE,
    interactionSource: MutableInteractionSource = remember { MutableInteractionSource() },
    shape: Shape =
        MaterialTheme.shapes.small.copy(bottomEnd = ZeroCornerSize, bottomStart = ZeroCornerSize),
    colors: TextFieldColors = TextFieldDefaults.textFieldColors()
)
```


`textfield` 可以创建一个输入框。

一个简单使用的例子是这样的：

``` kotlin
import androidx.compose.runtime.*

@Composable
fun TextFieldDemo() {
    var text by remember{ mutableStateOf("")}

    TextField(
        value = text,
        onValueChange = {
            text = it
        }
    )
}
```

![](../assets/elements/textfield/demo.gif)


## 1. singleLine 参数

使用 `singleLine` 参数可以将 `TextField` 设置成只有一行

设置了 `singleLine` 再设置 `maxLines` 将无效

``` kotlin
@Composable
fun TextFieldDemo() {
    var text by remember{ mutableStateOf("")}

    TextField(
        value = text,
        onValueChange = {
            text = it
        },
        singleLine = true
    )
}
```

## 2. label 参数

label 标签可以运用在 `TextField` 中，当聚焦的时候会改变字体大小

``` kotlin
@Composable
fun TextFieldDemo() {
    var text by remember{ mutableStateOf("")}

    Column(
        modifier = Modifier
            .fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        TextField(
            value = text,
            onValueChange = {
                text = it
            },
            singleLine = true,
            label = {
                Text("邮箱")
            }
        )
    }
}
```

![](../assets/elements/textfield/demo2.gif)


## 3. leadingIcon 参数

`leadingIcon` 参数可以在 `TextField` 前面布置 `lambda` 表达式所接收到的东西

``` kotlin
TextField(
    value = text,
    onValueChange = {
        text = it
    },
    leadingIcon = {
        Icon(Icons.Filled.Search, null)
    },
)
```

![](../assets/elements/textfield/demo3.png)

虽然名字上叫做 `leadingIcon`，但是 `leadingIcon` 接收来自一个 **@Composable** 函数的 `lambda` 表达式，

我们也可以在里面填入 `Text` 函数

``` kotlin
TextField(
    value = text,
    onValueChange = {
        text = it
    },
    leadingIcon = {
        Text("联系人")
    },
)
```

![](../assets/elements/textfield/demo4.png)

## 4. trailingIcon 参数

`trailingIcon` 参数可以在 `TextField` 尾部布置 `lambda` 表达式所接收到的东西

``` kotlin
TextField(
    value = text,
    onValueChange = {
        text = it
    },
    trailingIcon = {
        Text("@163.com")
    },
)
```

![](../assets/elements/textfield/demo6.png)

``` kotlin
trailingIcon = {
    IconButton(onClick = {
        
    }){
        Icon(Icons.Filled.Send, null)
    }
},
```

![](../assets/elements/textfield/demo7.png)



## 5. Color 参数

``` kotlin
@Composable
fun textFieldColors(
    // 输入的文字颜色
    textColor: Color = LocalContentColor.current.copy(LocalContentAlpha.current),

    // 禁用 TextField 时，已有的文字颜色
    disabledTextColor: Color = textColor.copy(ContentAlpha.disabled),

    // 输入框的背景颜色，当设置为 Color.Transparent 时，将透明
    backgroundColor: Color = MaterialTheme.colors.onSurface.copy(alpha = BackgroundOpacity),

    // 输入框的光标颜色
    cursorColor: Color = MaterialTheme.colors.primary,

    // 当 TextField 的 isError 参数为 true 时，光标的颜色
    errorCursorColor: Color = MaterialTheme.colors.error,

    // 当输入框处于焦点时，底部指示器的颜色
    focusedIndicatorColor: Color = MaterialTheme.colors.primary.copy(alpha = ContentAlpha.high),

    // 当输入框不处于焦点时，底部指示器的颜色
    unfocusedIndicatorColor: Color = MaterialTheme.colors.onSurface.copy(alpha = UnfocusedIndicatorLineOpacity),

    // 禁用 TextField 时，底部指示器的颜色
    disabledIndicatorColor: Color = unfocusedIndicatorColor.copy(alpha = ContentAlpha.disabled),

    // 当 TextField 的 isError 参数为 true 时，底部指示器的颜色
    errorIndicatorColor: Color = MaterialTheme.colors.error,

    // TextField 输入框前头的颜色
    leadingIconColor: Color = MaterialTheme.colors.onSurface.copy(alpha = IconOpacity),

    // 禁用 TextField 时 TextField 输入框前头的颜色
    disabledLeadingIconColor: Color = leadingIconColor.copy(alpha = ContentAlpha.disabled),

    // 当 TextField 的 isError 参数为 true 时 TextField 输入框前头的颜色
    errorLeadingIconColor: Color = leadingIconColor,

    // TextField 输入框尾部的颜色
    trailingIconColor: Color = MaterialTheme.colors.onSurface.copy(alpha = IconOpacity),

    // 禁用 TextField 时 TextField 输入框尾部的颜色
    disabledTrailingIconColor: Color = trailingIconColor.copy(alpha = ContentAlpha.disabled),

    // 当 TextField 的 isError 参数为 true 时 TextField 输入框尾部的颜色
    errorTrailingIconColor: Color = MaterialTheme.colors.error,

    // 当输入框处于焦点时，Label 的颜色
    focusedLabelColor: Color = MaterialTheme.colors.primary.copy(alpha = ContentAlpha.high),

    // 当输入框不处于焦点时，Label 的颜色
    unfocusedLabelColor: Color = MaterialTheme.colors.onSurface.copy(ContentAlpha.medium),

    // 禁用 TextField 时，Label 的颜色
    disabledLabelColor: Color = unfocusedLabelColor.copy(ContentAlpha.disabled),

    // 当 TextField 的 isError 参数为 true 时，Label 的颜色
    errorLabelColor: Color = MaterialTheme.colors.error,

    // Placeholder 的颜色
    placeholderColor: Color = MaterialTheme.colors.onSurface.copy(ContentAlpha.medium),

    // 禁用 TextField 时，placeholder 的颜色
    disabledPlaceholderColor: Color = placeholderColor.copy(ContentAlpha.disabled)
)
```

调用方法

``` kotlin
TextField(
    value = text,
    onValueChange = {
        text = it
    },
    leadingIcon = {
        Icon(Icons.Filled.Search, null)
    },
    colors = TextFieldDefaults.textFieldColors(
        textColor = Color(0xFF0079D3),
        backgroundColor = Color.Transparent
    )
)
```

![](../assets/elements/textfield/demo3.gif)

在你使用 IDE 智能补全的时候可能遇到这种情况

![](../assets/elements/textfield/demo5.png)

解决方法如下，手动打完函数名

![](../assets/elements/textfield/demo4.gif)

## 更多

[TextField 参数详情](https://developer.android.com/reference/kotlin/androidx/compose/material/package-summary#textfield)