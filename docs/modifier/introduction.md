关于 `Modifier` 的方法有很多，这里打算将大部分的方法介绍出来方便查阅大家查阅

## 1. `Modifier.fillMaxSize()`

默认将当前的 `@Composable` 填满整个父布局
当调用 `Modifier.fillMaxSize(0.5f)` 时则填满一半

``` kotlin
@Stable
@Suppress("ModifierInspectorInfo")
fun Modifier.fillMaxSize(/*@FloatRange(from = 0.0, to = 1.0)*/ fraction: Float = 1f) =
    this.then(if (fraction == 1f) FillWholeMaxSize else createFillSizeModifier(fraction))
```

## 2. `Modifier.size()`

设置当前 `@Composable` 的大小

``` kotlin
@Stable
fun Modifier.size(size: Dp) = this.then(
    SizeModifier(
        minWidth = size,
        maxWidth = size,
        minHeight = size,
        maxHeight = size,
        enforceIncoming = true,
        inspectorInfo = debugInspectorInfo {
            name = "size"
            value = size
        }
    )
)
```

``` kotlin
@Stable
fun Modifier.size(width: Dp, height: Dp) = this.then(
    SizeModifier(
        minWidth = width,
        maxWidth = width,
        minHeight = height,
        maxHeight = height,
        enforceIncoming = true,
        inspectorInfo = debugInspectorInfo {
            name = "size"
            properties["width"] = width
            properties["height"] = height
        }
    )
)
```