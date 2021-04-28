
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
        Image( /*...*/ ) // 显示一张图片
        Column {
            Text(artist.name)
            Text(artist.lastSeenOnline)
        }
    }
}
```

<img src = "../../assets/layout/overview/demo3.png" width = "40%" height = "40%">

关于 `Row` 的详情可以参考 [这里](row.md)