# 1. MaterialTheme是怎么做到的 

为深入理解MaterialTheme工作原理，我们需要进入他的源码一探究竟。

```kotlin
@Composable
fun MaterialTheme(
    colors: Colors = MaterialTheme.colors,
    typography: Typography = MaterialTheme.typography,
    shapes: Shapes = MaterialTheme.shapes,
    content: @Composable () -> Unit
) {
    val rememberedColors = remember { colors }.apply { updateColorsFrom(colors) }
    val rippleIndication = rememberRipple()
    val selectionColors = rememberTextSelectionColors(rememberedColors)
    CompositionLocalProvider(
        LocalColors provides rememberedColors,
        LocalContentAlpha provides ContentAlpha.high,
        LocalIndication provides rippleIndication,
        LocalRippleTheme provides MaterialRippleTheme,
        LocalShapes provides shapes,
        LocalTextSelectionColors provides selectionColors,
        LocalTypography provides typography
    ) {
        ProvideTextStyle(value = typography.body1, content = content)
    }
}
```

需要注意的是，此时传入的content参数其实是声明在Theme中的自定义布局系统，其类型是一个带有Composable注解的lambda(下文对于这类带有Composable的lambda简称为composable)。

我们所关注的colors被remember修饰后赋值为rememberedColors。如果MaterialTheme这个composable发生recompose时便会检查colors是否发生了改变从而决定更新。

接下来使用CompositionLocalProvider方法，通过中缀providers将rememberedColors提供给了LocalColors。让我们回到自定义视图中，看看我们是如何通过MaterialTheme获取到当前主题配色的。

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

可以发现在获取到当前主题配色时使用的是MaterialTheme类单例的colors属性，间接使用了LocalColors。

总结来说，我们在自定义Theme使用的是MaterialTheme函数为LocalColors赋值，而在获取时使用的是MaterialTheme类单例，间接从LocalColors中获取到值。所以LocalColors到底是何方神圣呢？

```kotlin
internal val LocalColors = staticCompositionLocalOf { lightColors() }
```

通过声明可以发现他实际上是一个CompositionLocal，其初始值是lightColors()返回的colors配置。

MaterialTheme方法中通过CompositionLocalProvider方法为我们的自定义视图composable提供了一些CompositionLocal，包含了所有的主题配置信息。

# 2. CompositionLocal介绍

很多时候我们需要在composable树中共享一些数据（例如主题配置），一种有效方式就是通过显式参数传递的方式进行实现，当参数越来越多时，composable参数列表会变得越来越臃肿，难以进行维护。当composable需要彼此间传递数据，并且实现各自的私有性时，如果仍采用显式参数传递的方式则可能会产生意外之外的麻烦与崩溃。

为解决上述痛点问题， Jetpack Compose 提供了CompostionLocal 用来完成composable树中共享数据方式。CompositionLocals 是具有层级的，可以被限定在以某个composable作为根结点的子树中，其默认会向下传递的，当然当前子树中的某个composable可以对该CompositionLocals进行覆盖，从而使得新值会在这个composable中继续向下传递。

Jetpack Compose为我们提供了compositionLocalOf方法用于创建一个CompostionLocal实例。

```kotlin
import androidx.compose.runtime.compositionLocalOf

var LocalString = compositionLocalOf { "Jetpack Compose" }
```

在composable树的某个地方，我们可以使用CompositionLocalProvider方法为CompositionLocal提供一个值。通常情况下位于composable树的根部，但也可以位于任何位置，还可以在多个位置使用，以覆盖为子树提供的值。我们的示例选择在Column所包含的composable中使用CompositionLocalProvider。

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

实际效果可以看到，虽然所有composable均依赖的是同一个CompositionLocalProvider，而其获得到的实际的值却是不一样的。

![demo1](../assets/theme/understanding_material_theme/demo1.png)

