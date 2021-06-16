# Glide for Jetpack Compose

[![Maven Central](https://img.shields.io/maven-central/v/com.google.accompanist/accompanist-glide)](https://search.maven.org/search?q=g:com.google.accompanist)

该库提供了简单易用的 [Painter](https://developer.android.google.cn//reference/kotlin/androidx/compose/ui/graphics/painter/Painter)，它可以使用 [Glide]( https://bumptech.github.io/glide/) 图像加载库获取并显示外部图像（例如网络图像等）。

<img src="https://github.com/bumptech/glide/blob/master/static/glide_logo.png?raw=true" width="480" alt="Glide logo">

> 小提示：
>
> 若非必要，建议使用 [Coil](https://google.github.io/accompanist/coil/)。 Coil 是基于 Kotlin 协程实现的，这就意味着它可以更好地与 Jetpack Compose 集成，因为后者也大量地使用了协程。

## `rememberGlidePainter()`

主要 API  [`rememberGlidePainter()`](https://google.github.io/accompanist/api/glide/glide/com.google.accompanist.glide/remember-glide-painter.html) 的最简单用法如下：

```kotlin 
import androidx.compose.foundation.Image
import com.google.accompanist.glide.rememberGlidePainter

Image(
    painter = rememberGlidePainter(
        request = "https://picsum.photos/300/300",
        previewPlaceholder = R.drawable.placeholder
    ),
    contentDescription = stringResource(R.string.image_content_desc)
)
```

`painter`使用 [Glide](https://bumptech.github.io/glide/) 加载传入的数据，然后绘制结果图像。

开发者也可以通过 `requestBuilder` 参数来自定义  `Glide` 的[`RequestBuilder`](https://bumptech.github.io/glide/javadocs/4110/com/bumptech/glide/RequestBuilder.html)。

## 淡入动画

该库内置支持图像加载过程中的[淡入动画](https://material.io/archive/guidelines/patterns/loading-images.html)。

![](../../assets/third-party-component/accompanist/coil/crossfade.gif)

[`rememberGlidePainter`](https://google.github.io/accompanist/api/glide/glide/com.google.accompanist.glide/remember-glide-painter.html) 的函数参数 `fadeIn:Boolean` 默认为 `false`，当 `fadeIn = true` 时，一个默认的淡入动画将出现在图片成功加载过程中。

``` kotlin
import androidx.compose.foundation.Image
import com.google.accompanist.glide.rememberGlidePainter

Image(
    painter = rememberGlidePainter(
        "https://picsum.photos/300/300",
        fadeIn = true
    ),
    contentDescription = stringResource(R.string.image_content_desc),
)
```

## 自定义内容

有时开发者可能希望在图片加载时显示占位图片或者在图片加载失败时显示失败提示图片，`rememberGlidePainter()`返回的`painter`是 的一个[`LoadPainter`](https://google.github.io/accompanist/api/imageloading-core/imageloading-core/com.google.accompanist.imageloading/-load-painter/index.html)实例，[`ImageLoadState`](https://google.github.io/accompanist/api/imageloading-core/imageloading-core/com.google.accompanist.imageloading/-image-load-state/index.html) 有四种状态：`Empty`、`Loading`、`Success` 和 `Error`，分别对应着初始状态、加载状态、加载成功和加载失败。开发者可以根据需要显示不同的内容：


``` kotlin
val painter = rememberGlidePainter("https://picsum.photos/300/300")

Box {
    Image(
        painter = painter,
        contentDescription = stringResource(R.string.image_content_desc),
    )

    when (painter.loadState) {
        is ImageLoadState.Loading -> {
            // Display a circular progress indicator whilst loading
            CircularProgressIndicator(Modifier.align(Alignment.Center))
        }
        is ImageLoadState.Error -> {
            // If you wish to display some content if the request fails
        }
    }
}
```

## 预览

为了支持 Android Studio 的  [Composable Previews](https://developer.android.google.cn/jetpack/compose/tooling) 功能，开发者可以通过 `previewPlaceholder` 参数传入一个图片资源 ID ，以便 Android Studio 预览布局时有图片展示：

```kotlin
Image(
    painter = rememberGlidePainter(
        request = "https://picsum.photos/300/300",
        previewPlaceholder = R.drawable.placeholder,
    ),
    contentDescription = stringResource(R.string.image_content_desc),
)
```

如果引用的 drawable 仅用于 `previewPlaceholder`，则可以将其放置在 `debug` 构建变体的资源中，例如：`app/debug/res/drawable/`，通过这种操作将 drawable 捆绑在调试版本中，同时也将其排除至发布版本外。

## GIF

Accompanist Glide 通过 Glide 内置 GIF 支持实现 GIF 图片加载。默认支持，无需额外配置。

![Example GIF](https://media.giphy.com/media/6oMKugqovQnjW/giphy.gif)

## 观察加载状态变化

开发者可以使用 [`snapshotFlow()`](https://developer.android.google.cn/reference/kotlin/androidx/compose/runtime/package-summary#snapshotflow) 来观察 `painter.loadState`的变化情况，以此实现对图片加载状态的监听，然后根据需要调整代码逻辑：

``` kotlin
val painter = rememberGlidePainter("https://image.url")

LaunchedEffect(painter) {
    snapshotFlow { painter.loadState }
        .filter { it.isFinalState() }
        .collect { result ->
            // TODO do something with result
        }
}

Image(painter = painter)
```

## 自定义 RequestManager

如果开发者希望在所有`rememberGlidePainter()` 调用中使用同一个默认的 [`RequestManager`](https://bumptech.github.io/glide/javadocs/4120/com/bumptech/glide/RequestManager.html) ，就请使用 [`LocalRequestManager`](https://google.github.io/accompanist/api/glide/glide/com.google.accompanist.glide/-local-request-manager.html)。

示例如下：

``` kotlin
val requestManager = Glide.with(...)
    // customize the RequestManager as needed
    .build()

CompositionLocalProvider(LocalRequestManager provides requestManager) {
    // This will automatically use the value of LocalRequestManager
    Image(
        painter = rememberGlidePainter(...)
    )
}
```

更多有关 `CompositionLocal` 的信息，请参见[此处](https://developer.android.google.cn/reference/kotlin/androidx/compose/runtime/CompositionLocal)。

## 下载

[![Maven Central](https://img.shields.io/maven-central/v/com.google.accompanist/accompanist-glide)](https://search.maven.org/search?q=g:com.google.accompanist)

```groovy
repositories {
    mavenCentral()
}

dependencies {
    implementation "com.google.accompanist:accompanist-glide:<version>"
}
```

每个版本可以在 [快照仓库](https://oss.sonatype.org/content/repositories/snapshots/com/google/accompanist/accompanist-glide/) 中被找到，每次提交时都会更新。

