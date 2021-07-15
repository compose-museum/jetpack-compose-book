

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

[Material Design bottom navigation](https://material.io/components/bottom-navigation)

`Bottom navigation bars` 允许在一个应用程序的主要目的地之间移动。

![]({{config.assets}}/layout/bottomnavigation/demo4.png)

`BottomNavigation` 应该包含多个 `BottomNavigationItems` 项，每个导航项代表一个单一的目的地。

这是一个简单和 `Scaffold` 搭配的示例代码：

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
        bottomnavigation = {
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


<img src = "{{config.assets}}/layout/bottomnavigation/demo.png" width = "30%" height = "30%">

这样一个基本的`Bottom navigation bars` 栏我们就实现啦，是不是很简单？

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

<img src = "{{config.assets}}/layout/bottomnavigation/demo3.png" width = "30%" height = "30%">


## 自定义 `BottomNavigation` 栏

这是一个自定义 `BottomNavigation` 栏的演示

![]({{config.assets}}/layout/bottomnavigation/demo.gif)

实现的代码可以通过以下的方式来查看

1. [Mkdocs](../code/layout/bottomNavigation/bottomNavigation.md)
2. [Github](https://github.com/compose-museum/compose-tutorial/blob/main/docs/code/layout/bottomNavigation/bottomNavigation.kt)

## 更多
[BottomNavigation 详情](https://developer.android.com/reference/kotlin/androidx/compose/material/package-summary#BottomNavigation(androidx.compose.ui.Modifier,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.unit.Dp,kotlin.Function1))
