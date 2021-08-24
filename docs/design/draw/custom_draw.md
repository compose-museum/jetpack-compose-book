## 概述

Jetpack Compose 作为一款 UI 框架，自定义绘制部分是必不可少的。通过官方所提供的基础 API， 将允许开发者实现各种场景下的绘制定制需求。如果你对 Android 原生 Canvas 已经了如指掌且运用自如的话，那么迁移至  Jetpack Compose 基本没有任何成本。即使你不曾了解过 Android 原生 Canvas 也不要担心，阅读这篇文章你同样也可以掌握如何在 Jetpack Compose 进行自定义绘制。

## 从 Canvas Composable 开始

`Canvas Composable` 是官方提供的一个专门用来自定义绘制的独立组件，这个组件不包含任何子元素，类似于传统View系统中的一个独立View（不是ViewGroup，不包含子View）。作为一个”独立View“，我们同样也可以通过 `Layout Modifier` 来定制测量布局过程，有关于测量布局的定制可以拓展阅读 [自定义Layout]() 。

Canvas参数有两个参数, 类型分别是 `Modifier` 与 `DrawScope.() -> Unit`。Modifier 作为该组件的修饰符不难理解， `DrawScope.() -> Unit` 是一个 reciever 为 `DrawScope` 类型的 lambda。那么我们就可以在 lambda 中任意使用 `DrawScope` 为我们所提供的 API 了。

```kotlin
fun Canvas(modifier: Modifier, onDraw: DrawScope.() -> Unit)
```

我们来看看 `DrawScope` 为我们限定了哪些 API。这些 API 字面意思很好理解，在使用时临时查找即可。

| API           | 描述             |
| ------------- | ---------------- |
| drawLine      | 绘制一条线       |
| drawRect      | 绘制一个矩形     |
| drawImage     | 绘制一张图片     |
| drawRoundRect | 绘制一个圆角矩形 |
| drawCircle    | 绘制一个圆       |
| drawOval      | 绘制一个椭圆     |
| drawArc       | 绘制一条弧线     |
| drawPath      | 绘制一条路径     |
| drawPoints    | 绘制一些点       |

### 简单示例

让我们画一个简单的圆环作为示例。

```kotlin
@Preview
@Composable
fun DrawColorRing() {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        var radius = 300.dp
        var ringWidth = 30.dp
        Canvas(modifier = Modifier.size(radius)) {
            this.drawCircle( // 画圆
                brush = Brush.sweepGradient(listOf(Color.Red, Color.Green, Color.Red), Offset(radius.toPx() / 2f, radius.toPx() / 2f)),
                radius = radius.toPx() / 2f,
                style = Stroke(
                    width = ringWidth.toPx()
                )
            )
        }
    }
}
```

<img src="{{config.assets}}/design/draw/custom_draw/demo1.png" width="50%" height="50%"></img>

Jetpack Compose 作为一款跨平台 UI 框架，所使用 Canvas 只是一个更高层次的封装，最终还是落实到具体平台的Canvas实现的。所以在 Android 平台即使我们使用的是 `DrawScope` 为我们所提供的 API ，最终仍然还是会使用到Android原生的Canvas的。如果你曾经在传统View系统中做过自定义绘制，在绘制处可能比较奇怪，感觉 Compose 好像少了一个重要的东西 ——  `Paint` 画笔 ，难不成每次绘制时都会根据 API 如此参数不同重新创建一个新的 `Painter` ?其实我们的 `DrawScope` 会对不同类型的画笔进行缓存的，所以性能是没有问题的。

```kotlin
// CanvasDrawScope
private fun obtainFillPaint(): Paint =
		fillPaint ?: Paint().apply { style = PaintingStyle.Fill }.also {
				fillPaint = it
		}
private fun obtainStrokePaint(): Paint =
    strokePaint ?: Paint().apply { style = PaintingStyle.Stroke }.also {
        strokePaint = it
		}
private fun selectPaint(drawStyle: DrawStyle): Paint =
    when (drawStyle) {
        Fill -> obtainFillPaint()
        is Stroke ->
            obtainStrokePaint()
                .apply {
                    if (strokeWidth != drawStyle.width) strokeWidth = drawStyle.width
                    if (strokeCap != drawStyle.cap) strokeCap = drawStyle.cap
                    if (strokeMiterLimit != drawStyle.miter) strokeMiterLimit = drawStyle.miter
                    if (strokeJoin != drawStyle.join) strokeJoin = drawStyle.join
                    if (pathEffect != drawStyle.pathEffect) pathEffect = drawStyle.pathEffect
                }
    }
```

打开 `Canvas Composable` 的实现可以发现他其实就是个 `Spacer` 套壳，真正发挥绘制作用的其实是这个 `Modifier.drawBehind()` 。drawBehind（画在后面），字面意思很明确。由于此时是修饰在 `Spacer` 上的，这意味着你所的一切都画在了 `Spacer` 后面。由于 `Spacer` 默认背景是透明的，所以我们所画的就完全展示出来了。 既然都聊到了 `drawBehind` ,再不多聊聊他的几位好兄弟多不好。

```kotlin
@Composable
fun Canvas(modifier: Modifier, onDraw: DrawScope.() -> Unit) =
    Spacer(modifier.drawBehind(onDraw))
```

## DrawModifier

对于自定义绘制，官方为我们提供了三个 Modifier API，分别是 `drawWithContent ` 、`drawBehind` 、`drawWithCache`。 接下来由我来介绍这三兄弟是谁，并且该如何用。

### drawWithContent

`drawWithContent` 需要一个Reciever为 `ContentDrawScope` 类型的lambda，而这个`ContentDrawScope` 拓展了 `DrawScope` 的能力，多了个 `drawContent` API。这个 API 是提供给开发者来控制绘制层级的。

```kotlin
fun Modifier.drawWithContent(
    onDraw: ContentDrawScope.() -> Unit
)

interface ContentDrawScope : DrawScope {
    /**
     * Causes child drawing operations to run during the `onPaint` lambda.
     */
    fun drawContent()
}
```

这个概念类似于View系统的onDraw，如果我们想在 `TextView` 绘制文本的基础上绘制我们想要的效果时，我们可以通过控制 `super.onDraw()` 与我们自己增加绘制逻辑的调用先后关系从而确定绘制的层级。`drawContent` 可以理解等价于 `super.onDraw` 的概念。越早进行绘制Z轴越小，后面的绘制会覆盖前面的绘制，从而产生了绘制的层级关系。

```kotlin
class MyTextView(context: Context): AppCompatTextView(context) {
    override fun onDraw(canvas: Canvas?) {
        // 在 TextView 下层绘制的控制逻辑
      	// ...
        super.onDraw(canvas)
        // 在 TextView 上层绘制的控制逻辑
        // ...
    }
}
```

### drawBehind

`drawBehind`，画在后面。具体画在谁后面呢，具体画在他所修饰的UI组件后面。根据前面的介绍，我们就可以猜到，其实不就是先画我们自己定制的绘制控制逻辑后，再画UI组件本身嘛？我们翻阅源码可以看到。

```kotlin
fun Modifier.drawBehind(
    onDraw: DrawScope.() -> Unit
) = this.then(
    DrawBackgroundModifier(
        onDraw = onDraw, // onDraw 为我们定制的绘制控制逻辑
        ...
    )
)

private class DrawBackgroundModifier(
    val onDraw: DrawScope.() -> Unit,
    ...
) : DrawModifier, InspectorValueInfo(inspectorInfo) {
    override fun ContentDrawScope.draw() {
        onDraw() // 先画我们定制的绘制控制逻辑
        drawContent() // 后画UI组件本身
    }
    ...
}
```

### drawWithContent与drawBehind的比较示例

我们来为用户头像增加一个红点消息提醒作为示例（然然给我发消息了..嘿嘿🤤）

```kotlin
@Preview
@Composable
fun DrawBefore() {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Card(
            shape = RoundedCornerShape(8.dp)
            ,modifier = Modifier
            .size(100.dp)
            .drawWithContent {
                drawContent()
                drawCircle(Color(0xffe7614e), 18.dp.toPx() / 2, center = Offset(drawContext.size.width, 0f))
            }
        ) {
            Image(painter = painterResource(id = R.drawable.diana), contentDescription = "Diana")
        }
    }
}

@Preview
@Composable
fun DrawBehind() {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Card(
            shape = RoundedCornerShape(8.dp)
            ,modifier = Modifier
                .size(100.dp)
                .drawBehind {
                    drawCircle(Color(0xffe7614e), 18.dp.toPx() / 2, center = Offset(drawContext.size.width, 0f))
                }
        ) {
            Image(painter = painterResource(id = R.drawable.diana), contentDescription = "Diana")
        }
    }
}
```

<img src="{{config.assets}}/design/draw/custom_draw/demo2.png"> </img>

使用 `drawBehind` 默认将红点提醒添加到头像后面。如果我们使用 `drawWithContent` 即可控制绘制的层级关系了，一般情况下我们都希望将红点提醒绘制最顶层。所以此时应该先 `drawContent`，后 `drawCircle` 。

### drawWithCache

有些时候我们绘制一些比较复杂的UI效果时，不希望当 Recompose 发生时所有绘画所用的所有实例都重新构建一次（类似Path），这可能会产生内存抖动。在 Compose 中我们一般能够想到使用 `remember` 进行缓存，然而我们所绘制的作用域是 `DrawScope` 并不是 `Composable`，所以无法使用 `remember`，那我们该怎么办呢？`drawWithCache` 提供了这个能力。

打开 `drawWithCache` 的声明可以看到，需要传入一个Reciever为 `CacheDrawScope` 类型的lambda，值得注意的是此时返回值必须是一个 `DrawResult`。接下来我们看看 `CacheDrawScope` 为我们限定了哪些 API。

哈哈可以看到，`CacheDrawScope` 中的 `onDrawBehind`、`onDrawWithContent` 提供了 `DrawResult` 类型返回值，这两个 API 完全等价于 `drawBehind` 与`drawWithContent`。怎么用就不必多说了。

```kotlin
fun Modifier.drawWithCache(
    onBuildDrawCache: CacheDrawScope.() -> DrawResult
)

class CacheDrawScope internal constructor() : Density {
  	...
  	fun onDrawBehind(block: DrawScope.() -> Unit): DrawResult
  	fun onDrawWithContent(block: ContentDrawScope.() -> Unit): DrawResult
		...
}
```

### drawWithCache 示例

接下来，我们添加用户头像相框作为实例，并通过改变相框颜色来触发Recompose。当然相框肯定是用 `Path` 实现的，由于是改变相框颜色，我们并不希望 Recompose 时重建 `Path` 实例，所以我们就可以使用 `drawWithCache` 来实现了。

```kotlin
@Preview
@Composable
fun DrawBorder() {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            var borderColor by mutableStateOf(Color.Red)
            Card(
                shape = RoundedCornerShape(0.dp)
                ,modifier = Modifier
                    .size(100.dp)
                    .drawWithCache {
                        Log.d("compose_study", "此处不会发生 Recompose")
                        var path = Path().apply {
                            moveTo(0f, 0f)
                            relativeLineTo(100.dp.toPx(), 0f)
                            relativeLineTo(0f, 100.dp.toPx())
                            relativeLineTo(-100.dp.toPx(), 0f)
                            relativeLineTo(0f, -100.dp.toPx())
                        }
                        onDrawWithContent {
                            Log.d("compose_study", "此处会发生 Recompose")
                            drawContent()
                            drawPath(
                                path = path,
                                color = borderColor,
                                style = Stroke(
                                    width = 10f,
                                )
                            )
                        }
                    }
            ) {
                Image(painter = painterResource(id = R.drawable.diana), contentDescription = "Diana")
            }
            Spacer(modifier = Modifier.height(20.dp))
            Button(onClick = {
                borderColor = Color.Yellow
            }) {
                Text("Change Color")
            }
        }
    }
}
```

![]({{config.assets}}/design/draw/custom_draw/demo3.gif)

## 与原生兼容

前面我们说过 `DrawScope` 中所提供的 API 仅是一个高层次的封装，底层仍然是用的是原生平台的 Canvas 进行绘制。作为一个高层次封装，为了保证平台通用性，必然会导致具体平台 API 提供的一些 API 的丢失。例如，我们在 Android 原生 Canvas 可以绘制文字 `drawText`，但这在 `DrawScope` 是没有被提供的，那我们该怎么做呢。

在 `DrawScope` 中，我们可以访问到 `drawContext` 成员，`drawContext` 存储了以下信息。

**size: ** 绘制尺寸

**canvas：** Compose 封装的高层次 Canvas

**transform：** transform控制器，用以旋转、缩放与移动

我们可以通过 `canvas.nativeCanvas` 获取具体平台 `Canvas` 实例，在 Android 平台就对应`AndroidCanvas`，通过这个 `nativeCanvas` 就可以调用到原生平台 `Canvas` 方法了。所以如果你不喜欢使用 `DrawScope` 提供的平台通用 API或是需求需要，可以直接使用原生平台 `Canvas` ，但这样做的代价就是会丢失平台通用性，对于不同平台需要给予不同的实现，不能作为一个通用模块进行提供，如果你只针对 Android 平台进行开发就不需要考虑这么多了，Android 平台 Canvas 还是很香的。

### 自定义绘制能力的进阶

如果你不满足于简单的UI样式绘制，目前国内已经有许多优秀技术文章可以供你参考与学习了，以下推荐的是 [路很长OoO](https://juejin.cn/user/4019470242152616) 大佬在掘金社区分享的有关Compose 自定义绘制系列技术文章。

[JetPack-Compose - 自定义绘制]( https://juejin.cn/post/6937700592340959269)

[JetPack-Compose - Flutter  动态UI? ](
https://juejin.cn/post/6940671523350904845)

[JetPack-Compose 水墨画效果](
https://juejin.cn/post/6947700226858123271)

[Jetpack—Compose UI终结篇](
https://juejin.cn/post/6943590136424693767)

