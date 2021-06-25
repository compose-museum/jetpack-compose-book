# Swipe Refresh for Jetpack Compose

[![Maven Central](https://img.shields.io/maven-central/v/com.google.accompanist/accompanist-systemuicontroller)](https://search.maven.org/search?q=g:com.google.accompanist)

这个库提供了较为常用的滑动刷新组件，类似于传统View系统中的 [SwipeRefreshLayout](https://developer.android.google.cn/reference/androidx/swiperefreshlayout/widget/SwipeRefreshLayout)。

<div align="center">
<iframe  width="380" height="492" src="../../../assets/third-party-component/accompanist/swipe_refresh/demo.mp4" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>
</div>



## 用法

为了能够使用滑动刷新组件，需要使用两个关键API，`SwipeRefresh` 为滑动刷新组件提供了布局信息，`rememberSwipeRefreshState()` 提供了滑动刷新状态信息。

在使用了 ViewModel 的场景下，我们一般这么使用 `SwipeRefresh` 。

```kotlin
val viewModel: MyViewModel = viewModel()
val isRefreshing by viewModel.isRefreshing.collectAsState()

SwipeRefresh(
    state = rememberSwipeRefreshState(isRefreshing),
    onRefresh = { viewModel.refresh() },
) {
    LazyColumn {
        items(30) { index ->
            // TODO: list items
        }
    }
}
```

这个例子的全部信息，包括 ViewModel 的实现可以在[这里](https://github.com/google/accompanist/blob/main/sample/src/main/java/com/google/accompanist/sample/swiperefresh/DocsSamples.kt)被找到。

内容需要是可滚动的，以便 `SwipeRefresh` 能够对滑动手势作出相对应的行为。

像 `LazyColumn` 这类可以通过手势滑动自动进行滚动的组件就是可以的。而像 `Column` 这类固定的组件则不行，对于这类组件你可以提供一个 `Modifier.verticalScroll ` 修饰符为其拓展可滚动的能力。

```kotlin
SwipeRefresh(
    // ...
) {
    Column(Modifier.verticalScroll(rememberScrollState())) {
        // content
    }
}
```

### 无需手势滑动数据刷新

滑动刷新通过一个独立状态进行管理，即使没有手势滑动也可以显示刷新指示器。

下面这个不切实际的例子展示了一个永远在刷新的指示器。

```kotlin
val swipeRefreshState = rememberSwipeRefreshState(true)

SwipeRefresh(
    state = swipeRefreshState,
    onRefresh = { /* todo */ },
) {
    LazyColumn {
        items(30) { index ->
            // TODO: list items
        }
    }
}
```

## 刷新指示器

滑动刷新组件提供了一个默认刷新指示器 `SwipeRefreshIndicator()` ，`SwipeRefresh` 组件中自动使用的就是这个刷新指示器。 当然你也可以定制自己的刷新指示器， 将你的刷新指示器配置 到 `SwipeRefresh` 的 `indicator` 参数即可。

### 定制默认指示器

为实现默认指示器的定制，我们可以提供我们自己的 `indicator` 内容代码块，需要在 `indicator` lambda参数结尾调用`SwipeRefreshIndicator()`，并在其中配置定制化参数。

使用案例参考[这里](https://github.com/google/accompanist/tree/main/sample/src/main/java/com/google/accompanist/sample/flowlayout)

### 定制指示器

正如前文所说，你可以提供你的定制 `indicator` 内容代码块。`SwipeRefreshState` 被提供到`indicator` 内容代码块， 这其中包含了必要信息去实现滑动刷新手势。

定制指示器的例子可以参考[这里](https://github.com/google/accompanist/blob/main/sample/src/main/java/com/google/accompanist/sample/swiperefresh/SwipeRefreshCustomIndicatorSample.kt)

## 下载

[![Maven Central](https://img.shields.io/maven-central/v/com.google.accompanist/accompanist-systemuicontroller)](https://search.maven.org/search?q=g:com.google.accompanist)

```groovy
repositories {
    mavenCentral()
}

dependencies {
    implementation "com.google.accompanist:accompanist-swiperefresh:<version>"
}
```


每个版本可以在 [快照仓库](https://oss.sonatype.org/content/repositories/snapshots/com/google/accompanist/accompanist-swiperefresh/) 中被找到，每次提交时都会更新。

