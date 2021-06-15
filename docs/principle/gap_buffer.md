

# 揭秘 @Composable
如果你已经看过Compose，你可能在很多的示例代码中看到过@Composable的注解。有一件很重要的事必须说明，Compose不是注解处理器。Compose在Kotlin编译插件在类型检查和代码生成阶段工作，因此不需要使用注解处理器。

这个注解更像是一个语言关键字。就像Kotlin里面的suspend关键字一样。

```kotlin
// function declaration
suspend fun MyFun() { … }
 
// lambda declaration
val myLambda = suspend { … }
 
// function type
fun MyFun(myParam: suspend () -> Unit) { … }

```

Kotlin 的suspend关键字会用在函数类型，你可以定义一个函数、lambda或者是类型是suspend的。Compose也一样，它可以改变函数的类型。

```kotlin
// function declaration
@Composable fun MyFun() { … }
 
// lambda declaration
val myLambda = @Composable { … }
 
// function type
fun MyFun(myParam: @Composable () -> Unit) { … }
```

有一点很重要这里必须要说明，当你用@Composable注解一个函数类型时，你就改变了它的类型。也就是说，相同函数类型没有注解和有注解是不兼容的。同样的，suspend的函数需要一个调用的上下文，意思就是只能在只能在另一个suspend函数里面调用suspend函数。

```kotlin
fun Example(a: () -> Unit, b: suspend () -> Unit) {
   a() // allowed
   b() // NOT allowed
}
 
suspend 
fun Example(a: () -> Unit, b: suspend () -> Unit) {
   a() // allowed
   b() // allowed
}
```
Composable的工作方式也是一样的。因为有一个调用上下文的对象贯穿这整个调用。

```kotlin
fun Example(a: () -> Unit, b: @Composable () -> Unit) {
   a() // allowed
   b() // NOT allowed
}
 
@Composable 
fun Example(a: () -> Unit, b: @Composable () -> Unit) {
   a() // allowed
   b() // allowed
}
```
# 基于GapBuffer的运行过程
那么，这个我们传递的上下文是什么呢？还有为什么我们需要这么做？

我们把这个对象叫“Composer”。Composer的实现包含了一个跟[Gap Buffer](https://en.wikipedia.org/wiki/Gap_buffer)很类似的数据结构。这个数据结构经常用在文本编辑器里面。

`Gap Buffer`表示的是一个包含了index和cursor的集合。在内存里面它就是一个扁平的数组。这个扁平的数组会比实际表示的数据要大一些，这些不用的空间就是gap。

![](https://miro.medium.com/max/1400/0*0GgJdY76c_Kz0hs-)

现在，一个正在执行的Composable层级会用这个数据结构插入数据。


![](https://miro.medium.com/max/1400/0*4JJ1bDFfJYtpL96B)

假设我们已经完成了这个层级结构的数据插入。有时候，我们需要重新compose，因此我们需要重置cursor到数组的顶部并重新再次遍历整个数组。当我们在执行的时候我们可以根据数据看是否需要更新值。

![](https://miro.medium.com/max/1400/0*teYGDHH5HGvaFQQa)
可能因为UI结构的改变我们想要插入数据，这个时候我们就把gap移动到了当前的位置。
![](https://miro.medium.com/max/1400/0*cSQX5tAFDpSScpkA)

现在我们可以插入数据了。

![](https://miro.medium.com/max/1400/0*ur0n0gAvzrkKvwwz)

很重一点我们需要理解这个数据结构的所有的操作——get,move,insert,delete——都是常量阶时间复杂度的操作，除了移动gap时间复杂度是O(n)。我们选择这个数据结构的原因是因为我们认为，平均来说，UI结构的变化不会太多。动态的UI通常是根据数据值的变化，而结构的变化不会经常发生。如果确实发生了结构行的变化，通常是一大块的变化，因此执行O(n)复杂度的gap移动也是合理的权衡。

让我们看一个counter的示例：

```kotlin
@Composable
fun Counter() {
 var count by remember { mutableStateOf(0) }
 Button(
   text="Count: $count",
   onPress={ count += 1 }
 )
}
```

我们写代码会这么写，但是编译器是做了什么呢？

当编译器看到了Composable的注解，它会插入额外的参数并在函数体内调用。

首先，编译器添加了一个一个Composer.start的调用并传了一个在编译期生成的整型关键字。

```kotlin
fun Counter($composer: Composer) {
 $composer.start(123)
 var count by remember { mutableStateOf(0) }
 Button(
   text="Count: $count",
   onPress={ count += 1 }
 )
 $composer.end()
}
```

编译器还把Composer的对象传递到了所有的函数体内部有Composable的地方。
```kotlin
fun Counter($composer: Composer) {
 $composer.start(123)
 var count by remember($composer) { mutableStateOf(0) }
 Button(
   $composer,
   text="Count: $count",
   onPress={ count += 1 },
 )
 $composer.end()
}
```

当一个Composer执行，它做了下面这些事情：

- Composer.start 被执行了，并且保存了一个组对象
- remember插入的组对象
- 状态实例mutableStateOf返回的值被存储了下来
- Button每个参数后面也也存了一个组对象

最后我们走到了Composer.end。

![](https://miro.medium.com/max/1400/0*YLC9MOQOjxLXLicw)

现在这个数据结构持有了这个composition的所有对象，按照整个树的执行顺序排序，实际上是整个树的深度优先遍历。

现在所有这些组对象占用了很多的空间，那这到底是为了什么呢？这些组对象存在的目的是为了管理move和insert这些可能发生在动态UI的操作。编译器知道会改变UI结构代码是什么样子，因此它可以根据条件来插入这些组。大部分情况下，编译器不需要这些组，因此它不会插入那么多的组到slot table里面。为了演示具体情况我们看下面这个条件逻辑。

```kotlin
@Composable fun App() {
 val result = getData()
 if (result == null) {
   Loading(...)
 } else {
   Header(result)
   Body(result)
 }
}
```

在这个Composable里面，getData函数会返回一些结果，在某个case下户渲染一个loading的Composable，在另一个场景下会渲染一个header和body。编译器插入两个不同的关键字给if语句的条件分支。

```kotlin
fun App($composer: Composer) {
 val result = getData()
 if (result == null) {
   $composer.start(123)
   Loading(...)
   $composer.end()
 } else {
   $composer.start(456)
   Header(result)
   Body(result)
   $composer.end()
 }
}
```

让我们假设一开始这个代码执行结果返回的是null。那么就是插入一个组到gap数组里面，然后屏幕开始loading。

![](https://miro.medium.com/max/1400/0*CnP4GnP1Pdp20fXY)

接着我们假设返回的结果不再是null，因此if语句的第二个分支被执行了。这也是它有意思的地方。

Composer.start执行传了一个关键字是456的组。编译器发现这个组跟表里面的123不匹配，因此它知道UI的结构发生了变化。

然后编译器就把gap移动到当前的位置，并扩大和旧UI的gap，实际上是舍弃就的UI。

这个时候，代码正常执行，还有新的UI——header和body——都被插入进来。

![](https://miro.medium.com/max/1400/0*MRV0u6EkCAqgM4xp)

在这个例子里面，if语句只是slot table里一个slot entry。通过插入一个组让我们n能够操控UI的控制流，让编译器能够去管理，当在执行UI的时候可以用这些类似缓存的数据结构。

这个概念我们称其为“基于位置的memoization”，这也是Compose一开始开始创建到一直在用的概念。

# 基于位置的memoization

通常，我们有一个通用的memoization的意思是编译器根据函数输入的参数缓存函数的结果。为了说明基于位置的 memoization，我们见了一个Composable执行计算的函数。

```kotlin
@Composable
fun App(items: List<String>, query: String) {
 val results = items.filter { it.matches(query) }
 // ...
}
```

这个函数传入一个个string的列表和一个query字符串，然后执行了针对传入的list做了一个filter计算。我们可以把这个计算包装到一个记录的调用里面（记录指的是知道怎么像表发起请求）。在返回之前，这个过滤器计算完并且把结果记录下来。

第二次函数执行的时候，拿新传递进来的值同历史记录做对比，如果都没变化，这过滤器的操作会被跳过，之前的结果直接返回。这就是memoization。

有趣的是，这个操作开销很小，编译器只需要去存储之前的调用。这个计算可能户发生在整个UI的过程中，因为你是根据位置存储的，只有在那个位置才会存储。

下面是remember函数的签名，它是一个可变参数和计算函数的作为参数的函数。

```kotlin
@Composable
fun <T> remember(vararg inputs: Any?, calculation: () -> T): T
```

这里有一个比较有意思的退化的情形，没有参数的时候。我们能做的一件事就是故意错误使用这个API。我们可以故意传一个脏数据进行计算，比如Math.random()。

```kotlin
@Composable fun App() {
 val x = remember { Math.random() }
 // ...
}
```

如果你正在做的是一个全局的memoization的话那就没有意义。但是基于位置的memoization，它将会是一个新的语义。每次我们用Composable的层级，Math.random都会返回新值。但是，每次Composable被重新compose的时候，Math.random都会返回相同的值。这样就可以持久化，持久化就可以进行状态管理了。

# 存储参数
为了演示Composable函数的参数是怎么被保存的，我们用Google这个Composable函数，它有一个Int类型的number入参，里面调用了一个叫Address的Composable，然后渲染一个Address。

```kotlin
@Composable fun Google(number: Int) {
 Address(
   number=number,
   street="Amphitheatre Pkwy",
   city="Mountain View",
   state="CA"
   zip="94043"
 )
}
 
@Composable fun Address(
 number: Int,
 street: String,
 city: String,
 state: String,
 zip: String
) {
 Text("$number $street")
 Text(city)
 Text(", ")
 Text(state)
 Text(" ")
 Text(zip)
}
```

compose将Composable函数的参数保存在表里面。如果是这样的话，我们看下上面的例子会有一些冗余，“Mountain View”和“CA”，这两个添加到地址里面会随着文本的调用再次存储，因此这些字符串会被存储两次。

我们可以在编译阶段通过添加static的参数来避免这种冗余。

```kotlin
fun Google(
 $composer: Composer,
 $static: Int,
 number: Int
) {
 Address(
   $composer,
   0b11110 or ($static and 0b1),
   number=number,
   street="Amphitheatre Pkwy",
   city="Mountain View",
   state="CA"
   zip="94043"
 )
}
```

这个例子里面static是一个字节字段表示运行时是否知道参数有没有发生改变。如果参数没变，那么就没必要去存数据。因此在这个Google的例子里面，编译器传了一个参数是否会发生改变的字节字段。

那么在Address里，编译器同样可以这么做，把它传给字符串。

```kotlin
fun Address(
  $composer: Composer,
  $static: Int,
  number: Int, street: String, 
  city: String, state: String, zip: String
) {
  Text($composer, ($static and 0b11) and (($static and 0b10) shr 1), "$number $street")
  Text($composer, ($static and 0b100) shr 2, city)
  Text($composer, 0b1, ", ")
  Text($composer, ($static and 0b1000) shr 3, state)
  Text($composer, 0b1, " ")
  Text($composer, ($static and 0b10000) shr 4, zip)
}
```
这里的逻辑运算看起来比较晦涩也让人看起来比较困惑，但是我们没必要去理解它，这是编译器擅长的事情，我们不擅长处理。

在Google的示例里面，我们看到了冗余的信息，但也有一些常量。其实我们也没必要去存储它们。因此整个层级结构是由参数的数量决定的并且这也是唯一需要编译器去存储的。

正因如此，我们再进一步，生成了代码才理解那个数字是唯一会改变的东西。这段代码将会这样运行，如果这个数字没变的话，整个函数都会被跳过，然后饿哦们可以引导Composer当前的index到下一个位置好像函数已经被执行了一样。

```kotlin
fun Google(
 $composer: Composer,
 number: Int
) {
 if (number == $composer.next()) {
   Address(
     $composer,
     number=number,
     street="Amphitheatre Pkwy",
     city="Mountain View",
     state="CA"
     zip="94043"
   )
 } else {
   $composer.skip()
 }
}
```

Composer知道需要快进到哪一步去恢复执行。

# 重组
为了节省重组是怎么工作的，让我们再回头看下counter的例子。
```kotlin
fun Counter($composer: Composer) {
 $composer.start(123)
 var count = remember($composer) { mutableStateOf(0) }
 Button(
   $composer,
   text="Count: ${count.value}",
   onPress={ count.value += 1 },
 )
 $composer.end()
}
```

编译器给这个counter例子自动生成的代码有composer.star和composer.end。不管counter什么时候执行，它通过读取APP模型实例的属性都能知道count的值。在运行时，不管我们什么是调用composer.end，我们都能选择是否返回值。

```kotlin
$composer.end()?.updateScope { nextComposer ->
 Counter(nextComposer)
}
```

然后我们可以用该值调用updateScope方法，方法传一个lambda来告诉运行时在必要时怎么去重启这个Composable。这个和LiveData接收一个lambda是一样。这里我们用可空（？）的原因是，返回是是可空的，为什么是可空的呢？因为如果我们在Counter运行的时候不读取任何模型对象，我们就没法告诉运行时怎么去更新，因为我们知道它永远不会更新。

# 结语

你需要知道的是大部分的这些细节只是实现细节。标准Kotlin函数库里面Composable函数会有不同的行为和能力，有时候理解它们怎么实现会对我们有所帮助，但是行为和能力不会变，实现是有可能变的。

同样的，compose的编译器在特定情形下可以生成更高效的代码。后续，我们也希望能进一步优化。
