## Jetpack Compose

要添加对 `Jetpack Compose` 的支持，请导入扩展库：

``` kotlin
implementation("io.coil-kt:coil-compose:1.3.2")
```

然后使用 `rememberImagePainter` 函数去创建一个能被 `Image` 可组合函数绘制的 `ImagePainter`

```kotlin

// 基本使用
Image(
    painter = rememberImagePainter("https://www.example.com/image.jpg"),
    contentDescription = null,
    modifier = Modifier.size(128.dp)
)

// 进阶使用
Image(
    painter = rememberImagePainter(
        data = "https://www.example.com/image.jpg",
        builder = {
            transformations(CircleCropTransformation())
        }
    ),
    contentDescription = null,
    modifier = Modifier.size(128.dp)
)
```

`ImagePainter` 管理图像请求，并根据请求结果的不同分别处理占位、成功和错误等情况的图像绘制。

## Transitions

通过使用 `ImageRequest.Builder.crossfade`，我们可以启用内置的淡入淡出过渡动画效果。

``` kotlin
Image(
    painter = rememberImagePainter(
        data = "https://www.example.com/image.jpg",
        builder = {
            crossfade(true)
        }
    ),
    contentDescription = null,
    modifier = Modifier.size(128.dp)
)
```

自定义的[过渡动画](https://github.com/coil-kt/coil/blob/main/coil-compose-singleton/transitions.md)在 `rememberImagePainter` 下无法使用，因为它们需要 `View` 引用。`CrossfadeTransition` 淡入淡出效果可以正常使用是因为特殊的内部支持。

也就是说，我们只能通过观察 `ImagePainter` 的状态才能在 Compose 中创建自定义过渡动画：

``` kotlin
val painter = rememberImagePainter("https://www.example.com/image.jpg")

val state = painter.state
if (state is ImagePainter.State.Success && state.metadata.dataSource != DataSource.MEMORY_CACHE }) {
    // 执行过渡动画。
}

Image(
    painter = painter,
    contentDescription = null,
    modifier = Modifier.size(128.dp)
)
```

在上面的例子中，当 `ImagePainter` 的状态发生变化时，`composable` 会重新组合。如果图像请求成功并且没有从内存缓存中获得，它将在 `if` 语句中执行动画。

## LocalImageLoader

`Coil` 库还添加了一个伪 `CompositionLocal`（意即类似于），可以从本地中获得 `ImageLoader`。

在大多数情况下，本地的 `ImageLoader` 将是 `ImageLoader` 单例，但是如果有必要，可以使用 `CompositionLocalProvider` 覆盖本地的 `ImageLoader`。


``` kotlin
// 获取
val imageLoader = LocalImageLoader.current

// 设置
CompositionLocalProvider(LocalImageLoader provides ImageLoader(context)) {
    // UI 的其余部分
}
```

!!! note "注意"
    还有一个 `coil-compose-base`，它是 `coil-compose` 的一个子集。它不包含 `LocalImageLoader` 和 `ImageLoader` 单例。

## 从 Accompanist 迁移

`Coil` 的 `Jetpack Compose` 集成是基于 `Accompanist` 的 `Coil` 集成，但有以下变化：

* `rememberCoilPainter` 被重命名为 `rememberImagePainter`，其参数也有变化。
    * `shouldRefetchOnSizeChange` 被替换为 `onExecute`，它对图像请求是否被执行或跳过有更多控制。
    * `requestBuilder` 被改名为 `builder`。
    * `fadeIn` 和 `fadeInDurationMs` 被移除。迁移到 `ImageRequest.Builder.crossfade`（见[Transitions](#transitions)）。
    * `previewPlaceholder` 被移除。如果启用 `inspection` 模式，`ImageRequest.placeholder` 现在会自动使用。
* `LoadPainter` 重命名为 `ImagePainter`。
    * 如果 `onDraw` 没有被调用，`ImagePainter` 不再退回到以根视图的尺寸执行图像请求。如果你在 `Image` 大小不受限制的 `LazyColumn` 中使用 `ImagePainter `，你应该会感受到这个变化。
* `Loader` 和 `rememberLoadPainter` 被移除。
* `LocalImageLoader.current` 是非 null 的，并且默认返回 `ImageLoader` 单例。
* `DrawablePainter` 和 `rememberDrawablePainter` 现在为 `private`。

以下是迁移的示例：

```kotlin
// accompanist-coil
Image(
    painter = rememberCoilPainter(
        request = "https://www.example.com/image.jpg",
        requestBuilder = {
            transformations(CircleCropTransformation())
        },
        shouldRefetchOnSizeChange = ShouldRefetchOnSizeChange { _, _ -> true },
        fadeIn = true,
        previewPlaceholder = R.drawable.placeholder
    ),
    contentDescription = null,
    modifier = Modifier.size(128.dp)
)

// coil-compose
Image(
    painter = rememberImagePainter(
        data = "https://www.example.com/image.jpg",
        onExecute = ExecuteCallback { _, _ -> true },
        builder = {
            crossfade(true)
            placeholder(R.drawable.placeholder)
            transformations(CircleCropTransformation())
        }
    ),
    contentDescription = null,
    modifier = Modifier.size(128.dp)
)
```