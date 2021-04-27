## drawerContent 参数

设置了 `drawerContent` 参数可以创建一个侧边应用栏

``` kotlin
@Composable
fun ScaffoldDemo() {
    Scaffold(
        drawerContent = {
            DrawerContent()
        }
    ) {

    }
}

@Composable
fun DrawerContent(){
    Box(
        modifier = Modifier
            .fillMaxSize()
    ){
        Row(
            modifier = Modifier
                .fillMaxWidth(),
            horizontalArrangement = Arrangement.Start,
            verticalAlignment = Alignment.CenterVertically
        ){
            Surface(
                shape = CircleShape,
                modifier = Modifier
                    .size(50.dp)
            ){
                Image(painterResource(id = R.drawable.logo), null)
            }
            Spacer(Modifier.padding(horizontal = 10.dp))
            Text("香辣鸡腿堡")
        }
    }
}
```

![](../../assets/layout/scaffold/drawercontent/demo.gif)