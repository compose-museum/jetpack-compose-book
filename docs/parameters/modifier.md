# Modifier
Modifier, 顾名思义就是一个修饰器，用于修改组件的样式。每个Compose组件都会提供一个Modifier参数用于修改样式。

## 基础用法
Modifier本身只实现了几个方法，并且自身的方法并不用于修饰，而是用于连接多个Modifier(下面会讲解)。   
而我们用到的修饰方法都是通过 **Kotlin 扩展函数**实现的。
例如`size()`这个修饰函数，其实来自`androidx.compose.foundation.layout`包下的`Size.kt`。同样，你也可以使用扩展函数来向Modifier添加你自己的修饰方法。

以下为常用的修饰方法:  
``` Kotlin
  // 修改控件大小，第一个参数为宽度，第二个参数为高度
  size(width: Dp, height: Dp)
  
  // 单独修改控件宽度
  width(width: Dp)
  
  // 单独修改控件高度
  height(height: Dp)
  
  // 限制控件的宽度在一定范围内
  widthIn(min: Dp, max: Dp)
  
  // 限制控件高度在一定范围内
  heightIn(min: Dp,max: Dp)
  
  // 使得控件的宽度适应父布局大小
  fillMaxWidth()
  
  // 使得控件的高度适应父布局大小
  fillMaxHeight()
  
  // 使得控件根据内部的组件自适应内容大小
  wrapContentSize()
```
修饰方法还有很多，这里就不一一列举了。
可以使用 AndroidStudio自动补全或者查看官方文档来查找更多修饰函数。

## 修饰优先级
修饰方法直接是存在先后顺序的，不同的调用顺序会导致不一样的效果。我们先来看一个例子：
``` kotlin
@Composable
fun UI(){
    Card(
        modifier = Modifier
            .clickable { }
            .padding(16.dp)
    ) {
        Box(modifier = Modifier.padding(20.dp)){
            Text(text = "我已经怒不可遏了")
        }
    }
}
```
在这个例子中，`clickable{}`在`padding()` **之前**调用，因此Card外间距的部分也是可以被点击到的。   

反转一下，如果`clickable{}`在`padding()` **之后**被调用，那么Card的外间距部分就不能点击了，只能点击Card本身。

**为什么呢? (挖源码时间~)**   
直接查看这些 修饰方法 的源代码，可以看见他们是这样实现的:
``` kotlin
fun Modifier.padding(all: Dp) =
    this.then(
        PaddingModifier(
            start = all,
            top = all,
            end = all,
            bottom = all,
            rtlAware = true,
            inspectorInfo = debugInspectorInfo {
                name = "padding"
                value = all
            }
        )
    )
```
显而易见，这是一个Modifier的扩展函数。  
它调用了 `Modifier`的`then()`函数，而这个`then()`需要接收一个Modifier对象，而这个PaddingModifier的最终父类，就是Modifier。
那`then()`函数干了什么呢? 继续看源码:   
``` kotlin
 infix fun then(other: Modifier): Modifier =
        if (other === Modifier) this else CombinedModifier(this, other)
```
很显然，它创建了一个`CombinedModifier`对象，而`CombinedModifier`也是继承自`Modifier`类的:   
```kotlin
class CombinedModifier(
    private val outer: Modifier,
    private val inner: Modifier
) : Modifier {
    override fun <R> foldIn(initial: R, operation: (R, Modifier.Element) -> R): R =
        inner.foldIn(outer.foldIn(initial, operation), operation)

    override fun <R> foldOut(initial: R, operation: (Modifier.Element, R) -> R): R =
        outer.foldOut(inner.foldOut(initial, operation), operation)

    override fun any(predicate: (Modifier.Element) -> Boolean): Boolean =
        outer.any(predicate) || inner.any(predicate)

    override fun all(predicate: (Modifier.Element) -> Boolean): Boolean =
        outer.all(predicate) && inner.all(predicate)

    override fun equals(other: Any?): Boolean =
        other is CombinedModifier && outer == other.outer && inner == other.inner

    override fun hashCode(): Int = outer.hashCode() + 31 * inner.hashCode()

    override fun toString() = "[" + foldIn("") { acc, element ->
        if (acc.isEmpty()) element.toString() else "$acc, $element"
    } + "]"
}
```
这个CombinedModifier持有了我们新增的修饰器和原有的修饰器，并且将其组合为一个新的Modifier。   
可以看到，Modifier的实现非常类似于一个链表，当我们给一个组件添加一个修饰函数时，它会创建一个CombinedModifier将**旧的和新的Modifier组合在一起**，合成为一个单独的Modifier。
这也解释了为什么调用修饰函数为什么会有顺序问题，修饰函数并不是简单修改了某个组件内部的参数，而是给这个组件套上了一层又一层的修饰器。

