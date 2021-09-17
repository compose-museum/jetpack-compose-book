# 注意，此库已被迁移至 Coil 官网库中，这里不再维护

详情请看：

[Coil 官网](https://coil-kt.github.io/coil/compose/) 

[本手册](https://docs.compose.net.cn/third-party-component/coil)

————————————————————————————————————————————————

## Coil for Jetpack Compose

[![Maven Central](https://img.shields.io/maven-central/v/com.google.accompanist/accompanist-coil)](https://search.maven.org/search?q=g:com.google.accompanist)

该库提供了简单易用的 [Painter](https://developer.android.google.cn//reference/kotlin/androidx/compose/ui/graphics/painter/Painter)，它可以使用 [Coil](https://github.com/coil-kt/coil) 图像加载库获取并显示外部图像（例如网络图像等）。

<img src="https://coil-kt.github.io/coil/logo.svg" width="480" alt="Coil logo">

## `rememberCoilPainter()`

主要 API  [`rememberCoilPainter()`](https://google.github.io/accompanist/api/coil/coil/com.google.accompanist.coil/remember-coil-painter.html) 的最简单用法如下：

```kotlin 
import androidx.compose.foundation.Image
import com.google.accompanist.coil.rememberCoilPainter

Image(
    painter = rememberCoilPainter("https://picsum.photos/300/300"),
    contentDescription = stringResource(R.string.image_content_desc),
)
```

`painter`使用 [Coil](https://github.com/coil-kt/coil) 加载传入的数据，然后绘制结果图像。

开发者也可以通过 `requestBuilder` 参数来自定义  `Coil` 的[`ImageRequest`](https://coil-kt.github.io/coil/image_requests/)。通过这种方式开发者可以实现如`CircleCropTransformation`、`BlurTransformation`、`GrayscaleTransformation`、`RoundedCornersTransformation` 等 `transformations` 之类的效果：

```kotlin
import androidx.compose.foundation.Image
import com.google.accompanist.coil.rememberCoilPainter

Image(
    painter = rememberCoilPainter(
        request = "https://picsum.photos/300/300",
        requestBuilder = {
            transformations(CircleCropTransformation())
        },
    ),
    contentDescription = stringResource(R.string.image_content_desc),
)
```

## 淡入动画

该库内置支持图像加载过程中的[淡入动画](https://material.io/archive/guidelines/patterns/loading-images.html)。

![]({{config.assets}}/third-party-component/accompanist/coil/crossfade.gif)

[`rememberCoilPainter`](https://google.github.io/accompanist/api/coil/coil/com.google.accompanist.coil/remember-coil-painter.html) 的函数参数 `fadeIn:Boolean` 默认为 `false`，当 `fadeIn = true` 时，一个默认的淡入动画将出现在图片成功加载过程中。

``` kotlin
import androidx.compose.foundation.Image
import com.google.accompanist.coil.rememberCoilPainter

Image(
    painter = rememberCoilPainter(
        "https://picsum.photos/300/300",
        fadeIn = true
    ),
    contentDescription = stringResource(R.string.image_content_desc),
)
```

## 自定义内容

有时开发者可能希望在图片加载时显示占位图片或者在图片加载失败时显示失败提示图片，`rememberCoilPainter()`返回的`painter`是 的一个[`LoadPainter`](https://google.github.io/accompanist/api/imageloading-core/imageloading-core/com.google.accompanist.imageloading/-load-painter/index.html)实例，[`ImageLoadState`](https://google.github.io/accompanist/api/imageloading-core/imageloading-core/com.google.accompanist.imageloading/-image-load-state/index.html) 有四种状态：`Empty`、`Loading`、`Success` 和 `Error`，分别对应着初始状态、加载状态、加载成功和加载失败。开发者可以根据需要显示不同的内容：


``` kotlin
val painter = rememberCoilPainter("https://picsum.photos/300/300")

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
    painter = rememberCoilPainter(
        request = "https://picsum.photos/300/300",
        previewPlaceholder = R.drawable.placeholder,
    ),
    contentDescription = stringResource(R.string.image_content_desc),
)
```

如果引用的 drawable 仅用于 `previewPlaceholder`，则可以将其放置在 `debug` 构建变体的资源中，例如：`app/debug/res/drawable/`，通过这种操作将 drawable 捆绑在调试版本中，同时也将其排除至发布版本外。

## GIF

Accompanist Coil 通过 Coil 内置 GIF 支持实现 GIF 图片加载。具体配置参考 Coil 库的[配置说明](https://coil-kt.github.io/coil/gifs/)。

## 观察加载状态变化

开发者可以使用[`snapshotFlow()`](https://developer.android.google.cn/reference/kotlin/androidx/compose/runtime/package-summary#snapshotflow)来观察 `painter.loadState`的变化情况，以此实现对图片加载状态的监听，然后根据需要调整代码逻辑：

``` kotlin
val painter = rememberCoilPainter("https://image.url")

LaunchedEffect(painter) {
    snapshotFlow { painter.loadState }
        .filter { it.isFinalState() }
        .collect { result ->
            // TODO do something with result
        }
}

Image(painter = painter)
```

## 自定义 ImageLoader 

如果开发者希望在所有`rememberCoilPainter()` 调用中使用同一个默认的[`ImageLoader`](https://coil-kt.github.io/coil/image_loaders/)，就请使用 [`LocalImageLoader`](https://google.github.io/accompanist/api/coil/coil/com.google.accompanist.coil/-local-image-loader.html) 。

示例如下：

``` kotlin
val imageLoader = ImageLoader.Builder(context)
    // customize the ImageLoader as needed
    .build()

CompositionLocalProvider(LocalImageLoader provides imageLoader) {
    // This will automatically use the value of LocalImageLoader
    Image(
        painter = rememberCoilPainter(...)
    )
}
```

更多有关 `CompositionLocal` 的信息，请参见[此处](https://developer.android.google.cn/reference/kotlin/androidx/compose/runtime/CompositionLocal)。

## 下载

[![Maven Central](https://img.shields.io/maven-central/v/com.google.accompanist/accompanist-coil)](https://search.maven.org/search?q=g:com.google.accompanist)

```groovy
repositories {
    mavenCentral()
}

dependencies {
    implementation "com.google.accompanist:accompanist-coil:<version>"
}
```

每个版本可以在 [快照仓库](https://oss.sonatype.org/content/repositories/snapshots/com/google/accompanist/accompanist-coil/) 中被找到，每次提交时都会更新。

