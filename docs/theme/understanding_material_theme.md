## 1. MaterialTheme 是怎么做到的 

为深入理解 MaterialTheme 工作原理，我们需要进入源码一探究竟。

<img src = "../../../assets/theme/understanding_material_theme/carbon.png" width = "90%" height = "50%">

需要注意的是，此时传入的 content 参数其实是声明在 Theme 中的自定义布局系统，其类型是一个带有 Composable 注解的 lambda (对于这类带有 Composable 的 lambda 简称为 composable )。

我们所关注的 colors 被 remember 修饰后赋值为 rememberedColors。如果 MaterialTheme 这个 composable 发生 recompose 时便会检查 colors 是否发生了改变从而决定更新。

接下来使用 CompositionLocalProvider 方法，通过中缀 providers 将 rememberedColors 提供给了 LocalColors。让我们回到自定义视图中，看看我们是如何通过 MaterialTheme 获取到当前主题配色的。

```kotlin
object MaterialTheme {
    val colors: Colors
        @Composable
        @ReadOnlyComposable
        get() = LocalColors.current
    val typography: Typography
        @Composable
        @ReadOnlyComposable
        get() = LocalTypography.current
    val shapes: Shapes
        @Composable
        @ReadOnlyComposable
        get() = LocalShapes.current
}
```

可以发现在获取到当前主题配色时使用的是 MaterialTheme 类单例的 colors 属性，间接使用了 LocalColors。

总结来说，我们在自定义 Theme 使用的是 MaterialTheme 函数为 LocalColors 赋值，而在获取时使用的是 MaterialTheme 类单例，间接从 LocalColors 中获取到值。所以 LocalColors 到底是何方神圣呢？

```kotlin
internal val LocalColors = staticCompositionLocalOf { lightColors() }
```

通过声明可以发现他实际上是一个 CompositionLocal，其初始值是 lightColors() 返回的 colors 配置。

MaterialTheme 方法中通过 CompositionLocalProvider 方法为我们的自定义视图 composable 提供了一些 CompositionLocal，包含了所有的主题配置信息。

## 2. CompositionLocal介绍

很多时候我们需要在 composable 树中共享一些数据（例如主题配置），一种有效方式就是通过显式参数传递的方式进行实现，当参数越来越多时，composable 参数列表会变得越来越臃肿，难以进行维护。当 composable 需要彼此间传递数据，并且实现各自的私有性时，如果仍采用显式参数传递的方式则可能会产生意料之外的麻烦与崩溃。

为解决上述痛点问题， Jetpack Compose 提供了 CompostionLocal 用来完成 composable 树中共享数据方式。CompositionLocals 是具有层级的，可以被限定在以某个 composable 作为根结点的子树中，其默认会向下传递的，当然当前子树中的某个 composable 可以对该 CompositionLocals 进行覆盖，从而使得新值会在这个 composable 中继续向下传递。

Jetpack Compose 为我们提供了compositionLocalOf 方法用于创建一个 CompostionLocal 实例。

```kotlin
import androidx.compose.runtime.compositionLocalOf

var LocalString = compositionLocalOf { "Jetpack Compose" }
```

在 composable 树的某个地方，我们可以使用 CompositionLocalProvider 方法为 CompositionLocal 提供一个值。通常情况下位于 composable 树的根部，但也可以位于任何位置，还可以在多个位置使用，以覆盖子树能够获取到的值。我们的示例选择在 Column 所包含的 composable 中使用 CompositionLocalProvider。

```kotlin
import androidx.compose.runtime.CompositionLocalProvider

setContent {
    CustomColorTheme(true) {
        Column {
            CompositionLocalProvider(
                LocalString provides "Hello World"
            ) {
                Text(
                    text = LocalString.current,
                    color = Color.Green
                )
                CompositionLocalProvider(
                    LocalString provides "Ruger McCarthy"
                ) {
                    Text(
                        text = LocalString.current,
                        color = Color.Blue
                    )
                }
            }
            Text(
                text = LocalString.current,
                color = Color.Red
            )
        }
    }
}
```

实际效果可以看到，虽然所有 composable 均依赖的是同一个 CompositionLocal，而其获得到的实际的值却是不一样的。

![demo1](../assets/theme/understanding_material_theme/demo1.png)

