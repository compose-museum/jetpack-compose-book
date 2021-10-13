# [Compose 伸缩ToolBar的实现](https://github.com/SakurajimaMaii/ComposeWidget/blob/master/app/src/main/java/com/example/composewidget/ScrollableAppBar.kt)

## 效果图

<img src="{{config.assets}}/design/gesture/nested_scroll/nestedScroll.gif" width="30%" height="30%" />

* 当列表向上移动时，会先带动 `ToolBar` 向上位移，等 `ToolBar` 向上移动到最大位移量时列表向上滑动
* 当列表向下移动时，会先带动 `ToolBar` 向下位移，等 `ToolBar` 向下移动到最大位移量时列表向下滑动

## 主要思路

### 布局预览

伸缩前布局

<img src="https://img-blog.csdnimg.cn/806dcfd8a28541c89b194be8e078f052.png" width="50%"/>

伸缩后布局

<img src="https://img-blog.csdnimg.cn/6ec7bb082b6b44e6aaf4572008899618.jpg" width="50%"/>

### 实现过程

#### 布局实现

首先我们要定义两个尺寸变量

```kotlin
// 应用栏高度
private val toolBarHeight = 56.dp
// 导航图标大小
private val navigationIconSize = 50.dp
```

我们采用 `Box` 作为根布局，里面主要包含三个部分，背景图片，顶部的 `ToolBar` 以及下面的 `Title` 部分，其实现如下

```kotlin
//整体布局实现
Box(modifier = Modifier
        .height(scrollableAppBarHeight) //scrollableAppBarHeight 为高度参数,为外部获取
        .fillMaxWidth()
) {
    Image(painter = painterResource(id = backgroundImageId), contentDescription = "background", contentScale = ContentScale.FillBounds)

    // 自定义应用栏
    Row(
        modifier = modifier
            .height(toolBarHeight) //设置高度为toolBarHeight
            .fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically //设置垂直方向为居中对齐
    ) {
        // 导航图标
        Box(modifier = Modifier.size(navigationIconSize),contentAlignment = Alignment.Center) {
            navigationIcon()
        }
    }

    // title定义
    Box(
        modifier = Modifier
            .height(toolBarHeight) //和ToolBar同高
            .fillMaxWidth()
            .align(Alignment.BottomStart),
        contentAlignment = Alignment.CenterStart
    ) {
        Text(text = title,
            color = Color.White,
            modifier = Modifier.padding(start = 20.dp).matchParentSize(), // 使用 matchParentSize 修饰符保证不影响父 Box尺寸
            fontSize = 20.sp
        )
    }
}
```

我们主要讲解 `title` 部分

```kotlin
// title 定义
Box(
    modifier = Modifier
        .height(toolBarHeight) //和 ToolBar 同高
        .fillMaxWidth()
        .align(Alignment.BottomStart),
    contentAlignment = Alignment.CenterStart
) {
    Text(text = title,
            color = Color.White,
            modifier = Modifier.padding(start = 20.dp).matchParentSize(), // 使用 matchParentSize 修饰符保证不影响父 Box尺寸
            fontSize = 20.sp
        )
}
```

首先为了保证 `title` 部分在完全收缩后高度和 `toolBar` 部分一致，我们设置 `Box` 布局高度为 `toolBarHeight`

```kotlin
modifier = Modifier
        .height(toolBarHeight) //和 ToolBar 同高
        .fillMaxWidth()
```

然后定义 `Box` 在根布局里面的对齐方式为**Alignment.BottomStart**

```kotlin
modifier = Modifier
        .height(toolBarHeight) //和 ToolBar 同高
        .fillMaxWidth()
        .align(Alignment.BottomStart)
```

之所以这样设置，是因为我们通过观察伸缩前和伸缩后的预览图可以知道如果保证此部分是**底部左边**对齐，那么在根布局向上移动的过程中我们便可以只关心此部分在**水平方向**的位移即可

接着设置文本部分的对齐方式,保证 `title` 是居中靠左对齐的

```kotlin
contentAlignment = Alignment.CenterStart
```

#### 位移实现

首先，我们要明确 `ScrollableAppBar` 最大向上偏移量等于其**定义的高度**和**收缩后的高度**的差值，即:

```kotlin
// 应用栏最大向上偏移量
val maxOffsetHeightPx = with(LocalDensity.current) { scrollableAppBarHeight.roundToPx().toFloat() - toolBarHeight.roundToPx().toFloat() }
```

其次，`title` 部分在**水平方向**的位移距离其实就是导航图标的宽度，即:

```kotlin
// Title 偏移量参考值
val titleOffsetWidthReferenceValue = with(LocalDensity.current) { navigationIconSize.roundToPx().toFloat() }
```

同时需要定义从外部获取到的偏移量

```kotlin
val toolbarOffsetHeightPx: MutableState<Float> //向上偏移量
```

##### 最外层布局位移定义

为根布局添加垂直方向上的位移

```kotlin
@Composable
fun ScrollableAppBar(
    modifier: Modifier = Modifier,
    title: String = stringResource(id = R.string.app_name), //默认为应用名
    navigationIcon: @Composable () -> Unit, //导航图标
    @DrawableRes backgroundImageId: Int, // 背景图片
    scrollableAppBarHeight: Dp, //定义的 ScrollableAppBar 高度
    toolbarOffsetHeightPx: MutableState<Float> //向上偏移量
) {
    Box(modifier = Modifier
        .height(scrollableAppBarHeight)
        .offset {
            IntOffset(
              x = 0,
              y = toolbarOffsetHeightPx.value.roundToInt() //设置偏移量
            )
        }
        .fillMaxWidth()
    ) {
        .... // 背景图等内容
    }
}
```

##### toolBar 垂直方向位置不变的实现

设置和父布局相反的位移量保证 `toolBar` 处于原位置，即：

```kotlin
// 自定义应用栏
Row(
    modifier = modifier
        .offset {
            IntOffset(
                x = 0,
                y = -toolbarOffsetHeightPx.value.roundToInt() //保证应用栏是始终不动的
            )
        }
        .height(toolBarHeight)
        .fillMaxWidth(),
    verticalAlignment = Alignment.CenterVertically
) {
    ... // 导航图标
}
```

##### title 水平位移的实现

为了保证 `title` 均匀向右位移，用根布局此时向上位移量和最大位移量的商再乘以水平方向上的总位移即可：

```kotlin
// title 部分
Box(
    modifier = Modifier
        .height(toolBarHeight) //和 ToolBar 同高
        .fillMaxWidth()
        .align(Alignment.BottomStart)
        .offset {
            IntOffset(
                // 按照根布局向上的位移量成比例的向右位移 Title
                x = -((toolbarOffsetHeightPx.value / maxOffsetHeightPx) * titleOffsetWidthReferenceValue).roundToInt(),
                y = 0
            )
        },
    contentAlignment = Alignment.CenterStart
) {
    ... //title 部分
}
```

## 项目地址

[ScrollableAppBar](https://github.com/SakurajimaMaii/ComposeWidget/blob/master/app/src/main/java/com/example/composewidget/ScrollableAppBar.kt) 如果项目对你有所帮助,欢迎点赞👍,Star⭐,收藏😍,如果有改进意见还可以提交 issue