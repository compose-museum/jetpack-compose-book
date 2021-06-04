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

## Lazy composables

如果你需要显示大量的项目（或一个未知长度的列表），使用像 `Column` 这样的布局会导致性能问题，因为所有的项目都会被组合和布局，无论它们是否可见。

`Compose` 提供了一组组件，它们只对组件视口中可见的项目进行组合和布局。这些组件包括 `LazyColumn` 和 `LazyRow`。

!!! info
    如果你使用过 `RecyclerView` 组件，这些组件遵循相同的原则

顾名思义，`LazyColumn` 和 `LazyRow` 的区别在于它们的项目布局和滚动方向。`LazyColumn` 产生一个垂直滚动的列表，而 `LazyRow` 产生一个水平滚动的列表。

`Lazy` 组件与 `Compose` 中的大多数布局不同。`Lazy` 组件不接受 **@Composable** 内容块参数，允许应用程序直接撰写 `Composable`，而是提供一个 `LazyListScope.()` 块。这个 `LazyListScope` 块提供了一个 `DS`L，允许应用程序描述项目内容。然后，`Lazy` 组件负责根据布局和滚动位置的要求，添加每个项目的内容。

!!! Example "关键术语"
    ***DSL*** 是指特定领域的语言。有关 `Compose` 如何为某些 `API` 定义 `DSL` 的更多信息，请参阅 [Kotlin for Compose](https://developer.android.com/jetpack/compose/kotlin#dsl) 文档。


## LazyListScope DSL

`LazyListScope` 的 `DSL` 提供了许多函数来描述布局中的项目。最基本的 `item()` 可以添加一个单项，而 `item(Int)` 添加了多个项目。


``` kotlin
LazyColumn {
    // 添加单个项目
    item {
        Text(text = "First item")
    }

    // 添加五个项目
    items(5) { index ->
        Text(text = "Item: $index")
    }

    // 添加其他单个项目
    item {
        Text(text = "Last item")
    }
}
```