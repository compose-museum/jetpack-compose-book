## 1. 介绍
`Text` 是 `Compose` 中最基本的元素，它可以显示文字（废话 233

``` kotlin
@Composable
fun TextDemo() {
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("Hello World")
    }
}
```

## 2. style 参数

当然，我们有时候也需要更换字体的大小

`Material` 已经为我们准备了很多专门的字体大小, 从 `h1` 到 `overline`

``` kotlin
@Composable
fun TextDemo() {
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "你好陌生人",
            style = MaterialTheme.typography.h6
        )
    }
}
```
<img src="../../assets/elements/text/text1.png">

当然有的时候我们想自己自定义字体的间隔和大小，那我们可以将代码改为：

``` kotlin
@Composable
fun TextDemo() {
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "你好陌生人",
            style = TextStyle(
                fontWeight = FontWeight.W900,
                fontSize = 20.sp,
                letterSpacing = 7.sp
            )
        )
    }
}
```

它将会显示成

<img src="../../assets/elements/text/text2.png">
