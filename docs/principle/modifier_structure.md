想必许多人在使用 Jetpack Compose 开发时都会使用 Modifier 来修饰 UI 组件，有一定 Compose 开发经验的小伙伴在开发中都发现 UI 组件最终所呈现效果会与 Modifier 间调用顺序息息相关，并且 Modifier 方法也可以重复调用。这是由于 Modifier 会根据调用顺序的不同而生成不同的Modifier链，Jetpack Compose 会根据 Modifier 链上顺序从头到位执行一遍，从而导致Modifier 间调用顺序不同时，UI 组件最终所呈现效果也会不同。那么 Modifier 链在底层如何表现的呢？本文将带着大家来一起扒一扒 Modifier 实现原理，结合图片来解释 Modifier 链数据结构。

<div align = "center">
  <img src = "{{config.assets}}/principle/modifier_structure/demo1.png" width = "50%" height = "50%">
</div>

## Modifier 接口

<div align = "center">
  <img src = "{{config.assets}}/principle/modifier_structure/demo2.png" width = "50%" height = "50%">
</div>

从源码中，我们可以发现 Modifier 实际上是个接口。

```kotlin
interface Modifier { 
		fun <R> foldIn(initial: R, operation: (R, Element) -> R): R
  	fun <R> foldOut(initial: R, operation: (Element, R) -> R): R
  	fun any(predicate: (Element) -> Boolean): Boolean
  	fun all(predicate: (Element) -> Boolean): Boolean
  	infix fun then(other: Modifier): Modifier = ...
  	interface Element : Modifier {
      	...
    }
  	companion object : Modifier {
      	... 
    }
}
```

既然是接口肯定有其对应的实现类。Modifier 接口有三个直接实现：伴生对象 Modifier、内部子接口Modifier.Element、CombinedModifier。

**伴生对象 Modifier：**最常用的 Modifier， 当我们在代码中使用 Modifier.xxx()，实际使用的就是这个伴生对象。

**内部子接口 Modifier.Element：**当我们使用Modifier.xxx()时，其内部实际会创建一个 Modifier 实例。我们以 size 为例。当我们使用 `Modifier.size(100.dp)` 时，实际上内部会创建一个 `SizeModifier` 实例

```kotlin
fun Modifier.size(size: Dp) = this.then(
    SizeModifier(
        ...
    )
)
```

从源码中，我们可以发现 SizeModifier 实现了LayoutModifier 接口，而 LayoutModifier 接口又是 Modifier.Element 的子接口。

<div align = "center">
  <img src = "{{config.assets}}/principle/modifier_structure/demo3.png" width = "50%" height = "50%">
</div>

可以明确的说，当我们通过 Modifier.xxx() 所创建的各类 Modifier 追踪溯源实际上最终都是 Modifier.Element 的子类。当我们使用 `Modifier.size()` 实际上使用的是 Modifier 接口的直接子接口 `LayoutModifier`，像这类直接子接口或子类还有哪些呢，在这里我整理了一下。如图所示，这些接口基本涵盖了 Modifier 所能提供的所有能力。

<div align = "center">
  <img src = "{{config.assets}}/principle/modifier_structure/demo4.png" width = "50%" height = "50%">
</div>

**CombinedModifier：** Compose内部维护的数据结构，用于连接 Modifier 链中的每个 Modifier 结点，后续会讲到。

## Modifier 链的构建过程

接下来，我们通过实例来分析 Modifier 链是如何一步步创建的。

### then()

一般我们会在代码中通过伴生对象 Modifier 作为初始值来创建 Modifier 链。前文提到过，当我们使用 `Modifier.size()` 时会创建一个 SizeModifier 实例。我们打开 `size()` 的实现会发现 SizeModifier实例 会当作参数传入了 `then() `方法中。这个 `then()` 方法就是 Modifier 间相互连接的关键方法。

```kotlin
Modifier
    .size(100.dp)

fun Modifier.size(size: Dp) = this.then( // 关键方法
    SizeModifier(
        ...
    )
)
```

此时 `this` 指针仍指向的是我们的伴生对象 Modifier，所以我们看看伴生对象 Modifier 是如何实现 `then()` 方法的。 可以看到伴生对象 Modifier 的 `then()`方法实现的十分干脆，直接返回待链接的 SizeModifier。

```kotlin
companion object : Modifier {
  	...
    override infix fun then(other: Modifier): Modifier = other
}
```

此时Modifier链的数据结构如下

<div align = "center">
  <img src = "{{config.assets}}/principle/modifier_structure/demo5.png" width = "50%" height = "50%">
</div>

接下来，我们继续调用 `Modifier.background(Color.Red)`。由于是链式调用，此时当前 Modifier 是 SizeModifier，也就是说我们调用 background 时，其内部使用的 `this` 指针指向的是 SizeModifier 实例。

从源码我们可以看出，Background 实际上 `DrawModifier` 的实现类，同时也是 `Modifier.Element` 接口的实现类

```kotlin
Modifier
    .size(100.dp)
		.background(Color.Red)

fun Modifier.background(
    color: Color,
    shape: Shape = RectangleShape
) = this.then( // 当前 this 指向 SizeModifier 实例
    Background(
        ...
    )
)
```

我们向上查找 SizeModifier 的 `then` 方法实现，最终在 `Modifier` 接口中找到了。可以看出此时，我们原有 SizeModifier 与 待连接的 Background 被通过一个 CombinedModifier 进行了连接。

```kotlin
interface Modifier {
    infix fun then(other: Modifier): Modifier =
        if (other === Modifier) this else CombinedModifier(this, other)
}

class CombinedModifier(
    private val outer: Modifier,
    private val inner: Modifier
) : Modifier
```

此时 Modifier 链的数据结构如下

<div align = "center">
  <img src = "{{config.assets}}/principle/modifier_structure/demo6.png" width = "50%" height = "50%">
</div>

我们通过图片可以直观查看 CombinedModifier 通过 outer 与 inner 连接了两个 Modifier。**然而值得注意的是 outer 与 inner 字段都被使用 private 关键字声明，意味着不希望被外部拿到。** Modifier 链既然以链式结构存储，官方又使用了 private 关键字声明，难道不允许我们遍历 Modifier 链嘛。其实官方早就替我们想好了，通过 **foldOut()** 与 **foldIn()**，有关于这部分内容我们马上就会讲到。



我们继续调用 `Modifier.padding(10.dp)`，此时 padding 内部使用的 `this` 指针指向的是 CombinedModifier 实例，我们翻阅 CombinedModifier 的 `then` 方法实现发生没有重写，最终还是回到了 `Modifier` 接口中。

此时待连接的实际上是一个 PaddingModifier 实例。

```kotlin
Modifier
    .size(100.dp)
    .background(Color.Red)
    .padding(10.dp)

fun Modifier.padding(all: Dp) =
    this.then(
        PaddingModifier(
            ...
        )
    )
```

此时Modifier链的数据结构如下

<div align = "center">
  <img src = "{{config.assets}}/principle/modifier_structure/demo7.png" width = "50%" height = "50%">
</div>

### composed()

接下来我们想要添加一些手势监听，我们通常会使用 `Modifier.pointerInput()` 来定制手势处理。从源码中我们可以发现此时并没有使用 `then()` 方法连接 Modifier，而使用的是 `composed()` 方法。从 `composed()` 实现中我们可以看到最终仍然使用的是 `then()` 方法，此时连接的是个 `ComposedModifier` 实例。但我们真正要连接的实际上应该的手势处理相关的Modifier，通过  `composed()` 方法参数我们可以得知，此时实际上 `ComposedModifier`内部持有了一个工厂 lambda 用于未来生产 Modifier 的，而真正要被连接的 Modifier 实际上就是工厂 lambda 的返回值 SuspendingPointerInputFilter。SuspendingPointerInputFilter 实际上是 PointerInputModifier 的实现类。而 ComposedModifier 实际上就是做了一个装箱过程。然而什么时候拆箱呢？这个我们后续会讲到的。

```kotlin
Modifier
    .size(100.dp)
    .background(Color.Red)
    .padding(10.dp)
		.pointerInput(Unit) {
      ...
    }

fun Modifier.pointerInput(
    key1: Any?,
    block: suspend PointerInputScope.() -> Unit
): Modifier = composed( //
    ...
) {
    ...
  	// SuspendingPointerInputFilter 是手势处理的真正Modifier
    remember(density) { SuspendingPointerInputFilter(viewConfiguration, density) }.apply {
        ...
    }
}

fun Modifier.composed(
    inspectorInfo: InspectorInfo.() -> Unit = NoInspectorInfo,
    factory: @Composable Modifier.() -> Modifier
): Modifier = this.then(ComposedModifier(inspectorInfo, factory))
```

此时 Modifier 链的数据结构如下

<div align = "center">
  <img src = "{{config.assets}}/principle/modifier_structure/demo8.png" width = "50%" height = "50%">
</div>

以此类推，调用方法越多Modifier 链就会变得越长。

<div align = "center">
  <img src = "{{config.assets}}/principle/modifier_structure/demo9.png" width = "50%" height = "50%">
</div>

## Modifier 链的遍历

### foldIn() 与 foldOut() 用法

Modifier 链既然是链式结构，说明是可以遍历的。然而前文我们也提到过， outer 与 inner 字段都被使用 private 关键字声明，意味着外部是拿不到的。所以，官方为我们提供了 **foldOut()** 与 **foldIn()** 专门用来遍历 Modifier 链。

```kotlin
Modifier
    .size(100.dp)
    .background(Color.Red)
    .padding(10.dp)
		.pointerInput(Unit) {
      ...
    }
```

**foldIn()：** 正向遍历 Modifier 链，SizeModifier-> Background -> PaddingModifier -> ComposedModifier

**foldOut()：** 反向遍历 Modifier 链, ComposedModifier -> PaddingModifier -> Background ->SizeModifier

当然 **foldOut()** 与 **foldIn()**  是需要传递参数的。这里涉及到两个参数 initial, operation。

```kotlin
fun <R> foldIn(initial: R, operation: (R, Element) -> R): R
fun <R> foldOut(initial: R, operation: (Element, R) -> R): R
```

initial：初始值

operation：每遍历到一个 Modifier 时的回调，这个 lambda 又有两个参数，R类型与 Element类型

为解释这两个参数的意义，我觉得用 for 循环类比比较恰当。

foldIn 方法类似于 `for (int i = initial;  ; operation())` 。 设置 initial 参数类似为 i 设置初始值，而 operation 返回值将作为值的更新。

foldOut 方法与之类似，只不过遍历顺序相反。

也就是说遍历当前 Modifier 时执行的operation 的返回值将作为链中下一个 Modifier 的 operation 的 R 类型参数传入。这么说可能比较晦涩难懂，在这里简单举个例子，比如说我们希望统计 Modifier 链中有 Modifier 的数量。

```kotlin
val modifier = Modifier
    .size(100.dp)
    .background(Color.Red)
    .padding(10.dp)
    .pointerInput(Unit) {
    }
val result = modifier.foldIn<Int>(0) { currentIndex, element ->
    Log.d("compose_study", "index: $currentIndex , element :$element")
    currentIndex + 1
}
```

foldOut 方法的方法也是类似，大家都简单理解为反向遍历 Modifier 链即可。

到这里大家可能心生疑问，我们前面所讲的 Modifier 链中不仅仅只有 Modifier.Element，其中还夹杂着许多 CombinedModifier。为什么我们遍历 Modifier 链时这些 CombinedModifier 没有出现呢？原因在于，CombinedModifier 实际上是 Compose 内部维护的数据结构，如此设计是希望对开发者无感知。这两个方法使用方法就说这么多，如果你对其内部实现原理感兴趣就请继续阅读下去～

### foldIn() 与 foldOut() 实现原理

为探索原理，老规矩我们就需要进入源码一探究竟。我们上来要做的就是找到 **foldIn()** 方法的实现。通过前面的例子我们可以得知，当 Modifier 链的长度大于等于 2 时，返回的 Modifier 实际上是一个 CombinedModifier 实例。那么我们就看看 ConbinedModifier 里面是怎么重写的 **foldIn()** 方法。

```kotlin
class CombinedModifier(
    private val outer: Modifier,
    private val inner: Modifier
) : Modifier {
  	...
    override fun <R> foldIn(initial: R, operation: (R, Modifier.Element) -> R): R =
        inner.foldIn(outer.foldIn(initial, operation), operation) 
}
```

可以看到第一个参数传入的是 outer.foldIn(initial. operation) 的返回值，经过一路递归向上即可到达最顶部的outer Modifier。值得注意的是，我们设置的初始值也跟随outer一路透传上去了。

<div align = "center">
  <img src = "{{config.assets}}/principle/modifier_structure/demo10.png" width = "50%" height = "50%">
</div>

根据 Modifier 链的数据结构，我们很容易发现最顶部的outer Modifier一定是个 Modifier.Element，此时我们就要看看 Modifier.Element 是怎么重写的 **foldIn()** 方法了。通过源码我们看到直接调用了我们传入的lambda，并将 lambda 返回值作为 **foldIn()** 方法的返回值返回。

```kotlin
interface Element : Modifier {
  	...
    override fun <R> foldIn(initial: R, operation: (R, Element) -> R): R =
        operation(initial, this)
}
```

接下来，我们就退到了上一层 CombinedModifier，接下里我们再看看他是怎么做的。紧接着调用了 inner.foldIn()

```kotlin
class CombinedModifier(
    private val outer: Modifier,
    private val inner: Modifier
) : Modifier {
  	...
    override fun <R> foldIn(initial: R, operation: (R, Modifier.Element) -> R): R =
        inner.foldIn(outer.foldIn(initial, operation), operation) 
}
```

我们不妨看看当前场景下的图示。

<div align = "center">
  <img src = "{{config.assets}}/principle/modifier_structure/demo11.png" width = "50%" height = "50%">
</div>

整个流程就非常明显了，直到最后一个 inner Modifier 被遍历后将 lambda 结果返回给开发者。通过流程的解读，我们可知之所以我们的便利过程没有 CombindedModifier，是因为 CombinedModifier 虽重写了 **foldIn()方法**，但并没有调用我们传入的lambda。而只有所有 Modifier.Element 才会调用我们传入的 lambda。

理解了 **foldIn() 方法** 的实现原理，**foldOut() 方法** 的实现原理是完全相同的，只是遍历顺序是完全相反的，这里就不多加赘述了。

### foldIn() 与 foldOut() 的应用

弄懂了实现原理后，我们就来看看该怎么用。通过 Compose 实现源码我们来看看 **foldIn() 方法** 的一次最佳实践。

我们知道 Compose 组件基于 Layout 这个基础组件根据自定义测量布局与绘制而实现的，所以我们来看看我们传入的 Modifier 都在里面发生了什么。可以发现我们的 modifier 传入了一个名为 `materializerOf` 方法

```kotlin
@Composable inline fun Layout(
    content: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    measurePolicy: MeasurePolicy
) {
		...
    ReusableComposeNode<ComposeUiNode, Applier<Any>>(
        factory = ...,
        update = {
						...
        },
        skippableUpdate = materializerOf(modifier), // 重点
        content = ...
    )
}
```

继续跟进，我们会走进 Composer.materialize()。可以发现源码中使用了 **fouldIn() 方法**。 还记得 `composed()` 返回的 ComposedModifier 嘛。根据前文我们可知，我们正常得到的 Modifier 链是包含 ComposedModifier的，而这里想做的是将原始 Modifier 链中的所有 ComposedModifier 摊平，让其 factory 产生的 Modifier 加入到 Modifier 链中。

这里首先是一个正向遍历，传入的初始值为 Modifier。当遍历到 ComposedModifier 时，则使用其内部的 factory 来生产 Modifier，值得注意的是此时生成的 Modifier 可能也是一条 Modifier 链或一个 Modifier 结点。并且其中也可能会包含 ComposedModifier，所以这里就进行了递归处理。最终我们得到的是不包含ComposedModifier 结点的，是完全摊开的 Modifier 链。

```kotlin
fun Composer.materialize(modifier: Modifier): Modifier {
		...
    val result = modifier.foldIn<Modifier>(Modifier) { acc, element ->
        acc.then(
            if (element is ComposedModifier) {
                @kotlin.Suppress("UNCHECKED_CAST")
                val factory = element.factory as Modifier.(Composer, Int) -> Modifier
                val composedMod = factory(Modifier, this, 0) // 生产 Modifier
                materialize(composedMod) // 生成出的 Modifier 可能也包含 ComposedModifier，递归处理
            } else element
        )
    }
		...
    return result
}

```

Modifier 链后续还会使用 **foldOut方法** 进行遍历从而生成 LayoutNodeWrapper 链，了解 Modifier 链的本质将有助于理解 Jetpack Compose 源码中测量布局流程，感兴趣小伙伴可以拓展阅读文章 [《Jetpack Compose 测量流程源码分析》](https://juejin.cn/post/6981805443219718151)

## 总结

这篇文章的目的就是带领大家对 Modifier 链背后的数据结构与执行逻辑进行分析，使大家对于 Modifier 链的本质有一个清晰的认识。弄清楚了 Modifier 链的本质以后，以后使用 Modifier 出现问题时就容易进行排查了。总之对本质了解的越多，使用起来就越顺手！