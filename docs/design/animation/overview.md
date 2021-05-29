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

### animateContentSize

`animateContentSize` 可以对尺寸更改进行动画处理

以下是一个简单的例子：

``` kotlin
var text by remember{ mutableStateOf("animateContentSize 动画")}
Box(
    modifier = Modifier.fillMaxSize(),
    contentAlignment = Alignment.Center
){
    Text(text, modifier = Modifier
        .clickable{
            text += text
        }
        .animateContentSize()
    )
}
```

![](../../../assets/design/animation/overview/demo.gif)

再来看看没有加 `animateContentSize()` 的效果吧

![](../../../assets/design/animation/overview/demo2.gif)


### Crossfade

`Crossfade` 在两个布局之间用交叉淡入淡出的动画。通过切换传递给当前参数的值，内容以交叉渐变动画的方式切换

``` kotlin
@Composable
fun <T> Crossfade(
    targetState: T,
    modifier: Modifier = Modifier,
    animationSpec: FiniteAnimationSpec<Float> = tween(),
    content: @Composable (T) -> Unit
)
```

来看看一个简单的使用

``` kotlin

var flag by remember{ mutableStateOf(false)}
Column{
    Crossfade(targetState = flag, animationSpec = tween(1000)) {
        when(it){
            false -> Screen1()
            true -> Screen2()
        }
    }
    Button(onClick = {
            flag = !flag
        }
    ) {
        Text("切换")
    }
}

@Composable
fun Screen1(){
    Box(
        modifier = Modifier
            .background(Color.Red)
            .size(200.dp),
        contentAlignment = Alignment.Center
    ){}
}

@Composable
fun Screen2(){
    Box(
        modifier = Modifier
            .background(Color.Blue)
            .size(200.dp),
        contentAlignment = Alignment.Center
    ){}
}

```

![](../../../assets/design/animation/overview/demo3.gif)


## 3. 低级动画 API

上一节提到的所有高级动画 `API` 都是建立在低级动画 `API` 的基础之上的。

`animate*AsState` 函数是最简单的 `API`，它将一个即时的值变化渲染成一个动画值。它由 `Animatable` 支持，`Animatable` 是一个基于 `coroutine` 的 `API`，用于给单个值制作动画。`updateTransition` 创建了一个过渡对象，可以管理多个动画值，并根据状态变化运行它们。`rememberInfiniteTransition` 类似，但它创建了一个无限的过渡，可以管理多个动画，无限地持续运行。除了 `Animatable` 之外，所有这些`API` 都是可组合的，这意味着可以在合成之外创建这些动画。

所有这些 `API` 都是基于更基本的 `Animation API`。尽管大多数应用程序不会直接与 `Animation` 交互，但 `Animation` 的一些定制功能可以通过更高级别的 `API` 获得。关于 `AnimationVector` 和`AnimationSpec` 的更多信息，请参阅[自定义动画]()。

![](../../../assets/design/animation/overview/animation-low-level.svg)

### animate*AsState

`animate*AsState` 函数是 `Compose` 中最简单的动画 `API`，用于为单个值制作动画。你只需提供结束值（或目标值），`API` 就会从当前值到指定值开始动画。

下面是一个使用这个 `API` 制作 `alpha` 动画的例子。通过简单地将目标值包裹在 `animateFloatAsState` 中，`alpha` 值现在是一个介于所提供的值（本例中是 `1f` 或 `0.5f`）之间的动画值。

``` kotlin
val alpha: Float by animateFloatAsState(if (enabled) 1f else 0.5f)
Box(
    Modifier.fillMaxSize()
        .graphicsLayer(alpha = alpha)
        .background(Color.Red)
)
```

在这里查看关于 [`animate*AsState`](animatestate.md) 的更多介绍


### Animatable

`Animatable` 会在内部储存一个值，当值通过 `animateTo` 被改变时，它可以产生动画。这就是支持 `animate*AsState` 实现的 `API`。它确保了一致的延续性和互斥性，这意味着值的变化总是连续的，任何正在进行的动画都会被取消。

`Animatable` 的许多功能，包括 `animateTo`，都是作为 `suspend` 函数提供的。这意味着它们需要被包裹在一个适当的协程作用域内内。例如，你可以使用 `LaunchedEffect` 这个 **Composable** 来创建一个只针对指定键值的持续时间的作用域。

``` kotlin

var flag by remember{ mutableStateOf(false)}
val color = remember { Animatable(Color.Gray) }

Column{
    Box(Modifier.size(300.dp).background(color.value))
    Button(onClick = {
        flag = !flag
    }) {
        Text("切换")
    }
}
LaunchedEffect(flag) {
    color.animateTo(
        targetValue = if (flag){ Color.Green } else { Color.Red },
        animationSpec = tween(1000)
    )
}

```

![](../../../assets/design/animation/overview/demo4.gif)

在上面的例子中，我们创建并 `remember` 了一个 `Animatable` 的实例，其初始值为 `Color.Gray`。根据 `flag` 的值，颜色会动画地变成 `Color.Green` 或 `Color.Red`。任何对 `flag` 的后续改变都会启动动画到另一种颜色。如果在改变值的时候有一个正在进行的动画，那么这个动画会被取消，新的动画会从当前的快照值和当前的速度开始。

这是支持上一节中提到的 `animate*AsState` `API` 的动画实现。与 `animate*AsState` 相比，直接使用 `Animatable` 在几个方面给了我们更精细的控制。首先，`Animatable` 可以有一个不同于其第一个目标值的初始值。例如，上面的代码例子一开始显示的是一个灰色的盒子，当运行程序的时候立即开始动画地变成为绿色或红色。第二，`Animatable` 对内容值提供了更多的操作，即 `snapTo` 和 `animateDecay`。 `snapTo` 将当前值立即设置为目标值。当动画本身不是唯一的数据源，并且必须与其他状态同步时，例如触摸事件，这是非常有用的。 `animateDecay` 启动一个从给定速度开始放缓的动画。这对于实现甩动行为很有用。更多信息见手势和动画。

`Animatable` 支持 `Float` 和 `Color`，但任何数据类型都可以通过提供一个 `TwoWayConverter` 来使用。参见 [AnimationVector]()获取更多信息。

你可以通过提供一个 `AnimationSpec` 来定制动画规格。参见 [AnimationSpec]()获取更多信息。
