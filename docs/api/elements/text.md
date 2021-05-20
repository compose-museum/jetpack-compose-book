## 1. Text

``` kotlin
@Composable
fun Text(
    text: String,
    modifier: Modifier = Modifier,
    color: Color = Color.Unspecified,
    fontSize: TextUnit = TextUnit.Unspecified,
    fontStyle: FontStyle? = null,
    fontWeight: FontWeight? = null,
    fontFamily: FontFamily? = null,
    letterSpacing: TextUnit = TextUnit.Unspecified,
    textDecoration: TextDecoration? = null,
    textAlign: TextAlign? = null,
    lineHeight: TextUnit = TextUnit.Unspecified,
    overflow: TextOverflow = TextOverflow.Clip,
    softWrap: Boolean = true,
    maxLines: Int = Int.MAX_VALUE,
    onTextLayout: (TextLayoutResult) -> Unit = {},
    style: TextStyle = LocalTextStyle.current
): @Composable Unit
```

显示文本并提供语义/可读性信息的高级元素。

默认样式使用 `MaterialTheme`/组件提供的 `LocalTextStyle`。如果你要设置你自己的样式，你可能要考虑首先检索 `LocalTextStyle`，并使用 `TextStyle.copy` 来保留任何主题定义的属性，只修改你要覆盖的特定属性。

为了便于使用，`TextStyle` 的常用参数也在这里出现，优先顺序如下：

1. 如果一个参数被明确地设置在这里（即它不是 `null` 或 `TextUnit.Unspecified`），那么这个参数将总是被使用。

2. 如果一个参数没有被设置，（`null`或 `TextUnit.Unspecified`），那么 `style` 中的相应值将被替代使用。

此外，对于颜色，如果没有设置颜色，并且 `style` 没有颜色，那么将使用 `LocalContentColor` 和 `LocalContentAlpha` 的 `alpha`--这允许这个文本或包含这个文本的元素适应不同的背景颜色，仍然保持对比度和和可读性。


| 参数 | |
| ----| ----- |
| **text:[AnnotatedString](https://developer.android.com/reference/kotlin/androidx/compose/ui/text/AnnotatedString)** | 要显示的文本 |
| **modifier: [Modifier](https://developer.android.com/reference/kotlin/androidx/compose/ui/Modifier) = Modifier** | 应用于该布局节点的 `Modifier` |
| **color: [Color](https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/Color) = Color.Unspecified** | 应用于文本的颜色。如果是 `Color.Unspecified`，并且 `style` 没有设置颜色，那么就是 `LocalContentColor` |
| **fontSize: [TextUnit](https://developer.android.com/reference/kotlin/androidx/compose/ui/unit/TextUnit) = TextUnit.Unspecified** | 绘制文本时要使用的字形大小。参见 `TextStyle.fontSize` |
| **fontStyle: [FontStyle?](https://developer.android.com/reference/kotlin/androidx/compose/ui/text/font/FontStyle) = null** | 绘制字母时使用的字体变体（例如，斜体）。参见 `TextStyle.fontStyle` |
| **fontWeight: [FontWeight?](https://developer.android.com/reference/kotlin/androidx/compose/ui/text/font/FontWeight) = null** | 绘制文本时要使用的字体厚度（例如，`FontWeight.Bold`） |
| **fontFamily: [FontFamily?](https://developer.android.com/reference/kotlin/androidx/compose/ui/text/font/FontFamily) = null** | 渲染文本时要使用的 `font.family`。参见 `TextStyle.fontFamily`|
| **letterSpacing: [TextUnit](https://developer.android.com/reference/kotlin/androidx/compose/ui/unit/TextUnit) = TextUnit.Unspecified** | 每个字母之间要增加的空间。参见 `TextStyle.letterSpacing` |
| **textDecoration: [TextDecoration?](https://developer.android.com/reference/kotlin/androidx/compose/ui/text/style/TextDecoration) = null** | 在文本上的装饰（例如，下划线）。参见 `TextStyle.textDecoration` |
| **textAlign: [TextAlign?](https://developer.android.com/reference/kotlin/androidx/compose/ui/text/style/TextAlign) = null** | 段落内各行文字的对齐方式。参见 `TextStyle.textAlign` |
| **lineHeight: [TextUnit](https://developer.android.com/reference/kotlin/androidx/compose/ui/unit/TextUnit) = TextUnit.Unspecified** | 段落的行高，以 `TextUnit` 为单位，例如 `SP` 或 `EM`。参见 `TxtStyle.lineHeight` |
| **overflow: [TextOverflow](https://developer.android.com/reference/kotlin/androidx/compose/ui/text/style/TextOverflow) = TextOverflow.Clip** | 处理视觉溢出的问题 |
| **softWrap: [Boolean](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) = true** | 文本是否应在软换行时断开。如果是 `false`，文本中的字形将被定位，就像有无限的水平空间一样。如果 `softWrap` 为 `false`，`overflow` 和 `TextAlign` 可能会产生意外的效果 |
| **maxLines: [Int](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) = Int.MAX_VALUE** | 可选的文本跨度的最大行数，如果有必要，可以进行包装。如果文本超过了给定的行数，它将根据 `overflow` 和 `softWrap` 被截断。如果它不是空的，那么它必须大于零  |
| **onTextLayout: [(TextLayoutResult)](https://developer.android.com/reference/kotlin/androidx/compose/ui/text/TextLayoutResult) -> [Unit](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) = {}** | 当计算一个新的文本布局时执行的回调 |
| **style: [TextStyle](https://developer.android.com/reference/kotlin/androidx/compose/ui/text/TextStyle) = LocalTextStyle.current** | 文本的风格配置，如颜色、字体、行高等 |


## 2. Text
``` kotlin
@Composable
fun Text(
    text: AnnotatedString,
    modifier: Modifier = Modifier,
    color: Color = Color.Unspecified,
    fontSize: TextUnit = TextUnit.Unspecified,
    fontStyle: FontStyle? = null,
    fontWeight: FontWeight? = null,
    fontFamily: FontFamily? = null,
    letterSpacing: TextUnit = TextUnit.Unspecified,
    textDecoration: TextDecoration? = null,
    textAlign: TextAlign? = null,
    lineHeight: TextUnit = TextUnit.Unspecified,
    overflow: TextOverflow = TextOverflow.Clip,
    softWrap: Boolean = true,
    maxLines: Int = Int.MAX_VALUE,
    inlineContent: Map<String, InlineTextContent> = mapOf(),
    onTextLayout: (TextLayoutResult) -> Unit = {},
    style: TextStyle = LocalTextStyle.current
): @Composable Unit
```

| 参数 | |
| ----| ----- |
| **text:[AnnotatedString](https://developer.android.com/reference/kotlin/androidx/compose/ui/text/AnnotatedString)** | 要显示的文本 |
| **modifier: [Modifier](https://developer.android.com/reference/kotlin/androidx/compose/ui/Modifier) = Modifier** | 应用于该布局节点的 `Modifier` |
| **color: [Color](https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/Color) = Color.Unspecified** | 应用于文本的颜色。如果是 `Color.Unspecified`，并且 `style` 没有设置颜色，那么就是 `LocalContentColor` |
| **fontSize: [TextUnit](https://developer.android.com/reference/kotlin/androidx/compose/ui/unit/TextUnit) = TextUnit.Unspecified** | 绘制文本时要使用的字形大小。参见 `TextStyle.fontSize` |
| **fontStyle: [FontStyle?](https://developer.android.com/reference/kotlin/androidx/compose/ui/text/font/FontStyle) = null** | 绘制字母时使用的字体变体（例如，斜体）。参见 `TextStyle.fontStyle` |
| **fontWeight: [FontWeight?](https://developer.android.com/reference/kotlin/androidx/compose/ui/text/font/FontWeight) = null** | 绘制文本时要使用的字体厚度（例如，`FontWeight.Bold`） |
| **fontFamily: [FontFamily?](https://developer.android.com/reference/kotlin/androidx/compose/ui/text/font/FontFamily) = null** | 渲染文本时要使用的 `font.family`。参见 `TextStyle.fontFamily`|
| **letterSpacing: [TextUnit](https://developer.android.com/reference/kotlin/androidx/compose/ui/unit/TextUnit) = TextUnit.Unspecified** | 每个字母之间要增加的空间。参见 `TextStyle.letterSpacing` |
| **textDecoration: [TextDecoration?](https://developer.android.com/reference/kotlin/androidx/compose/ui/text/style/TextDecoration) = null** | 在文本上的装饰（例如，下划线）。参见 `TextStyle.textDecoration` |
| **textAlign: [TextAlign?](https://developer.android.com/reference/kotlin/androidx/compose/ui/text/style/TextAlign) = null** | 段落内各行文字的对齐方式。参见 `TextStyle.textAlign` |
| **lineHeight: [TextUnit](https://developer.android.com/reference/kotlin/androidx/compose/ui/unit/TextUnit) = TextUnit.Unspecified** | 段落的行高，以 `TextUnit` 为单位，例如 `SP` 或 `EM`。参见 `TxtStyle.lineHeight` |
| **overflow: [TextOverflow](https://developer.android.com/reference/kotlin/androidx/compose/ui/text/style/TextOverflow) = TextOverflow.Clip** | 处理视觉溢出的问题 |
| **softWrap: [Boolean](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) = true** | 文本是否应在软换行时断开。如果是 `false`，文本中的字形将被定位，就像有无限的水平空间一样。如果 `softWrap` 为 `false`，`overflow` 和 `TextAlign` 可能会产生意外的效果 |
| **maxLines: [Int](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) = Int.MAX_VALUE** | 可选的文本跨度的最大行数，如果有必要，可以进行包装。如果文本超过了给定的行数，它将根据 `overflow` 和 `softWrap` 被截断。如果它不是空的，那么它必须大于零  |
| **inlineContent: [Map](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)<[String](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html), [InlineTextContent](https://developer.android.com/reference/kotlin/androidx/compose/foundation/text/InlineTextContent)> = mapOf()** |一个 Map 存储 Composables，取代了文本的某些范围。它用于在文本布局中插入 Composables。查看 [InlineTextContent](https://developer.android.com/reference/kotlin/androidx/compose/foundation/text/InlineTextContent) 以了解更多信息|
| **onTextLayout: [(TextLayoutResult)](https://developer.android.com/reference/kotlin/androidx/compose/ui/text/TextLayoutResult) -> [Unit](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) = {}** | 当计算一个新的文本布局时执行的回调 |
| **style: [TextStyle](https://developer.android.com/reference/kotlin/androidx/compose/ui/text/TextStyle) = LocalTextStyle.current** | 文本的风格配置，如颜色、字体、行高等 |