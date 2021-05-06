`ModalBottomSheetLayout` 呈现了一系列的选择，同时阻止了与屏幕其他部分的互动。

它们是移动端上内嵌式菜单和简单对话框的替代方案，为内容、图标和操作提供了额外的空间

一个简单的 `ModalBottomSheetLayout` 的例子是这样的：

``` kotlin
val state = rememberModalBottomSheetState(ModalBottomSheetValue.Hidden)
val scope = rememberCoroutineScope()
ModalBottomSheetLayout(
    sheetState = state,
    sheetContent = {
        Column{
            ListItem(text = {Text("选择分享到哪里吧~")})

            ListItem(text = {Text("github")}, icon = {
                Surface(
                    shape = CircleShape,
                    color = Color(0xFF181717)
                ) {
                    Icon(
                        painterResource(R.drawable.github),
                        null,
                        tint = Color.White,
                        modifier = Modifier.padding(4.dp)
                    )
                }
            },modifier = Modifier.clickable {  })

            ListItem(text = {Text("微信")}, icon = {
                Surface(
                    shape = CircleShape,
                    color = Color(0xFF07C160)
                ) {
                    Icon(
                        painterResource(R.drawable.wechat),
                        null,
                        tint = Color.White,
                        modifier = Modifier.padding(4.dp)
                    )
                }
            },modifier = Modifier.clickable {  })
        }
    }
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Button(onClick = { scope.launch { state.show() } }) {
            Text("点我展开")
        }
    }
}
```

![](../../assets/layout/modalbottomsheetlayout/demo.gif)

!!! 注意
    目前使用 `ModalBottomSheetLayout` 需要标明 `@ExperimentalMaterialApi`
