
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

`Scaffold` 实现了 **Material Design** 的基本视图界面结构

如以下的侧边应用栏、底部导航栏、导航栏等效果


<img src = "../../../assets/layout/scaffold/demo.png" width = "30%" height = "30%"/><img src = "../../../assets/layout/scaffold/demo2.png" width = "30%" height = "30%"/>

## 参数概述

| 参数 | 功能 |
| -------|------|
| **[bottomBar](bottombar.md)**| 设置屏幕底部的导航栏 |
| **[drawerContent](drawercontent.md)** | 创建一个侧边应用栏 |
| **[floatingActionButton](floatingactionbutton.md)** | 创建可以位于底部的按钮 |
| **[topBar](topbar.md)** | 设置屏幕顶部的应用栏 |