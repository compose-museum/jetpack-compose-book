## 固有特性测量是什么

在 [自定义Layout](https://docs.compose.net.cn/layout/custom_layout/) 中我们提到 Compose 布局原理，Compose 中的每个 UI 组件是不允许多次进行测量的，多次测量在运行时会抛异常，禁止多次测量的好处是为了提高性能，但在很多场景中多次测量子 UI 组件是有意义的。在 Jetpack Compose 代码实验室中就提供了这样一种场景，我们希望中间分割线高度与两边文案高的一边保持相等。

<img src = "{{config.assets}}/layout/intrinsic/demo1.png" width = "50%" height = "50%">

为实现这个需求，官方所提供的设计方案是希望父组件可以预先获取到两边的文案组件高度信息，然后计算两边高度的最大值即可确定当前父组件的高度值，此时仅需将分割线高度值铺满整个父组件即可。

为了实现父组件预先获取文案组件高度信息从而确定自身的高度信息，Compose 为开发者们提供了固有特性测量机制，允许开发者在每个子组件正式测量前能获取到每个子组件的宽高等信息。

## 在基础组件中使用固有特性测量

使用固有特性测量的前提是当前作用的 Layout 需要适配固有特性测量，目前许多基础组件已经完成对固有特性测量的适配，可以直接使用。

在上面所提到的例子中父组件所提供的能力使用基础组件中的 Row 组件即可承担，我们仅需为 Row 组件高度设置固有特性测量即可。我们使用 <code>Modifier.height(IntrinsicSize.Min)</code>  即可为高度设置固有特性测量。

```kotlin
@Composable
fun TwoTexts(modifier: Modifier = Modifier, text1: String, text2: String) {
    Row(modifier = modifier.height(IntrinsicSize.Min)) { // I'm here
        Text(
            modifier = Modifier
                .weight(1f)
                .padding(start = 4.dp)
                .wrapContentWidth(Alignment.Start),
            text = text1
        )

        Divider(color = Color.Black, modifier = Modifier.fillMaxHeight().width(1.dp))
        Text(
            modifier = Modifier
                .weight(1f)
                .padding(end = 4.dp)
                .wrapContentWidth(Alignment.End),
            text = text2
        )
    }
}

@Preview
@Composable
fun TwoTextsPreview() {
    LayoutsCodelabTheme {
        Surface {
            TwoTexts(text1 = "Hi", text2 = "there")
        }
    }
}
```

通过使用固有特性测量即可完成上面所述场景的需求，展示效果如图所示。

<img src = "{{config.assets}}/layout/intrinsic/demo2.png" width = "50%" height = "50%">

值得注意的是此时我们的 Modifier 仅使用 <code>Modifier.height(IntrinsicSize.Min)</code>  为高度设置了固有特性测量，并没有进行宽度的设置。此时所表达的意思是，当宽度不限时通过子组件预先测量的宽高信息所能计算的高度最少可以是多少。当然你也可以进行宽度的设置，当宽度受限时通过子组件预先测量的宽高信息所能计算的高度最少可以是多少。

可能你不能理解宽度受限可能影响高度这件事，其实我们常用的 Text 组件当宽度收到不同限制时，其高度就是不一样的。

```kotlin
Column(Modifier.fillMaxSize()) {
    Box(Modifier.width(50.dp).background(Color.Red)) {
        Text(text = "Jetpack Compose is an excellent development tool")
    }
    Box(Modifier.width(100.dp).background(Color.Yellow)) {
        Text(text = "Jetpack Compose is an excellent development tool")
    }
}
```

<img src = "{{config.assets}}/layout/intrinsic/demo3.png" width = "50%" height = "50%">

⚠️ **注意事项：** 你只能对已经适配固有特性测量能力的组件使用 <code>IntrinsicSize.Min</code> 或 <code>IntrinsicSize.Max</code> ，否则程序会运行时抛出异常而崩溃。对于所有自定义 Layout 的开发者来说如果支持使用者使用固有特性测量，则必须要进行固有特性测量的适配工作。

## 为自定义 Layout 适配固有特性测量

从上面的例子可以发现，我们仅使用  <code>Modifier.height(IntrinsicSize.Min)</code>  即可交给 Row 组件根据子组件的信息进行计算从而确定一个固定的高度。然而之前他时如何操作的，对于开发者而言是完全未知的。所以本文将继续深入下去，通过一个自定义 Layout 适配固有特性测量的过程来摸清固有特性测量的整个流程。

### 重写 MeasurePolicy 固有特性测量相关方法

对于适配固有特性测量的 Layout，我们需要对 MeasurePolicy 下的固有特性测量方法进行重写。还记得 MeasurePolicy 是谁嘛？没错他就是我们在自定义 Layout 中传入的最后的 lambda SAM 转换的实例类型。

```kotlin
@Composable inline fun Layout(
    content: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    measurePolicy: MeasurePolicy
) 
```

对于固有特性测量的适配，我们需要根据需求重写以下四个方法。

<img src = "{{config.assets}}/layout/intrinsic/demo4.png" width = "50%" height = "50%">

使用 <code>Modifier.width(IntrinsicSize.Max)</code> ，则会调用 <code>maxIntrinsicWidth</code> 方法

使用 <code>Modifier.width(IntrinsicSize.Min)</code> ，则会调用 <code>minIntrinsicWidth</code> 方法

使用 <code>Modifier.height(IntrinsicSize.Max)</code> ，则会调用 <code>maxIntrinsicHeight</code> 方法

使用 <code>Modifier.height(IntrinsicSize.Min)</code>  ，则会调用 <code>minIntrinsicHeight</code> 方法

⚠️ **注意事项：** 如果哪个 Modifier 使用了, 但其对应方法没有重写仍会崩溃。

在 Layout 声明时，我们就不能使用 SAM 形式了，而是要规规矩矩实现 MeasurePolicy

```kotlin
@Composable
fun IntrinsicRow(modifier: Modifier, content: @Composable () -> Unit){
    Layout(
        content = content,
        modifier = modifier,
        measurePolicy = object: MeasurePolicy {
            override fun MeasureScope.measure(
                measurables: List<Measurable>,
                constraints: Constraints
            ): MeasureResult {
                TODO("Not yet implemented")
            }

            override fun IntrinsicMeasureScope.minIntrinsicHeight(
                measurables: List<IntrinsicMeasurable>,
                width: Int
            ): Int {
                TODO("Not yet implemented")
            }

            override fun IntrinsicMeasureScope.maxIntrinsicHeight(
                measurables: List<IntrinsicMeasurable>,
                width: Int
            ): Int {
                TODO("Not yet implemented")
            }

            override fun IntrinsicMeasureScope.maxIntrinsicWidth(
                measurables: List<IntrinsicMeasurable>,
                height: Int
            ): Int {
                TODO("Not yet implemented")
            }

            override fun IntrinsicMeasureScope.minIntrinsicWidth(
                measurables: List<IntrinsicMeasurable>,
                height: Int
            ): Int {
                TODO("Not yet implemented")
            }
        }
    ) 
}
```

在我们的案例中仅使用了 <code>Modifier.height(IntrinsicSize.Min)</code> ，出于简单考虑仅重写了 <code>minIntrinsicHeight</code> 以作示例。

<code>minIntrinsicHeight</code> 与 <code>maxIntrinsicHeight</code> 有相同的两个参数 <code>measurables</code> 与 <code>width</code>

 <code>measurables</code>：类似于 <code>measure</code> 方法的 measurables，用于获取子组件的宽高信息。

 <code>width</code>：父组件所能提供的最大宽度（无论此时是 <code>minIntrinsicHeight</code> 还是 <code>maxIntrinsicHeight</code> ）

```kotlin
Modifier
    .widthIn(100.dp, 200.dp) //在此场景下minIntrinsicHeight的参数width值为200.dp对应的px
    .height(IntrinsicSize.Max)
```

接下来我们使用 <code>maxIntrinsicHeight</code> 即可获取到每个子组件在给定宽度下能够保证正确展示的最小高度，这个正确展示的高度是由子组件来保证的。再得到所有子组件的高度信息后，我们即可计算最大高度值，此值将会被设置为当前父组件（也就是当前自定义Layout）的固定高度。

```kotlin
override fun IntrinsicMeasureScope.minIntrinsicHeight(
    measurables: List<IntrinsicMeasurable>,
    width: Int
): Int {
    var maxHeight = 0
    measurables.forEach {
        maxHeight = it.minIntrinsicHeight(width).coerceAtLeast(maxHeight)
    }
    return maxHeight
}
```

### 在 Layout measure 中适配

接下来我们将所有使用的 Composable 声明出来。

```kotlin
IntrinsicRow(
    modifier = Modifier
        .fillMaxWidth()
        .height(IntrinsicSize.Min)
) {
    Text(text = "Left", Modifier.wrapContentWidth(Alignment.Start).layoutId("main"))
    Divider(
        color = Color.Black,
        modifier = Modifier
            .width(4.dp)
            .fillMaxHeight()
      			.layoutId("devider")
    )
    Text(text = "Right", Modifier.wrapContentWidth(Alignment.End).layoutId("main"))
}
```

此时，由于声明了 <code>Modifier.fillMaxWidth()</code>，导致我们自定义 Layout 宽度是固定的，又因为我们使用了固有特性测量，此时我们自定义 Layout 的高度也是固定的。具体表现为 constraints 参数中 minWidth 与 maxWidth 相等（宽度固定），minHeight 与 maxHeight 相等（高度固定）。

而我们希望 Devider 测量的宽度不应是固定与父组件相同，而是要根据其自身声明的宽度，也就是 <code>Modifier.width(4.dp)</code> ，所以我们对 Devider 测量使用的 constraints 进行了修改。将其最小值设置为零。

```kotlin
@Composable
fun IntrinsicRow(modifier: Modifier, content: @Composable () -> Unit){
    Layout(
        content = content,
        modifier = modifier,
        measurePolicy = object: MeasurePolicy {
            override fun MeasureScope.measure(
                measurables: List<Measurable>,
                constraints: Constraints
            ): MeasureResult {
                var devideConstraints = constraints.copy(minWidth = 0)
                var mainPlaceables = measurables.filter {
                    it.layoutId == "main"
                }.map {
                    it.measure(constraints)
                }
                var devidePlaceable = measurables.first { it.layoutId == "devider"}.measure(devideConstraints)
                var midPos = constraints.maxWidth / 2
                return layout(constraints.maxWidth, constraints.maxHeight) {
                    mainPlaceables.forEach {
                        it.placeRelative(0, 0)
                    }
                    devidePlaceable.placeRelative(midPos, 0)
                }
            }

            override fun IntrinsicMeasureScope.minIntrinsicHeight(
                measurables: List<IntrinsicMeasurable>,
                width: Int
            ): Int {
                var maxHeight = 0
                measurables.forEach {
                    maxHeight = it.maxIntrinsicHeight(width).coerceAtLeast(maxHeight)
                }
                return maxHeight
            }
        }
    )
}
```

最终效果如下，这样我们就为我们自定义 Layout 适配了固有特性测量能力。

<img src = "{{config.assets}}/layout/intrinsic/demo5.png" width = "50%" height = "50%">

## 对固有特性测量的思考

固有特性测量的本质就是父组件可在正式测量布局前预先获取到每个子组件宽高信息后通过计算来确定自身的固定宽度或高度，从而间接影响到其中包含的部分子组件布局信息。也就是说子组件可以根据自身宽高信息从而确定父组件的宽度或高度，从而影响其他子组件布局。在我们使用的方案中，我们通过文案子组件的高度确定了父组件的固定高度，从而间接确定了分割线的高度。此时子组件要通过固有特性测量这种方式，通过父组件而对其他子组件产生影响，然而在有些场景下我们不希望父组件参与其中，而希望子组件间通过测量的先后顺序直接相互影响，Compose 为我们提供了 SubcomposeLayout 来处理这类子组件存在依赖关系的场景。由于本文篇幅有限，有关于 SubcomposeLayout 内容后续会继续更新，请持续关注。
