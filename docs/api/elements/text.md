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

| 参数 | |
| ----| ----- |
| **text:[String]()** | 要显示的文本 |
| **modifier: [Modifier]() = Modifier** | 应用于该布局节点的 `Modifier` |
| **color: [Color]() = Color.Unspecified** | 应用于文本的颜色。如果是 `Color.Unspecified`，并且 `style` 没有设置颜色，那么就是 `LocalContentColor` |
| **fontSize: [TextUnit]() = TextUnit.Unspecified** | 绘制文本时要使用的字形大小。参见 `TextStyle.fontSize` |
| **fontStyle: [FontStyle?]() = null** | 绘制字母时使用的字体变体（例如，斜体）。参见 `TextStyle.fontStyle` |
| **fontWeight: [FontWeight?]() = null** | 绘制文本时要使用的字体厚度（例如，`FontWeight.Bold`） |
| **fontFamily: [FontFamily?]() = null** | 渲染文本时要使用的 `font.family`。参见 `TextStyle.fontFamily` |
| **letterSpacing: [TextUnit]() = TextUnit.Unspecified** | 每个字母之间要增加的空间。参见 `TextStyle.letterSpacing` |
| **textDecoration: [TextDecoration?]() = null** | 在文本上的装饰（例如，下划线）。参见 `TextStyle.textDecoration` |
| **textAlign: [TextAlign?]() = null** | 段落内各行文字的对齐方式。参见 `TextStyle.textAlign` |
| **lineHeight: [TextUnit]() = TextUnit.Unspecified** | 段落的行高，以 `TextUnit` 为单位，例如 `SP` 或 `EM`。参见 `TxtStyle.lineHeight` |
| **overflow: [TextOverflow]() = TextOverflow.Clip** | 处理视觉溢出的问题 |
| **softWrap: [Boolean]() = true** | 文本是否应在软换行时断开。如果是 `false`，文本中的字形将被定位，就像有无限的水平空间一样。如果 `softWrap` 为 `false`，`overflow` 和 `TextAlign` 可能会产生意外的效果 |
| **maxLines: [Int]() = Int.MAX_VALUE** | 可选的文本跨度的最大行数，如果有必要，可以进行包装。如果文本超过了给定的行数，它将根据 `overflow` 和 `softWrap` 被截断。如果它不是空的，那么它必须大于零 |
| **onTextLayout: [(TextLayoutResult)]() -> Unit = {}** | 当计算一个新的文本布局时执行的回调 |
| **style: [TextStyle]() = LocalTextStyle.current** | 文本的风格配置，如颜色、字体、行高等 |