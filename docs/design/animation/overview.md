Jetpack Compose 提供了强大的、可扩展的 API，使得在你的应用程序的用户界面上实现各种动画变得容易。本文描述了如何使用这些 API，以及根据你的动画场景使用哪个 API。


## 1. 概述

为了实现流畅和可理解的用户体验，动画在现代移动应用中是必不可少的。许多 Jetpack Compose 动画 API 就像布局和其他 UI 元素一样，可以作为 ***Composable*** 函数，它们由用 Kotlin coroutine suspend 函数构建的低级API 支持。本指南从在许多实际场景中很有用的高级 API 开始，接着解释给你进一步控制和定制的低级 API。

下面这个图表可以帮助你决定使用什么 API 来实现你的动画。

<img src = "../../../assets/design/animation/overview/demo.svg">


| API | 功能|
| ----| ----|
| **[AnimationVisibility](animationvisibility.md)** | **进入/退出的过渡动画** |
| **Modifier.contentSize** | **内容大小的变化过渡动画** |
| **Crossfade** | **暂时还没探索** 
| **rememberInfiniteTransition** | **暂时还没探索** |
| **updateTransition** | **暂时还没探索** |
| **[animate*AsState](animatestate.md)** | **指定类型的数据变化动画** |


## 2. 高级动画 API

`Compose` 为许多应用程序中使用的几种常见动画模式提供了高级动画 `API`。 这些 `API` 是为适应 [Material Design Motion](https://material.io/design/motion/) 的最佳实践而量身定制的。

### AnimatedVisibiliy (实验性)

!!! warning "注意"
    实验性API将来可能会更改，或者可能会完全删除。

``` kotlin

var state by remember{ mutableStateOf(true)}

Column(
    modifier = Modifier
        .fillMaxSize(),
    horizontalAlignment = Alignment.CenterHorizontally,
    verticalArrangement = Arrangement.Center
){
    AnimatedVisibility(visible = state) {
        Text(
            text = "这是一个普通的正文",
            fontWeight = FontWeight.W900,
            style = MaterialTheme.typography.h5
        )
    }
    Spacer(Modifier.padding(vertical = 50.dp))
    Button(onClick = {state = !state}) {
        Text(if(state) "隐藏" else "显示")
    }
}

```

![](../../../assets/design/animation/animatedVisibility/demo.gif)

默认情况下，内容通过淡入和扩展出现，通过淡出和缩减消失。可以通过指定 `EnterTransition` 和 `ExitTransition` 来定制过渡

``` kotlin
var visible by remember { mutableStateOf(true) }
AnimatedVisibility(
    visible = visible,
    enter = slideInVertically(
        initialOffsetY = { -40 }
    ) + expandVertically(
        expandFrom = Alignment.Top
    ) + fadeIn(initialAlpha = 0.3f),
    exit = slideOutVertically() + shrinkVertically() + fadeOut()
) {
    Text("Hello", Modifier.fillMaxWidth().height(200.dp))
}
```

如上例所示，您可以将多个 `EnterTransition` 或 `ExitTransition` 对象与一个 `+` 运算符组合在一起，并且每个对象都接受可选参数以自定义其行为。

* `EnterTransition`
    * [`fadeIn`]()
    * [`slideIn`]()
    * [`expandIn`]()
    * [`expandHorizontally`]()
    * [`expandVertically`]()
    * [`slideInHorizontally`]()
    * [`slideInVertically`]()

* `ExitTransition`
    * [`fadeOut`]()
    * [`slideOut`]()
    * [`expandOut`]()
    * [`expandHorizontally`]()
    * [`expandVertically`]()
    * [`slideOutHorizontally`]()
    * [`slideOutVertically`]()