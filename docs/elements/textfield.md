`textfield` 可以创建一个输入框

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


## `singleLine` 参数

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