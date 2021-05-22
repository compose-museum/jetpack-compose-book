
`floatingActionButton` 可以创建可以位于底部的按钮

可以设置 `FabPostion.Center` 或 `FabPostion.End`

``` kotlin
@Composable
fun ScaffoldDemo() {
    Scaffold(
        floatingActionButtonPosition = FabPosition.Center,
        floatingActionButton = {
            FloatingActionButton(
                onClick = {

                },
                backgroundColor = Color.Gray
            ) {
                Row(
                    modifier = Modifier.padding(10.dp),
                    verticalAlignment = Alignment.CenterVertically
                ){
                    Icon(Icons.Filled.Add, null)
                    Text("添加事件")
                }
            }
        }
    ) {
        
    }
}
```

<img src = "../../../assets/elements/floatingactionbutton/demo.png" width = "25%" height = "25%">