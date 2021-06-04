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

## 1. Lazy composables

如果你需要显示大量的项目（或一个未知长度的列表），使用像 `Column` 这样的布局会导致性能问题，因为所有的项目都会被组合和布局，无论它们是否可见。

`Compose` 提供了一组组件，它们只对组件视口中可见的项目进行组合和布局。这些组件包括 `LazyColumn` 和 `LazyRow`。

!!! info
    如果你使用过 `RecyclerView` 组件，这些组件遵循相同的原则

顾名思义，`LazyColumn` 和 `LazyRow` 的区别在于它们的项目布局和滚动方向。`LazyColumn` 产生一个垂直滚动的列表，而 `LazyRow` 产生一个水平滚动的列表。

`Lazy` 组件与 `Compose` 中的大多数布局不同。`Lazy` 组件不接受 **@Composable** 内容块参数，允许应用程序直接撰写 `Composable`，而是提供一个 `LazyListScope.()` 块。这个 `LazyListScope` 块提供了一个 `DS`L，允许应用程序描述项目内容。然后，`Lazy` 组件负责根据布局和滚动位置的要求，添加每个项目的内容。

!!! Example "关键术语"
    ***DSL*** 是指特定领域的语言。有关 `Compose` 如何为某些 `API` 定义 `DSL` 的更多信息，请参阅 [Kotlin for Compose](https://developer.android.com/jetpack/compose/kotlin#dsl) 文档。


## 2. LazyListScope DSL

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

还有一些扩展功能，允许你添加项目的集合，如 `List`。这些扩展函数使我们能够轻松地移植上面 `Column` 的例子。

``` kotlin
import androidx.compose.foundation.lazy.items

@Composable
fun MessageList(messages: List<Message>) {
    LazyColumn {
        items(messages) { message ->
            MessageRow(message)
        }
    }
}
```

`items()` 的扩展函数还有一个变体，叫做 `itemsIndexed()`，它提供了索引。更多细节请参见 [LazyListScope](https://developer.android.com/reference/kotlin/androidx/compose/foundation/lazy/LazyListScope)参考。 

## 3. 内容填充

在 `Lazy`组件中，我们如果要设置 `Lazy` 组件里面内容的内边距时，我们可以使用 `contentPadding` 参数来进行填充

``` kotlin
@Composable
fun MessageList() {
    Box(Modifier.background(Color.Gray)){
        LazyColumn(
            modifier = Modifier.border(5.dp, color = Color.Blue),
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp)
        ) {
            items(20){
                Text("LazyColumn")
            }
        }
    }
}
```

在这个例子中，我们在水平边缘（左和右）添加 `16.dp` 的 `padding`，然后在内容的顶部和底部添加 `8.dp`。

请注意，这个 `padding` 是应用在 `LazyColumn` 里面的内容上的，而不是应用在 `LazyColumn` 本身。在上面的例子中，第一个项目将在它的顶部添加 `8.dp` 的 `padding`，最后一个项目将在它的底部添加 `8.dp`，所有项目将在左边和右边有 `16.dp` 的 `padding`。

![](../../../assets/design/lists/overview/demo.png)


## 4. 内容间距

要在项目之间添加间距，你可以使用 `Arrangement.spacedBy()`。下面的例子在每个项目之间增加了 `4.dp` 的空间。

``` kotlin
@Composable
fun MessageList() {
    Box(Modifier.background(Color.Gray)){
        LazyColumn(
            modifier = Modifier.border(5.dp, color = Color.Blue),
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(20){
                Text("LazyColumn")
            }
        }
    }
}
```

![](../../../assets/design/lists/overview/demo2.png)

同样地，对于 `LazyRow` 也是如此。

## 5. Item 动画

如果你使用过 `RecyclerView` 组件，你会知道它能自动对 `item` 变化进行动画处理。`Lazy` 布局还没有提供这个功能，这意味着 `item` 的变化会导致一个即时的 `snap`。你可以关注这个 `bug` 来跟踪这个功能的任何变化。

## 6. Sticky headers (实验性)

!!! warning "请注意"
    实验性 `API` 在未来可能会发生变化，也可能被完全删除。

当显示分组数据的列表时，`sticky header` 模式很有帮助。下面你可以看到一个简单的例子，按指定的标题分组。

<img src = "../../../../assets/design/lists/overview/demo.gif" style = "display: block; margin: 0 auto;">

为了用 `LazyColumn` 实现 `Sticky header`，你可以使用实验性的 `stickyHeader()` 函数，提供标题内容。

``` kotlin
@ExperimentalFoundationApi
@Composable
fun ListWithHeader() {
    val sections = listOf("贡献者", "眠眠的粉丝")

    LazyColumn {
        sections.forEachIndexed{ index, section ->
            stickyHeader {
                Text(
                    text = section,
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color(0xFFF2F4FB))
                        .padding(horizontal = 10.dp, vertical = 5.dp),
                    fontWeight = FontWeight.W700,
                    color = Color(0xFF0079D3)
                )
            }
            when(index){
                0 -> item{Contributors()}
                1 -> item{TouchFish()}
            }
        }
    }
}
```

为了节省篇幅，完整实现代码可以以下方式查阅

1. [Mkdocs](../../../code/design/overview/stickyHeader/)
2. [github](https://github.com/compose-museum/compose-tutorial/blob/main/docs/code/design/overview/stickyHeader.kt)

## 7. Grids (实验性）

!!! warning "请注意"
    实验性 `API` 在未来可能会发生变化，也可能被完全删除。

`LazyVerticalGrid` 可以实现类似于网格的效果

<img src = "../../../../assets/design/lists/overview/demo3.png" width = "300">


`cells` 参数负责控制单元格如何形成列。下面的例子显示了网格中的项目，使用 `GridCells.Adaptive` 将每一列设置为至少 `128.dp`宽。

``` kotlin
@ExperimentalFoundationApi
@Composable
fun PhotoGrid(photos: List<Photo>) {
    LazyVerticalGrid(
        cells = GridCells.Adaptive(minSize = 128.dp)
    ) {
        items(photos) { photo ->
            PhotoItem(photo)
        }
    }
}
```

如果你知道要使用的列的确切数量，你可以转而提供一个包含所需列数量的 [GridCells.Fixed](https://developer.android.com/reference/kotlin/androidx/compose/foundation/lazy/GridCells.Fixed) 实例。


## 8. 对滚动位置做出反应

许多应用程序需要对滚动位置和 `item` 布局的变化做出反应和监听，`Lazy` 组件可以使用 `LazyListState` 来支持这种使用情况。

``` kotlin

@Composable
fun MessageList(messages: List<Message>) {

    // 记住我们自己的 LazyListState
    val listState = rememberLazyListState()

    // 把它提供给 LazyColumn
    LazyColumn(state = listState) {
        // ...
    }
}
```

对于简单的使用情况，应用程序通常只需要知道第一个可见的 `item` 的信息。为此，`LazyListState` 提供了 `firstVisibleItemIndex` 和 `firstVisibleItemScrollOffset` 属性。

我们使用一个例子，即根据用户是否滚动过第一个项目来显示和隐藏一个按钮。

<img src = "../../../../assets/design/lists/overview/demo2.gif" style = "display: block; margin: 0 auto;">

``` kotlin
@OptIn(ExperimentalAnimationApi::class) // AnimatedVisibility
@Composable
fun MessageList(messages: List<Message>) {
    Box {
        val listState = rememberLazyListState()
        val scope = rememberCoroutineScope()

        LazyColumn(state = listState) {
            // ...
        }

        // 添加一个用于是否显示按钮的代码
        // 如果第一个可见的项目已经被移动过去，就显示这个按钮。
        val showButton by remember {
            derivedStateOf {         // 尽量减少不必要的合成
                listState.firstVisibleItemIndex > 0
            }
        }

        AnimatedVisibility(visible = showButton) {
            ScrollToTopButton()
        }

        // 伪代码，可用 FAB 来实现
        ScrollToTopButton(
            onClick = {
                scope.launch {
                    listState.animateScrollToItem(0) // 点击返回第一项
                }
            }
        )
    }
}
```