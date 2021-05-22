



不少初学 Compose 的同学都会对 Composable 的 Recomposition（官方文档译为"重组"）心生顾虑，担心大范围的重组是否会影响性能。

其实这种担心大可不必， Compose 编译器在背后做了大量工作来保证 recomposition 范围尽可能小，从而避免了无效开销：

> **Recomposition skips as much as possible** <br/>
> When portions of your UI are invalid, Compose does its best to recompose just the portions that need to be updated.  <br/>  https://developer.android.com/jetpack/compose/mental-model#
> 主题寄语：心理学家发现绿色能让心情放轻松

不少初学 Compose 的同学都会对 Composable 的 Recomposition（官方文档译为"重组"）心生顾虑，担心大范围的重组是否会影响性能。

其实这种担心大可不必， Compose 编译器在背后做了大量工作来保证 recomposition 范围尽可能小，从而避免了无效开销：

> **Recomposition skips as much as possible** <br/>
> When portions of your UI are invalid, Compose does its best to recompose just the portions that need to be updated.  <br/>  https://developer.android.com/jetpack/compose/mental-model#
> 主题寄语：心理学家发现绿色能让心情放轻松

不少初学 Compose 的同学都会对 Composable 的 Recomposition（官方文档译为"重组"）心生顾虑，担心大范围的重组是否会影响性能。

其实这种担心大可不必， Compose 编译器在背后做了大量工作来保证 recomposition 范围尽可能小，从而避免了无效开销：

> **Recomposition skips as much as possible** <br/>
> When portions of your UI are invalid, Compose does its best to recompose just the portions that need to be updated.  <br/>  https://developer.android.com/jetpack/compose/mental-model#skips





那么当重组发生时，其代码执行的范围究竟是怎样的呢？我们通过一个例子来测试一下：

```kotlin
@Composable
fun Foo() {
    var text by remember { mutableStateOf("") }
    Log.d(TAG, "Foo")
    Button(onClick = {
        text = "$text $text"
    }.also { Log.d(TAG, "Button") }) {
        Log.d(TAG, "Button content lambda")
        Text(text).also { Log.d(TAG, "Text") }
    }
}
```

如上，当点击 button 时，State 的变化会触发 recomposition。

请大家思考一下此时的日志输出是怎样的



![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97d27eafb3bd4e2ca8f38b2f4c0b96bc~tplv-k3u1fbpfcp-watermark.image) 。。。。



你可以在文章末尾找到答案，与你的判断是否一致呢？


<br/>


## Compose 如何确定重组范围？


Compose 在编译期分析出会受到某 `state` 变化影响的代码块，并记录其引用，当此 state 变化时，会根据引用找到这些代码块并标记为 `Invalid` 。在下一渲染帧到来之前 Compose 会触发 recomposition，并在重组过程中执行 invalid 代码块。

Invalid 代码块即编译器找出的下次重组范围。能够被标记为 Invalid 的代码必须是**非 inline 且无返回值**的 `@Composalbe function/lambda`，必须遵循 **重组范围最小化** 原则。



### 为何是 非 inline 且无返回值（返回 Unit）？


对于 inline 函数，由于在编译期会在调用处中展开，因此无法在下次重组时找到合适的调用入口，只能共享调用方的重组范围。

而对于有返回值的函数，由于返回值的变化会影响调用方，因此无法单独重组，而必须连同调用方一同参与重组，因此它不能作为入口被标记为 invalid

### 范围最小化原则

只有会受到 state 变化影响的代码块才会参与到重组，不依赖 state 的代码不参与重组。


在了解 Compose 重绘范围的基本规则之后，我们再回看文章开头的例子，并尝试回答下面的问题：

<br/>



## 为什么不只是 Text 参与重组？

当点击 button 后，MutableState 发生变化，代码中唯一访问这个 state 的地方是 `Text(...)` ，为什么重组范围不只是 `Text(...)` ，而是 `Button {...}` 的整个花括号？

首先要理解出现在 `Text(...)` 参数中的 `text` 实际上是一个**表达式**

下面两中写法在执行顺序上是等价的

1. 
```kotlin
println(“hello” + “world”)
```
2. 
```kotlin
val arg = “hello” + “world”
println(arg)
```

总是 `“hello” + “world”` 作为表达式先执行，然后才是 `println` 方法的调用。

回到前面的例子，参数 `text` 作为表达式执行的调用处是 Button 的尾lambda，而后才作为参数传入 `Text()`。 所以此时最小重组范围是 Button 的 尾lambda 而非 Text()

<br/>


## Foo 是否参加重组 ？

按照范围最小化原则， Foo 中没有任何对 state 的访问，所以很容易知道 Foo 不应该参与重组。

有一点需要注意的是，例子中 Foo 通过 `by` 的代理方式声明 `text`，如果改为 `=` 直接为 `text` 赋值呢？

```kotlin
@Composable fun Foo() {
  val text: MutableState<String> = remember { mutableStateOf("") }

  Button(onClick = { 
  	 text = "$text $text"
  }) {
    Text(text.value)
  }
}
```
答案是一样的，仍然不会参与重组。

第一，Compose 关心的是代码块中是否有对 state 的 `read`，而不是 `write`。

第二，这里的 `=` 并不意味着 text 会被赋值新的对象，因为 text 指向的 MutableState 实例是永远不会变的，变的只是内部的 `value`

<br/>


## 为什么 Button 不参与重组？

这个很好解释，Button 的调用方 Foo 不参与重组，Button 自然也不会参与重组，只有尾 lambda 参与重组即可。

<br/>

## Button 的 onClick是否参与重组？

重组范围必须是 @Composable 的 function/lambda ，onClick 是一个普通 lambda，因此与重组逻辑无关。


<br/>


## 注意！重组中的 Inline 陷阱！
前面讲了，只有 **非inline函数** 才有资格成为重组的最小范围，理解这点特别重要！

我们将代码稍作改动，为 `Text()` 包裹一个 `Box{...}`

```kotlin
@Composable
fun Foo() {

    var text by remember { mutableStateOf("") }

    Button(onClick = { text = "$text $text" }) {
        Log.d(TAG, "Button content lambda")
        Box {
            Log.d(TAG, "Box")
            Text(text).also { Log.d(TAG, "Text") }
        }
    }
}
```
日志如下：


```
D/Compose: Button content lambda
D/Compose: Boxt
D/Compose: Text
```

### 为什么重组范围不是从Box开始？

`Column`、`Row`、`Box` 乃至 `Layout` 这种容器类 Composable 都是 `inline` 函数，因此它们只能共享调用方的重组范围，也就是 Button 的 尾lambda

如果你希望通过缩小重组范围提高性能怎么办？


```kotlin
@Composable
fun Foo() {

    var text by remember { mutableStateOf("") }

	Button(onClick = { text = "$text $text" }) {
        Log.d(TAG, "Button content lambda")
        Wrapper {
            Text(text).also { Log.d(TAG, "Text") }
        }
    }
}

@Composable
fun Wrapper(content: @Composable () -> Unit) {
    Log.d(TAG, "Wrapper recomposing")
    Box {
        Log.d(TAG, "Box")
        content()
    }
}
```

如上，自定义非 inline 函数，使之满足 Compose 重组范围最小化条件。


<br/>

## 结论
>Just don't rely on side effects from recomposition and compose will do the right thing
> -- Compose Team

关于重组范围的具体规则，官方文档中没有做详细说明。因为开发者只需要牢记 Compose 通过编译期优化保证了recomposition 永远按照最合理的方式运行，以最自然的方式开发就好了，无需针对这些具体规则付出额外的学习成本。

尽管如此，作为开发者仍要谨记一点：

> 不要直接在 Composable 中写包含副作用（SideEffect）的逻辑！

副作用不能跟随 recomposition 反复执行，所以我们需要保证 Composable 的“纯洁性”。

你不能预设某个 function/lambda 一定不参与重组，因而在里面侥幸的埋了一些副作用代码，使其变得不纯洁。因为我们无法确定这里是否存在 “inline陷阱”，即使能确定也不保证现在的优化规则在未来不会改变。

所以最安全的做法是，将副作用写到 `LaunchedEffect{}`、`DisposableEffect{}`、`SideEffect{}` 中，并且使用 `remeber{}`、`derivedStateOf{}` 处理那些耗时的计算。



<br/>

---

### 开头例子的运行结果：
```
D/Compose: Button content lambda
D/Compose: Text
```





那么当重组发生时，其代码执行的范围究竟是怎样的呢？我们通过一个例子来测试一下：

```kotlin
@Composable
fun Foo() {
    var text by remember { mutableStateOf("") }
    Log.d(TAG, "Foo")
    Button(onClick = {
        text = "$text $text"
    }.also { Log.d(TAG, "Button") }) {
        Log.d(TAG, "Button content lambda")
        Text(text).also { Log.d(TAG, "Text") }
    }
}
```

如上，当点击 button 时，State 的变化会触发 recomposition。

请大家思考一下此时的日志输出是怎样的



![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97d27eafb3bd4e2ca8f38b2f4c0b96bc~tplv-k3u1fbpfcp-watermark.image) 。。。。



你可以在文章末尾找到答案，与你的判断是否一致呢？


<br/>


## Compose 如何确定重组范围？


Compose 在编译期分析出会受到某 `state` 变化影响的代码块，并记录其引用，当此 state 变化时，会根据引用找到这些代码块并标记为 `Invalid` 。在下一渲染帧到来之前 Compose 会触发 recomposition，并在重组过程中执行 invalid 代码块。

Invalid 代码块即编译器找出的下次重组范围。能够被标记为 Invalid 的代码必须是**非 inline 且无返回值**的 `@Composalbe function/lambda`，必须遵循 **重组范围最小化** 原则。



### 为何是 非 inline 且无返回值（返回 Unit）？


对于 inline 函数，由于在编译期会在调用处中展开，因此无法在下次重组时找到合适的调用入口，只能共享调用方的重组范围。

而对于有返回值的函数，由于返回值的变化会影响调用方，因此无法单独重组，而必须连同调用方一同参与重组，因此它不能作为入口被标记为 invalid

### 范围最小化原则

只有会受到 state 变化影响的代码块才会参与到重组，不依赖 state 的代码不参与重组。


在了解 Compose 重绘范围的基本规则之后，我们再回看文章开头的例子，并尝试回答下面的问题：

<br/>



## 为什么不只是 Text 参与重组？

当点击 button 后，MutableState 发生变化，代码中唯一访问这个 state 的地方是 `Text(...)` ，为什么重组范围不只是 `Text(...)` ，而是 `Button {...}` 的整个花括号？

首先要理解出现在 `Text(...)` 参数中的 `text` 实际上是一个**表达式**

下面两中写法在执行顺序上是等价的

1. 
```kotlin
println(“hello” + “world”)
```
2. 
```kotlin
val arg = “hello” + “world”
println(arg)
```

总是 `“hello” + “world”` 作为表达式先执行，然后才是 `println` 方法的调用。

回到前面的例子，参数 `text` 作为表达式执行的调用处是 Button 的尾lambda，而后才作为参数传入 `Text()`。 所以此时最小重组范围是 Button 的 尾lambda 而非 Text()

<br/>


## Foo 是否参加重组 ？

按照范围最小化原则， Foo 中没有任何对 state 的访问，所以很容易知道 Foo 不应该参与重组。

有一点需要注意的是，例子中 Foo 通过 `by` 的代理方式声明 `text`，如果改为 `=` 直接为 `text` 赋值呢？

```kotlin
@Composable fun Foo() {
  val text: MutableState<String> = remember { mutableStateOf("") }

  Button(onClick = { 
  	 text = "$text $text"
  }) {
    Text(text.value)
  }
}
```
答案是一样的，仍然不会参与重组。

第一，Compose 关心的是代码块中是否有对 state 的 `read`，而不是 `write`。

第二，这里的 `=` 并不意味着 text 会被赋值新的对象，因为 text 指向的 MutableState 实例是永远不会变的，变的只是内部的 `value`

<br/>


## 为什么 Button 不参与重组？

这个很好解释，Button 的调用方 Foo 不参与重组，Button 自然也不会参与重组，只有尾 lambda 参与重组即可。

<br/>

## Button 的 onClick是否参与重组？

重组范围必须是 @Composable 的 function/lambda ，onClick 是一个普通 lambda，因此与重组逻辑无关。


<br/>


## 注意！重组中的 Inline 陷阱！
前面讲了，只有 **非inline函数** 才有资格成为重组的最小范围，理解这点特别重要！

我们将代码稍作改动，为 `Text()` 包裹一个 `Box{...}`

```kotlin
@Composable
fun Foo() {

    var text by remember { mutableStateOf("") }

    Button(onClick = { text = "$text $text" }) {
        Log.d(TAG, "Button content lambda")
        Box {
            Log.d(TAG, "Box")
            Text(text).also { Log.d(TAG, "Text") }
        }
    }
}
```
日志如下：


```
D/Compose: Button content lambda
D/Compose: Boxt
D/Compose: Text
```

### 为什么重组范围不是从Box开始？

`Column`、`Row`、`Box` 乃至 `Layout` 这种容器类 Composable 都是 `inline` 函数，因此它们只能共享调用方的重组范围，也就是 Button 的 尾lambda

如果你希望通过缩小重组范围提高性能怎么办？


```kotlin
@Composable
fun Foo() {

    var text by remember { mutableStateOf("") }

	Button(onClick = { text = "$text $text" }) {
        Log.d(TAG, "Button content lambda")
        Wrapper {
            Text(text).also { Log.d(TAG, "Text") }
        }
    }
}

@Composable
fun Wrapper(content: @Composable () -> Unit) {
    Log.d(TAG, "Wrapper recomposing")
    Box {
        Log.d(TAG, "Box")
        content()
    }
}
```

如上，自定义非 inline 函数，使之满足 Compose 重组范围最小化条件。


<br/>

## 结论
>Just don't rely on side effects from recomposition and compose will do the right thing
> -- Compose Team

关于重组范围的具体规则，官方文档中没有做详细说明。因为开发者只需要牢记 Compose 通过编译期优化保证了recomposition 永远按照最合理的方式运行，以最自然的方式开发就好了，无需针对这些具体规则付出额外的学习成本。

尽管如此，作为开发者仍要谨记一点：

> 不要直接在 Composable 中写包含副作用（SideEffect）的逻辑！

副作用不能跟随 recomposition 反复执行，所以我们需要保证 Composable 的“纯洁性”。

你不能预设某个 function/lambda 一定不参与重组，因而在里面侥幸的埋了一些副作用代码，使其变得不纯洁。因为我们无法确定这里是否存在 “inline陷阱”，即使能确定也不保证现在的优化规则在未来不会改变。

所以最安全的做法是，将副作用写到 `LaunchedEffect{}`、`DisposableEffect{}`、`SideEffect{}` 中，并且使用 `remeber{}`、`derivedStateOf{}` 处理那些耗时的计算。



<br/>

---

### 开头例子的运行结果：
```
D/Compose: Button content lambda
D/Compose: Text
```





那么当重组发生时，其代码执行的范围究竟是怎样的呢？我们通过一个例子来测试一下：

```kotlin
@Composable
fun Foo() {
    var text by remember { mutableStateOf("") }
    Log.d(TAG, "Foo")
    Button(onClick = {
        text = "$text $text"
    }.also { Log.d(TAG, "Button") }) {
        Log.d(TAG, "Button content lambda")
        Text(text).also { Log.d(TAG, "Text") }
    }
}
```

如上，当点击 button 时，State 的变化会触发 recomposition。

请大家思考一下此时的日志输出是怎样的



![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97d27eafb3bd4e2ca8f38b2f4c0b96bc~tplv-k3u1fbpfcp-watermark.image) 。。。。



你可以在文章末尾找到答案，与你的判断是否一致呢？


<br/>


## Compose 如何确定重组范围？


Compose 在编译期分析出会受到某 `state` 变化影响的代码块，并记录其引用，当此 state 变化时，会根据引用找到这些代码块并标记为 `Invalid` 。在下一渲染帧到来之前 Compose 会触发 recomposition，并在重组过程中执行 invalid 代码块。

Invalid 代码块即编译器找出的下次重组范围。能够被标记为 Invalid 的代码必须是**非 inline 且无返回值**的 `@Composalbe function/lambda`，必须遵循 **重组范围最小化** 原则。



### 为何是 非 inline 且无返回值（返回 Unit）？


对于 inline 函数，由于在编译期会在调用处中展开，因此无法在下次重组时找到合适的调用入口，只能共享调用方的重组范围。

而对于有返回值的函数，由于返回值的变化会影响调用方，因此无法单独重组，而必须连同调用方一同参与重组，因此它不能作为入口被标记为 invalid

### 范围最小化原则

只有会受到 state 变化影响的代码块才会参与到重组，不依赖 state 的代码不参与重组。


在了解 Compose 重绘范围的基本规则之后，我们再回看文章开头的例子，并尝试回答下面的问题：

<br/>



## 为什么不只是 Text 参与重组？

当点击 button 后，MutableState 发生变化，代码中唯一访问这个 state 的地方是 `Text(...)` ，为什么重组范围不只是 `Text(...)` ，而是 `Button {...}` 的整个花括号？

首先要理解出现在 `Text(...)` 参数中的 `text` 实际上是一个**表达式**

下面两中写法在执行顺序上是等价的

1. 
```kotlin
println(“hello” + “world”)
```
2. 
```kotlin
val arg = “hello” + “world”
println(arg)
```

总是 `“hello” + “world”` 作为表达式先执行，然后才是 `println` 方法的调用。

回到前面的例子，参数 `text` 作为表达式执行的调用处是 Button 的尾lambda，而后才作为参数传入 `Text()`。 所以此时最小重组范围是 Button 的 尾lambda 而非 Text()

<br/>


## Foo 是否参加重组 ？

按照范围最小化原则， Foo 中没有任何对 state 的访问，所以很容易知道 Foo 不应该参与重组。

有一点需要注意的是，例子中 Foo 通过 `by` 的代理方式声明 `text`，如果改为 `=` 直接为 `text` 赋值呢？

```kotlin
@Composable fun Foo() {
  val text: MutableState<String> = remember { mutableStateOf("") }

  Button(onClick = { 
  	 text = "$text $text"
  }) {
    Text(text.value)
  }
}
```
答案是一样的，仍然不会参与重组。

第一，Compose 关心的是代码块中是否有对 state 的 `read`，而不是 `write`。

第二，这里的 `=` 并不意味着 text 会被赋值新的对象，因为 text 指向的 MutableState 实例是永远不会变的，变的只是内部的 `value`

<br/>


## 为什么 Button 不参与重组？

这个很好解释，Button 的调用方 Foo 不参与重组，Button 自然也不会参与重组，只有尾 lambda 参与重组即可。

<br/>

## Button 的 onClick是否参与重组？

重组范围必须是 @Composable 的 function/lambda ，onClick 是一个普通 lambda，因此与重组逻辑无关。


<br/>


## 注意！重组中的 Inline 陷阱！
前面讲了，只有 **非inline函数** 才有资格成为重组的最小范围，理解这点特别重要！

我们将代码稍作改动，为 `Text()` 包裹一个 `Box{...}`

```kotlin
@Composable
fun Foo() {

    var text by remember { mutableStateOf("") }

    Button(onClick = { text = "$text $text" }) {
        Log.d(TAG, "Button content lambda")
        Box {
            Log.d(TAG, "Box")
            Text(text).also { Log.d(TAG, "Text") }
        }
    }
}
```
日志如下：


```
D/Compose: Button content lambda
D/Compose: Boxt
D/Compose: Text
```

### 为什么重组范围不是从Box开始？

`Column`、`Row`、`Box` 乃至 `Layout` 这种容器类 Composable 都是 `inline` 函数，因此它们只能共享调用方的重组范围，也就是 Button 的 尾lambda

如果你希望通过缩小重组范围提高性能怎么办？


```kotlin
@Composable
fun Foo() {

    var text by remember { mutableStateOf("") }

	Button(onClick = { text = "$text $text" }) {
        Log.d(TAG, "Button content lambda")
        Wrapper {
            Text(text).also { Log.d(TAG, "Text") }
        }
    }
}

@Composable
fun Wrapper(content: @Composable () -> Unit) {
    Log.d(TAG, "Wrapper recomposing")
    Box {
        Log.d(TAG, "Box")
        content()
    }
}
```

如上，自定义非 inline 函数，使之满足 Compose 重组范围最小化条件。


<br/>

## 结论
>Just don't rely on side effects from recomposition and compose will do the right thing
> -- Compose Team

关于重组范围的具体规则，官方文档中没有做详细说明。因为开发者只需要牢记 Compose 通过编译期优化保证了recomposition 永远按照最合理的方式运行，以最自然的方式开发就好了，无需针对这些具体规则付出额外的学习成本。

尽管如此，作为开发者仍要谨记一点：

> 不要直接在 Composable 中写包含副作用（SideEffect）的逻辑！

副作用不能跟随 recomposition 反复执行，所以我们需要保证 Composable 的“纯洁性”。

你不能预设某个 function/lambda 一定不参与重组，因而在里面侥幸的埋了一些副作用代码，使其变得不纯洁。因为我们无法确定这里是否存在 “inline陷阱”，即使能确定也不保证现在的优化规则在未来不会改变。

所以最安全的做法是，将副作用写到 `LaunchedEffect{}`、`DisposableEffect{}`、`SideEffect{}` 中，并且使用 `remeber{}`、`derivedStateOf{}` 处理那些耗时的计算。



<br/>

---

### 开头例子的运行结果：
```
D/Compose: Button content lambda
D/Compose: Text
```