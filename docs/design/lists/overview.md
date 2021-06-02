许多应用程序需要显示项目的集合。本文解释了你如何在 `Jetpack Compose` 中有效地做到这一点。

如果你知道你的用例不需要任何滚动，你可能希望使用一个简单的 `Column` 或 `Row`（取决于方向），并像这样通过迭代列表来显示每个项目的内容。

``` kotlin
@Composable
fun MessageList(messages: List<Message>) {
    Column {
        messages.forEach { message ->
            MessageRow(message)
        }
    }
}
```

我们可以通过使用 `verticalScroll()` 这个 `modifier` 来让 `Column` 变得可滚动。更多信息见[手势](../gesture/overview.md)文档。