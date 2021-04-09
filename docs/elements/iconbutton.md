`IconButton` 可以帮助我们生成一个可点击的图标按钮


``` kotlin
@Composable
fun IconButtonDemo() {

    Row{
        IconButton(onClick = { /*TODO*/ }) {
            Icon(Icons.Filled.Search, null)
        }
        IconButton(onClick = { /*TODO*/ }) {
            Icon(Icons.Filled.ArrowBack, null)
        }
        IconButton(onClick = { /*TODO*/ }) {
            Icon(Icons.Filled.Done, null)
        }
    }
    
}
```

![](../assets/elements/iconbutton/demo.gif)
