```kotlin
@Composable
fun Scaffold(
    modifier: Modifier = Modifier,
    scaffoldState: ScaffoldState = rememberScaffoldState(),
    topBar: @Composable () -> Unit = {},
    bottomBar: @Composable () -> Unit = {},
    snackbarHost: @Composable (SnackbarHostState) -> Unit = { SnackbarHost(it) },
    floatingActionButton: @Composable () -> Unit = {},
    floatingActionButtonPosition: FabPosition = FabPosition.End,
    isFloatingActionButtonDocked: Boolean = false,
    drawerContent: @Composable (ColumnScope.() -> Unit)? = null,
    drawerGesturesEnabled: Boolean = true,
    drawerShape: Shape = MaterialTheme.shapes.large,
    drawerElevation: Dp = DrawerDefaults.Elevation,
    drawerBackgroundColor: Color = MaterialTheme.colors.surface,
    drawerContentColor: Color = contentColorFor(drawerBackgroundColor),
    drawerScrimColor: Color = DrawerDefaults.scrimColor,
    backgroundColor: Color = MaterialTheme.colors.background,
    contentColor: Color = contentColorFor(backgroundColor),
    content: @Composable (PaddingValues) -> Unit
)
```



## 1. 概述

`Scaffold` 实现了 **Material Design** 的基本视图界面结构

如以下的侧边应用栏、底部导航栏、导航栏等效果


<img src = "{{config.assets}}/layout/scaffold/demo.png" width = "30%" height = "30%"/><img src = "{{config.assets}}/layout/scaffold/demo2.png" width = "30%" height = "30%"/>


`Scaffold` 中的 `topBar`、`bottomBar` 参数仅仅只是帮助我们定位布局的位置，你可以经常看到它们和 `TopAppBar`、`BottomNavigation`、`BottomAppBar` 来一起搭配使用


## 2. 简单的示例

这里有一个使用 `Scaffold` 来创建简单界面的例子

<img src = "{{config.assets}}/layout/scaffold/demo.gif">

你可以在这里查看完整的代码：

* [Gist](https://gist.github.com/Nthily/c6c291422b06543d2afa3eb795a2d2a4)
* [Github]({{config.repo_url}}/blob/main/docs/code/layout/scaffold/scaffold.kt)

## 3. 常用搭配的方法

|方法|功能|
|----|---|
|[TopAppBar](../../elements/topappbar/)|顶部导航栏|
|[BottomNavigation](bottomnavigation.md)|底部导航栏|

除此之外，你当然也能自己写一个 `Composable` 函数来传递给 `Scaffold` 中的 `topBar`、`bottomBar` 参数等