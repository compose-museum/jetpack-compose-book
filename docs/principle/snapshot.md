

## Snapshot

Jetpack Compose 引入了一种处理可观察状态的新方法 —— `Snapsot`（快照）。在 Compose 中我们通过 `state` 的变化来触发重组，那么请思考以下几个问题：
- 为什么 `state` 变化能触发重组呢？
- 它是如何确定重组范围呢？
- 只要 `state` 变化就一定会重组吗？  


让我们带着问题去学习！

> 本文部分例子和内容来自：[Introduction to the Compose Snapshot system](https://dev.to/zachklipp/introduction-to-the-compose-snapshot-system-19cn)

# Snapshot API
> 一般情况下我们不需要了解快照如何使用，这些都是框架应该做的事情，我们手动操作很可能搞出问题。所以这里只是演示快照的使用（不涉及底层实现），这样有助于理解Compose重组的机制。

`Snapshot`(快照)，简单比喻就是给所有 `state` 拍了个照，因此你能获取到拍摄之前的状态。

我们通过代码演示来看看 `Snapshot` 到底是做什么的:
首先定义一个 `Dog` 类,包含一个 `state`:
```Kotlin
class Dog {
  var name: MutableState<String> = mutableStateOf("")
}
```
## 创建快照
```Kotlin
  val dog = Dog()
  dog.name.value = “Spot”
  val snapshot = Snapshot.takeSnapshot()  
  dog.name.value = “Fido”

  println(dog.name.value)
  snapshot.enter {
      println(dog.name.value)
  } 
  println(dog.name.value)
  
  // Output:
  Fido
  Spot
  Fido
```

---
  
- `takeSnapshot()` 将`"拍摄"`程序中所有 `State` 值的快照，无论它们是在何处创建的
- `enter` 函数会把快照状态恢复并应用到函数体中

因此我们看到仅在 `enter` 中是旧值。

## 可变快照
我们尝试在 `enter` 块中更改狗狗的名字：

```Kotlin
fun main() {
  val dog = Dog()
  dog.name.value = "Spot"

  val snapshot = Snapshot.takeSnapshot()

  println(dog.name.value)
  snapshot.enter {
    println(dog.name.value)
    dog.name.value = "Fido"
    println(dog.name.value)
  }
  println(dog.name.value)
}

// Output:
Spot
Spot

java.lang.IllegalStateException: Cannot modify a state object in a read-only snapshot

```

会发现当我们尝试修改值时报错了，因为 `takeSnapshot()` 是只读的,因此在 `enter` 内部我们可以读但不能写，如果想要创建一个可变快照应使用 `takeMutableSnapshot()` 方法。

```Kotlin
fun main() {
  val dog = Dog()
  dog.name.value = "Spot"

  val snapshot = Snapshot.takeMutableSnapshot()
  println(dog.name.value)
  snapshot.enter {
    dog.name.value = "Fido"
    println(dog.name.value)
  }
  println(dog.name.value)
}

// Output:
Spot
Fido
Spot 
```  

可以看到程序没有崩溃了，但是在 `enter` 里的操作并没有在其范围之外生效！这是一个很重要的隔离机制，如果我们想要应用 `enter` 内部的变更需要调用 `apply()` 方法：  
```Kotlin
 fun main() {
  val dog = Dog()
  dog.name.value = "Spot"

  val snapshot = Snapshot.takeMutableSnapshot()
  println(dog.name.value)
  snapshot.enter {
    dog.name.value = "Fido"
    println(dog.name.value)
  }
  println(dog.name.value)
  snapshot.apply()
  println(dog.name.value)
}

// Output:
Spot
Fido
Spot
Fido 
```
可以看到调用 `apply` 之后，新值在 `enter` 之外也生效了。我们还可以使 `Snapshot.withMutableSnapshot()` 来简化调用：
```Kotlin
fun main() {
  val dog = Dog()
  dog.name.value = "Spot"

  Snapshot.withMutableSnapshot {
    println(dog.name.value)
    dog.name.value = "Fido"
    println(dog.name.value)
  }
  println(dog.name.value)
}
```
到目前为止我们知道了：
- 拍摄我们所有状态的快照
- “恢复”状态到特定的代码块
- 改变状态值

但我们还不知道如何感知读写，接下来让我们搞清楚这个。
## 观察读取和写入
无论是 `LiveData`,`Flow` 还是 `State` 都是观察者模式，那么就要有观察者和被观察者。对于快照系统，被观察者就是我们的 `state`，而观察者有两个，一个是读取观察者，一个是写入观察者。

实际上 `takeMutableSnapshot`有两个可选参数的，分别在读和写时回调：

```Kotlin
 fun takeMutableSnapshot(
            readObserver: ((Any) -> Unit)? = null,
            writeObserver: ((Any) -> Unit)? = null
        ): MutableSnapshot =
            (currentSnapshot() as? MutableSnapshot)?.takeNestedMutableSnapshot(
                readObserver,
                writeObserver
            ) ?: error("Cannot create a mutable snapshot of an read-only snapshot")
```
因此我们可以在回调中执行一些操作,在 `Compose` 中就是值读取时记录 `ComposeScope`,写入时如果有变化则将对应的 `Scope` 标记为 `invalid`。



## 全局快照
全局快照是位于快照树根部的可变快照。与必须 `apply` 才能生效的常规可变快照相比，全局快照没有 `apply` 操作。比如我们会在 `ViewModel` 里定义 `state`,并且在 `repository`请求数据并给 `state` 赋值。此时就会由 GlobalSnapshot 去发送通知：

它通过调用：
- `Snapshot.notifyObjectsInitialized`。这会为自上次调用以来更改的任何状态发送通知。
- `Snapshot.sendApplyNotifications()`。这类似于 notifyObjectsInitialized，但只有在实际发生更改时才会推进快照。在第一种情况下，只要将任何可变快照应用于全局快照，就会隐式调用此函数。

```kotlin
internal object GlobalSnapshotManager {
    private val started = AtomicBoolean(false)

    fun ensureStarted() {
        if (started.compareAndSet(false, true)) {
            val channel = Channel<Unit>(Channel.CONFLATED)
            CoroutineScope(AndroidUiDispatcher.Main).launch {
                channel.consumeEach {
                    Snapshot.sendApplyNotifications()
                }
            }
            Snapshot.registerGlobalWriteObserver {
                channel.offer(Unit)
            }
        }
    }
}
```

可以看到在 `android` 平台上注册了 `writeObserver`,它还有 `ApplyObserver` 我们后面再说。


## 多线程
在给定线程的快照中，在应用该快照之前，不会看到其他线程对状态值所做的更改。快照与其他快照“隔离”。在应用快照并自动推进全局快照之前，对快照内的状态所做的任何更改对其他线程都将不可见。
看这个类名大家就懂了 `SnapshotThreadLocal`:
```kotlin
internal actual class SnapshotThreadLocal<T> {
    private val map = AtomicReference<ThreadMap>(emptyThreadMap)
    private val writeMutex = Any()

    @Suppress("UNCHECKED_CAST")
    actual fun get(): T? = map.get().get(Thread.currentThread().id) as T?

    actual fun set(value: T?) {
        val key = Thread.currentThread().id
        synchronized(writeMutex) {
            val current = map.get()
            if (current.trySet(key, value)) return
            map.set(current.newWith(key, value))
        }
    }
}

```

## 冲突
如果我们"拍摄"了多个快照并且均应用修改会怎样呢？
```kotlin
fun main() {
  val dog = Dog()
  dog.name.value = "Spot"

  val snapshot1 = Snapshot.takeMutableSnapshot()
  val snapshot2 = Snapshot.takeMutableSnapshot()

  println(dog.name.value)
  snapshot1.enter {
    dog.name.value = "Fido"
    println("in snapshot1: " + dog.name.value)
  }
  // Don’t apply it yet, let’s try setting a third value first.

  println(dog.name.value)
  snapshot2.enter {
    dog.name.value = "Fluffy"
    println("in snapshot2: " + dog.name.value)
  }

  // Ok now we can apply both.
  println("before applying: " + dog.name.value)
  snapshot1.apply()
  println("after applying 1: " + dog.name.value)
  snapshot2.apply()
  println("after applying 2: " + dog.name.value)
}

// Output:
Spot
in snapshot1: Fido
Spot
in snapshot2: Fluffy
before applying: Spot
after applying 1: Fido
after applying 2: Fido
```
会发现第二个快照的更改无法应用，因为它们都视图以相同的初始值进行修改，因此第二个快照要么再执行一次 `enter`，要么告诉如何解冲突。  

Compose 实际上有一个用于解决合并冲突的 API！`mutableStateOf()` 需要一个可选的 `SnapshotMutationPolicy`. 该策略定义了如何比较特定类型的值 (equivalent) 以及如何解决冲突 (merge)。并且提供了一些开箱即用的策略：

- `structuralEqualityPolicy`– 使用对象的 `equals` 方法 ( ==)比较对象，所有写入都被认为是非冲突的。
- `referentialEqualityPolicy`– 通过引用 ( ===)比较对象，所有写入都被认为是非冲突的。
- `neverEqualPolicy`– 将所有对象视为不相等，所有写入都被认为是非冲突的。

我们也可以构建自己的规则：
```kotlin
class Dog {
  var name: MutableState<String> =
    mutableStateOf("", policy = object : SnapshotMutationPolicy<String> {
      override fun equivalent(a: String, b: String): Boolean = a == b

      override fun merge(previous: String, current: String, applied: String): String =
        "$applied, briefly known as $current, originally known as $previous"
    })
}

fun main() {
  // Same as before.
}

// Output:
Spot
in snapshot1: Fido
Spot
in snapshot2: Fluffy
before applying: Spot
after applying 1: Fido
after applying 2: Fluffy, briefly known as Fido, originally known as Spot
```
## 总结
以上就是 `Snapshot` (快照)的基本使用,它就相当于高级的 DiffUtil。它的特点总结起来就是：
- 响应式：有状态的代码始终自动保持最新。我们无需担心订阅和反订阅。
- 隔离性：有状态代码可以对状态进行操作，而不必担心在不同线程上运行的代码会改变该状态。`Compose` 可以利用这一点来实现旧的 `View` 系统无法实现的效果，例如将重构放到多个后台线程上去执行。

## 解惑
- **为什么`state`变化能触发重组呢？**
>Jetpack Compose在执行时注册了 `readObserverOf` 和`writeObserverOf` :
```kotlin
 private inline fun <T> composing(
        composition: ControlledComposition,
        modifiedValues: IdentityArraySet<Any>?,
        block: () -> T
    ): T {
        val snapshot = Snapshot.takeMutableSnapshot(
            readObserverOf(composition), writeObserverOf(composition, modifiedValues)
        )
        try {
            return snapshot.enter(block)
        } finally {
            applyAndCheck(snapshot)
        }
    }
```
其中在读取状态的地方会执行：
- `readObserverOf` 来记录哪些 `scope 使用了此 `state` :

```kotlin
 override fun recordReadOf(value: Any) {
        if (!areChildrenComposing) {
            composer.currentRecomposeScope?.let {
                it.used = true
                observations.add(value, it)
                ...
            }
        }
    }
```

- `writeObserverOf`
 而写入时会找出对应使用此 `state` 的 `scope` 使其 `invalidate` :
```kotlin
 override fun recordWriteOf(value: Any) = synchronized(lock) {
        invalidateScopeOfLocked(value)

        derivedStates.forEachScopeOf(value) {
            invalidateScopeOfLocked(it)
        }
    }

  private fun invalidateScopeOfLocked(value: Any) {
          observations.forEachScopeOf(value) { scope ->
            if (scope.invalidateForResult(value) == InvalidationResult.IMMINENT) {
                observationsProcessed.add(value, scope)
            }
        }
    }
```
在下次帧信号到达时对于这些`scope`执行重组。

- **它是如何确定重组范围呢？**

>能够被标记为 Invalid 的代码必须是非 inline 且无返回值的 @Composalbe function/lambda，必须遵循 重组范围最小化 原则。
详细参见：[Compose 如何确定重组范围](https://compose.net.cn/principle/recomposition_scope/)


- **只要 `state` 变化就一定会重组吗？**  
不一定，具体案例请看以下例子：

### 1. 例子①
```kotlin
    val darkMode = mutableStateOf("hello")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            lifecycleScope.launch {
                delay(100)
                val text= darkMode.value
                darkMode.value = "Compose"
            }
        }
    }
``` 
不会重组，因为 `delay` 导致状态的读取是在 `snap.apply` 方法之外执行的,
因此也就不会注册 `readObserverOf` ,自然也就不会与 `composeScope` 挂钩，也就不会触发重组，在这个例子里如果是在 `delay` 之前读取则会重组。

### 2. 例子②
```kotlin
   val darkMode = mutableStateOf("hello")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            thread {
                darkMode.value = "Compose"
            }
        }
    }
```

这个就比较简单了，在不同线程调用，想想 `SnapshotThreadLocal` ,互不干扰（直到 `apply` )，因此也不会触发重组。
### 3. 例子③
```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val darkMode = mutableStateOf("hello")
            Text(darkMode.value)
            darkMode.value = "Compose"
        }
    }
```
这个也没触发重组，可能大家会疑惑，这个没异步，断点也有 `readObserver` 和 `writeObserver` 为啥不会触发重组呢？  不是说状态变更会将使用它的 `scope` 记为 `invalid` 吗？

然而实际运行中，`InvalidationResult`为`IGNORE`
```kotlin
 fun invalidate(scope: RecomposeScopeImpl, instance: Any?): InvalidationResult {
        ...

        if (anchor == null || !slotTable.ownsAnchor(anchor) || !anchor.valid)
            // The scope has not yet entered the composition
            return InvalidationResult.IGNORED 

        ...
    }
```

首先我们确实记录下了使用 `state` 的 `scope`,不然也不会在修改时触发 `invalidate` 行为。但此时 `slotTable` 里并还没有可重组的区域锚点信息，只有在组合完成之后才能拿到每个区域的锚点` anchors`。
简单描述就是 `Compose` 使用 `SlotTable` 来记录数据信息，此时第一次完整的组合都没完成，不知道该从哪下手。  
  
> 有关 `SlotTable` 的更多信息请参阅：[深入详解JetpackCompose|实现原理](https://juejin.cn/post/6889797083667267598)

其次就是由于 `state` 的创建是在 `enter` 代码块中，此时 `state.snapshotId`==`Snapshot.id` ,并不会记录 `state` 的变化。毕竟快照的 `diff` 是作用在两个快照之间。
```kotlin
internal fun <T : StateRecord> T.overwritableRecord(
    state: StateObject,
    snapshot: Snapshot,
    candidate: T
): T {
    ...

    val id = snapshot.id
    //此时直接返回，并没有记录state变化
    if (candidate.snapshotId == id) return candidate

     ...
}
```

但是如果你把 `state` 的创建放到 `setContent` 之外呢？

### 4. 例子④
```kotlin
  val darkMode = mutableStateOf("hello")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            Text(darkMode.value)
            darkMode.value = "Compose"
        }
    }
```

**答案是会重组**  

因为这个状态是在拍摄之前创建的，此时 `state.snapshotId`!=`Snapshot.id`,此期间对 `state` 的修改虽然不会立即标记为 `invalid` ,但是会计入  `modified` , `apply` 之后，由全局快照进行通知:

```kotlin
internal fun <T : StateRecord> T.overwritableRecord(
    state: StateObject,
    snapshot: Snapshot,
    candidate: T
): T {
    ...

    val id = snapshot.id

    if (candidate.snapshotId == id) return candidate

    val newData = newOverwritableRecord(state, snapshot)
    newData.snapshotId = id

   //记录变化
    snapshot.recordModified(state)

    return newData
}
```

会在 `apply` 时通知到观察者 `ApplyObserver`（刚才还提到 writerObserver ），记录下 `changed`:

```kotlin
val unregisterApplyObserver = Snapshot.registerApplyObserver { changed, _ ->
                synchronized(stateLock) {
                    if (_state.value >= State.Idle) {
                        // here
                        snapshotInvalidations += changed
                        deriveStateLocked()
                    } else null
                }?.resume(Unit)
            }
```

`composation` 则会找出观察了对应变化状态的 `scope` 标记为 `invalid` 等待重组：  

```kotlin
 private fun addPendingInvalidationsLocked(values: Set<Any>) {
        var invalidated: HashSet<RecomposeScopeImpl>? = null

        fun invalidate(value: Any) {
            observations.forEachScopeOf(value) { scope ->
                if (
                    !observationsProcessed.remove(value, scope) &&
                    scope.invalidateForResult(value) != InvalidationResult.IGNORED
                ) {
                    val set = invalidated
                        ?: HashSet<RecomposeScopeImpl>().also {
                            invalidated = it
                        }
                    set.add(scope)
                }
            }
        }

        for (value in values) {
            if (value is RecomposeScopeImpl) {
                value.invalidateForResult(null)
            } else {
                invalidate(value)
                derivedStates.forEachScopeOf(value) {
                    invalidate(it)
                }
            }
        }
        invalidated?.let {
            observations.removeValueIf { scope -> scope in it }
        }
    }
```
### 5. 例子⑤
```kotlin
var onlyDisplay = mutableStateOf("onlyDisplay")

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            Text(
                text = onlyDisplay.value,
                fontSize = 50.sp,
            )
            onlyDisplay.value = "Display"
        }
    }
}
```
如果把`state`声明放到`kt`文件最外层，是否会重  
组？

答案是不会，因为在`kotlin`中如果把变量不放到类里，直接放到文件顶层。编译之后其实会生成一个文件，而这个属性则变成`static`的。
```java
public final class MainActivityKt {
       static MutableState<String> onlyDisplay = SnapshotStateKt.mutableStateOf$default("onlyDisplay", null, 2, null);
}
```

因此这个例子就涉及了类的初始化问题：
> 只有主动请求一个类,这个类才会初始化,仅包含静态变量,函数,等静态的东西.  
---
也就是说在这个例子里只有在调用 `onlyDisplay`时，才执行初始化，所以其`state.snapshotId==snapshot.Id` ,此时首次组合尚未执行完毕，本次的`invalidateResult==IGNORE`，也不会记为`modified`，就和例子③ 一样的问题了。
  


  ---
> 以上就是快照系统的使用和` Jetpack Compose` 重组的机制，有任何不正确的地方欢迎指正。