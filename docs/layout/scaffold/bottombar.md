
``` kotlin
@Composable
fun BottomAppBar(
    modifier: Modifier = Modifier,
    backgroundColor: Color = MaterialTheme.colors.primarySurface,
    contentColor: Color = contentColorFor(backgroundColor),
    cutoutShape: Shape? = null,
    elevation: Dp = AppBarDefaults.BottomAppBarElevation,
    contentPadding: PaddingValues = AppBarDefaults.ContentPadding,
    content: RowScope.() -> Unit
): @Composable Unit
```

``` kotlin
@Composable
fun BottomNavigation(
    modifier: Modifier = Modifier,
    backgroundColor: Color = MaterialTheme.colors.primarySurface,
    contentColor: Color = contentColorFor(backgroundColor),
    elevation: Dp = BottomNavigationDefaults.Elevation,
    content: RowScope.() -> Unit
): @Composable Unit
```

`bottomBar` 是设置屏幕底部的导航栏，我们可以考虑用 `BottomNavigation` 或者 `BottomAppBar` 来实现

``` kotlin
@Composable
fun ScaffoldDemo(){
    var selectedItem by remember { mutableStateOf(0) }
    val items = listOf("主页", "我喜欢的", "设置")
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text("主页")
                },
                navigationIcon = {
                    IconButton(onClick = {

                    }) {
                        Icon(Icons.Filled.ArrowBack, null)
                    }
                }
            )
        },
        bottomBar = {
            BottomNavigation {
                items.forEachIndexed { index, item ->
                    BottomNavigationItem(
                        icon = { Icon(Icons.Filled.Favorite, contentDescription = null) },
                        label = { Text(item) },
                        selected = selectedItem == index,
                        onClick = { selectedItem = index }
                    )
                }
            }
        }
    ){

    }
}
```


<img src = "../../../assets/layout/scaffold/bottombar/demo.png" width = "30%" height = "30%"><img src = "../../../assets/layout/scaffold/bottombar/demo2.png" width = "30%" height = "30%">


这样一个基本的底部导航栏我们就实现啦，是不是很简单？

我们可以稍微修改一点代码，让导航栏变成三个不同的图标按钮

将 `BottomNavigationItem` 的代码修改成以下

``` kotlin
BottomNavigationItem(
    icon = {
        when(index){
            0 -> Icon(Icons.Filled.Home, contentDescription = null)
            1 -> Icon(Icons.Filled.Favorite, contentDescription = null)
            else -> Icon(Icons.Filled.Settings, contentDescription = null)
        }
    },
    label = { Text(item) },
    selected = selectedItem == index,
    onClick = { selectedItem = index }
)
```

<img src = "../../../assets/layout/scaffold/bottombar/demo3.png" width = "30%" height = "30%">


## 自定义底部导航栏

这是一个自定义底部导航栏的演示

![](../../assets/layout/scaffold/bottombar/demo.gif)

实现的代码可以通过以下的方式来查看

1. [Mkdocs](../../code/layout/scaffold/bottomNavigation/bottomNavigation.md)
2. [Github](https://github.com/compose-museum/compose-tutorial/blob/main/docs/code/layout/scaffold/bottomNavigation/bottomNavigation.kt)

## 更多
[BottomNavigation 详情](https://developer.android.com/reference/kotlin/androidx/compose/material/package-summary#BottomNavigation(androidx.compose.ui.Modifier,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.unit.Dp,kotlin.Function1))