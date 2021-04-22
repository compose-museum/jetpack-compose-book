
`Scaffold` 实现了 **Material Design** 的基本视图界面结构

``` kotlin
@Composable fun Scaffold(
    modifier: Modifier = Modifier, 
    scaffoldState: ScaffoldState = rememberScaffoldState(), 
    topBar: () -> Unit = {}, 
    bottomBar: () -> Unit = {}, 
    snackbarHost: (SnackbarHostState) -> Unit = { SnackbarHost(it) }, 
    floatingActionButton: () -> Unit = {}, 
    floatingActionButtonPosition: FabPosition = FabPosition.End, 
    isFloatingActionButtonDocked: Boolean = false, 
    drawerContent: ColumnScope.() -> Unit = null, 
    drawerGesturesEnabled: Boolean = true, 
    drawerShape: Shape = MaterialTheme.shapes.large, 
    drawerElevation: Dp = DrawerDefaults.Elevation, 
    drawerBackgroundColor: Color = MaterialTheme.colors.surface, 
    drawerContentColor: Color = contentColorFor(drawerBackgroundColor), 
    drawerScrimColor: Color = DrawerDefaults.scrimColor, 
    backgroundColor: Color = MaterialTheme.colors.background, 
    contentColor: Color = contentColorFor(backgroundColor), 
    content: (PaddingValues) -> Unit
): Unit
```
## 1. `topBar` 参数

`topBar` 是设置屏幕顶部的应用栏，我们可以考虑用自带的 `TopAppBar` 函数来实现

``` kotlin
@Composable
fun TopAppBar(
    title: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    navigationIcon: @Composable (() -> Unit)? = null,
    actions: @Composable RowScope.() -> Unit = {},
    backgroundColor: Color = MaterialTheme.colors.primarySurface,
    contentColor: Color = contentColorFor(backgroundColor),
    elevation: Dp = AppBarDefaults.TopAppBarElevation
)
```

具体用法

``` kotlin
@Composable
fun ScaffoldDemo(){
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
    ){

    }
}
```

![](../assets/layout/scaffold/demo.png)
