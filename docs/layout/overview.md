
## Layouts in Compose

**Jetpack Compose** 让设计和构建你的 app UI 变得更加容易

这篇文档解释了 ``Compose`` 提供的一些构建模块，以帮助你布置你的 UI 元素，并告诉你如何在你需要的时候建立更专业的布局

***Composable*** 函数是 ``Compose`` 的基本构建模块，一个 ***Composable*** 的函数是一个 emitting `Unit` (通过声明式的语法去显示出一个界面元素?) 的函数，描述你的用户界面的某些部分。该函数接受一些输入并生成屏幕上显示的内容

一个 ***Composable*** 函数可能会包含多个 **UI** 元素。但是，如果你不告诉它们应该如何被排列，``Compose`` 可能不会按照你所想的方式来排列它们

例如，这段代码生成了两个 `Text` 元素

``` kotlin
@Composable
fun ArtistCard() {
    Text("Alfred Sisley")
    Text("3 minutes ago")
}
```

在你没有排列它们的情况下， `Compose` 会将 `Text` 元素堆叠在一起，变得无法阅读

<img src = "../../assets/layout/overview/demo.png" width = "40%" height = "40%">


`Compose` 提供了一个现成的布局集合，以帮助你安排你的 `UI` 元素，并使你更容易定义你自己的、更专业的布局

## 1. 标准布局组件

使用 `Column` 它会将里面的组件以行的形式呈现

``` kotlin
@Composable
fun ArtistCard() {
    Column {
        Text("Alfred Sisley")
        Text("3 minutes ago")
    }
}
```

<img src = "../../assets/layout/overview/demo2.png" width = "40%" height = "40%">

同样地，你也可以使用 `Row`, 它会将里面的组件以列的形式呈现

`Column` 和 `Row` 都支持配置它们所包含的元素的对齐方式

``` kotlin
@Composable
fun ArtistCard(artist: Artist) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Image( /*...*/ )
        Column {
            Text(artist.name)
            Text(artist.lastSeenOnline)
        }
    }
}
```

<img src = "../../assets/layout/overview/demo3.png" width = "40%" height = "40%">

!!! 注意
    图中的圆形图像的效果可以在 **基本组件/Image** 中实现

关于 `Row` 的详情可以参考 [这里](row.md)

!!! Tips 
    注意：Compose有效地处理嵌套布局，使其成为设计复杂UI的好方法。这是对Android Views的改进，在Android Views中，出于性能原因，您需要避免嵌套布局。

如果想要在 `Row` 中设置子项的位置，可以设置 `horizontalArrangement` 和 `verticalAlignment` 参数，

对于 `Column` 来说，设置 `verticalArrangement` 和 `horizontalAlignment`

``` kotlin
@Composable
fun AlignInRow() {
    Row(
        modifier = Modifier
            .size(150.dp)
            .background(Color.Yellow),
        horizontalArrangement = Arrangement.End, // 设置 Row 中的子项水平布局为最右边
        verticalAlignment = Alignment.CenterVertically // 设置 Row 中的子项竖直布局为中心
    ) {
        Box(Modifier.size(50.dp).background(Color.Red))
        Box(Modifier.size(50.dp).background(Color.Blue))
    }
}
```

<img src = "../../assets/layout/overview/demo4.png" width = "40%" height = "40%">

## 2. Modifier

`Modifier` 允许你装饰或增强一个 ***Composable***， `Modifier` 允许你做以下的事情

* 改变 ***Composable*** 的大小、布局、行为和外观
* 添加信息，如无障碍标签
* 处理用户的输入
* 添加高层次的交互，比如让一个元素可点击、可滚动、可拖动或可缩放
* 修改器是标准的 **Kotlin** 对象。通过调用 `Modifier` 类的一个函数来创建一个 `modifier`。你可以把这些函数串联起来，组成它们：

``` kotlin
@Composable
fun ArtistCard(
    artist: Artist,
    onClick: () -> Unit
) {
    val padding = 16.dp
    Column(
        Modifier
            .clickable(onClick = onClick)
            .padding(padding)
            .fillMaxWidth()
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) { /*...*/ }
        Spacer(Modifier.size(padding))
        Card(elevation = 4.dp) { /*...*/ }
    }
}
```

<img src = "../../assets/layout/overview/demo5.png" width = "50%" height = "50%">

在上面的代码中，你会注意到不同的 `modifier` 函数一起使用

* `clickable` 使一个 ***Composable*** 元素对用户的输入作出反应，并显示一个波纹
* `padding` 在一个元素周围填充了空间
* `fillMaxWidth` 让 ***Composable*** 元素填满其父元素的最大宽度
* `size()` 来指定一个元素的宽度和高度


!!! 注意
    在其他方面，`Modifier` 的作用类似于基于 `view` 布局中的布局参数。然而，由于 `Modifier` 有时是特定范围的，它们提供了类型安全，也帮助你发现和理解什么是可用的，适用于某个布局。对于 XML 布局，有时很难发现某个特定的布局属性是否适用于某个视图。

`Modifier` 函数的顺序是很**重要**的。因为每个函数都会对前一个函数返回的修改器进行修改，所以顺序会影响最终的结果。让我们来看看这个例子：

``` kotlin
@Composable
fun ArtistCard(/*...*/) {
    val padding = 16.dp
    Column(
        Modifier
            .clickable(onClick = onClick)
            .padding(padding)
            .fillMaxWidth()
    ) {
        // rest of the implementation
    }
}
```

<img src = "../../assets/layout/overview/demo6.gif" width = "50%" height = "50%">

在上面的代码中，整个区域都是可点击的，包括周围的填充物，因为 `padding modifier` 被应用在 `clickable` 之后。如果 `modifier` 的顺序颠倒了，那么由 `padding` 增加的空间就不会对用户的输入做出反应。

``` kotlin
@Composable
fun ArtistCard(/*...*/) {
    val padding = 16.dp
    Column(
        Modifier
            .padding(padding)
            .clickable(onClick = onClick)
            .fillMaxWidth()
    ) {
        // rest of the implementation
    }
}
```

<img src = "../../assets/layout/overview/demo7.gif" width = "50%" height = "50%">

!!! 注意

    明确顺序有助于你推理不同的 `Modifier` 将如何相互作用。与基于 `view` 的系统相比，你必须学习盒子模型，即在元素的 "外面" 应用 `margin`，而在 "里面 "应用 `pading`，背景元素会有相应的大小
    `Modifier` 的设计使这种行为变得明确和可预测，并给你更多的控制来实现你想要的确切行为。这也解释了为什么没有 `margin` 修改器而只有 `padding` 修改器

### 内置 modifiers

Jetpack Compose 提供了一个内置 `modifiers` 的列表，以帮助你装饰或增强一个 ***Composable***。下面是一个涵盖最常见的使用情况的列表：

#### 1. Padding 和 size

要在一个 ***Composable*** 的周围进行填充，请添加 `padding`

``` kotlin
@Composable
fun PaddedComposable() {
    Text(
        text = "Hello World", 
        modifier = Modifier
            .background(Color.Green)
            .padding(20.dp)
    )
}
```

<img src = "../../assets/layout/overview/demo8.png" width = "50%" height = "50%">

默认情况下，Compose 中提供的布局是包裹其子项的。

然鹅，你可以通过使用 `size` 来设置一个尺寸

``` kotlin
@Composable
fun SizedComposable() {
    Box(Modifier.size(100.dp, 100.dp).background(Color.Red))
}
```

!!! 注意
    如果您指定的尺寸不满足来自布局父级的约束，则可能无法使用该尺寸。如果你要求的 ***Composable*** 的尺寸是固定的，不管传入的约束条件如何，请使用 `requiredSize`

``` kotlin
@Composable
fun FixedSizeComposable() {
    Box(
        Modifier
        .size(90.dp, 150.dp)
        .background(Color.Green)
    ) {
        Box(
            Modifier
            .requiredSize(100.dp, 100.dp)
            .background(Color.Red)
        )
    }
}
```

<img src = "../../assets/layout/overview/demo9.png" width = "50%" height = "50%">

在这个例子中，即使父本的宽度被设置为 `90.dp`，内盒的宽度也将是 `100.dp`

因为内盒的 `equiredSize` 修改器优先

``` kotlin
@Composable
fun FillSizeComposable() {
    Box(
        Modifier
            .background(Color.Green)
            .size(50.dp)
            .padding(10.dp)
    ) {
        Box(
            Modifier
                .background(Color.Blue)
                .fillMaxSize()
        )
    }
}
```

<img src = "../../assets/layout/overview/demo10.png" width = "30%" height = "30%">

如果你想让一个子布局的尺寸与父 `Box` 的尺寸相同而不影响 `Box` 的尺寸，请使用 `matchParentSize `

请注意，`matchParentSize` 只在 `Box` 范围内可用，也就是说，它只适用于 `Box` ***composables*** 的直接子代

在下面的例子中，内部的 `Spacer` 从它的父 `Box` 中获取其大小，而父 `Box` 又从它包含的 `Text` 中获取其大小

``` kotlin
@Composable
fun MatchParentSizeComposable() {
    Box {
        Spacer(Modifier.matchParentSize().background(Color.Green))
        Text("Hello World")
    }
}
```

<img src = "../../assets/layout/overview/demo11.png" width = "30%" height = "30%">

如果使用 `fillMaxSize` 而不是` matchParentSize`，那么 `Spacer` 将占用允许给父代的所有可用空间，反过来导致父代扩展并填充所有可用空间

<img src = "../../assets/layout/overview/demo12.png" width = "70%" height = "70%">

如果你想在文本基线上方添加 `padding` 使你达到从布局顶部到基线的特定距离

那么请使用 `paddingFromBaseline`

``` kotlin
@Composable
fun TextWithPaddingFromBaseline() {
    Box(Modifier.background(Color.Yellow)) {
        Text("Hi there!", Modifier.paddingFromBaseline(top = 32.dp))
    }
}
```

<img src = "../../assets/layout/overview/demo13.png" width = "20%" height = "20%">

#### 2. offset

要将一个布局相对于它的原始位置进行定位，可以添加 `offet`，并在 x 和 y 轴上设置偏移量

偏移量可以是正的，也可以是负的。填充和偏移的区别在于，给一个 ***Composable*** 添加偏移并不会改变它的测量