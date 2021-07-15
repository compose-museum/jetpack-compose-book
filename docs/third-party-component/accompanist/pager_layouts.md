# Pager layouts

[![Maven Central](https://img.shields.io/maven-central/v/com.google.accompanist/accompanist-systemuicontroller)](https://search.maven.org/search?q=g:com.google.accompanist)

这个库为 Jetpack Compose 提供了 pager 组件，如果你之前使用过 [ViewPager](https://developer.android.com/reference/kotlin/androidx/viewpager/widget/ViewPager)，那么这类组件有着相似的特性。

> ⚠️ 警告
>
> 分页类组件现在还处于试验阶段，相关API随时会发生改变。所有API都被标记了 `@ExperimentalPagerApi` 注解
>
> 

## HorizontalPager

`HorizontalPager` 是其中一种布局，他将所有子项摆放在一条水平行上，允许用户在子项之间水平滑动。

最简单用法如下所示：

<div align="center">
<iframe  width="360" height="492" src="{{config.assets}}/third-party-component/accompanist/pager_layouts/horiz_demo.mp4" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>
</div>

```kotlin
// Display 10 items
val pagerState = rememberPagerState(pageCount = 10)

HorizontalPager(state = pagerState) { page ->
    // Our page content
    Text(
        text = "Page: $page",
        modifier = Modifier.fillMaxWidth()
    )
}
```

如果你想跳转到某一个特定页面，你可以在 `CoroutineScope` 中选择使用 `pagerState.scrollToPage(index)` 或 `pagerState.animateScrollToPage(index)` 二者其一即可。



## VerticalPager

`VerticalPager` 与 `HorizontalPager` 非常相似，他将所有子项摆放在一条垂直列上，允许用户在子项之间垂直滑动。

<div align="center">
<iframe  width="340" height="492" src="{{config.assets}}/third-party-component/accompanist/pager_layouts/vert_demo.mp4" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>
</div>

```kotlin
// Display 10 items
val pagerState = rememberPagerState(pageCount = 10)

VerticalPager(state = pagerState) { page ->
    // Our page content
    Text(
        text = "Page: $page",
        modifier = Modifier.fillMaxWidth()
    )
}
```



## 延迟创建

`HorizontalPager` 与 `VerticalPager` 中的所有页面都是按照布局的要求延迟的组成与布置的。当用户在页面间滑动时，任何不再被需要的页面都会被动态移除。

### 幕后限制

`PagerState` 所提供 API 允许 `initOffscreenLimit` 的设置，这定义了当前页两侧的页数，超过这个限制的页面将会被移除，根据需求重新创建。这个值默认为1，但可以增加以承载更多的内容。

```kotlin
val pagerState = rememberPagerState(
    pageCount = 10,
    initialOffscreenLimit = 2,
)

HorizontalPager(state = pagerState) { page ->
    // ...
}
```



## 子项滚动效果

一个常见的用例是将效果施加到页面子项中，通过滚动来触发这些效果。

[HorizontalPagerTransitionSample ](https://github.com/google/accompanist/blob/main/sample/src/main/java/com/google/accompanist/sample/pager/HorizontalPagerTransitionSample.kt) 示例中演示如何做到这一点。

<div align="center">
<iframe  width="380" height="380" src="{{config.assets}}/third-party-component/accompanist/pager_layouts/transition_demo.mp4" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>
</div>

在 pager 组件的 content scope 中允许开发者很轻松地拿到 `currentPage` 与 `currentPageOffset` 引用。可以使用这些值来计算效果。我们提供了 `calculateCurrentOffsetForPage()` 扩展函数去计算某一个特定页面的偏移量。

```kotlin
import com.google.accompanist.pager.calculateCurrentOffsetForPage

HorizontalPager(state = pagerState) { page ->
    Card(
        Modifier
            .graphicsLayer {
                // Calculate the absolute offset for the current page from the
                // scroll position. We use the absolute value which allows us to mirror
                // any effects for both directions
                val pageOffset = calculateCurrentOffsetForPage(page).absoluteValue

                // We animate the scaleX + scaleY, between 85% and 100%
                lerp(
                    start = 0.85f,
                    stop = 1f,
                    fraction = 1f - pageOffset.coerceIn(0f, 1f)
                ).also { scale ->
                    scaleX = scale
                    scaleY = scale
                }

                // We animate the alpha, between 50% and 100%
                alpha = lerp(
                    start = 0.5f,
                    stop = 1f,
                    fraction = 1f - pageOffset.coerceIn(0f, 1f)
                )
            }
    ) {
        // Card content
    }
}
```



## 页面改变响应

每当选定的页面发生变化时，`PagerState.currentPage` 属性就会更新。你可以使用 `snapshowFlow` 方法去监听改变通过 flow：

```kotlin
LaunchedEffect(pagerState) {
    snapshotFlow { pagerState.currentPage }.collect { page ->
        // Selected page has changed...
    }
}
```



## 指示器

我们还发布了一个名为 `pager-indicators` 的兄弟库，它提供了一些简单指示器组合，供 `HorizontalPager` 和 `VerticalPager` 使用。

[HorizontalPagerWithIndicatorSample](https://github.com/google/accompanist/blob/main/sample/src/main/java/com/google/accompanist/sample/pager/HorizontalPagerWithIndicatorSample.kt) 与 [VerticalPagerWithIndicatorSample ](https://github.com/google/accompanist/blob/snapshot/sample/src/main/java/com/google/accompanist/sample/pager/VerticalPagerWithIndicatorSample.kt) 将向你展示如何去使用这些指示器。

<div align="center">
<iframe  width="358" height="492" src="{{config.assets}}/third-party-component/accompanist/pager_layouts/indicators_demo.mp4" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>
</div>

### 集成Tab

对于 `HorizontalPager` 来说一个常见的用例是被用来与 `TabRow` 或 `ScrollableTabRow` 结合使用。

<div align="center">
<iframe  width="310" height="492" src="{{config.assets}}/third-party-component/accompanist/pager_layouts/tabs_demo.mp4" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>
</div>

在 `pager-indicators`库中提供了一个Modifier修饰符，可以像这样用在 tab 指示器上。

```kotlin
val pagerState = rememberPagerState(pageCount = pages.size)

TabRow(
    // Our selected tab is our current page
    selectedTabIndex = pagerState.currentPage,
    // Override the indicator, using the provided pagerTabIndicatorOffset modifier
    indicator = { tabPositions ->
        TabRowDefaults.Indicator(
            Modifier.pagerTabIndicatorOffset(pagerState, tabPositions)
        )
    }
) {
    // Add tabs for all of our pages
    pages.forEachIndexed { index, title ->
        Tab(
            text = { Text(title) },
            selected = pagerState.currentPage == index,
            onClick = { /* TODO */ },
        )
    }
}

HorizontalPager(state = pagerState) { page ->
    // TODO: page content
}
```

## 用法

```groovy
repositories {
    mavenCentral()
}

dependencies {
    implementation "com.google.accompanist:accompanist-pager:<version>"

    // If using indicators, also depend on 
    implementation "com.google.accompanist:accompanist-pager-indicators:<version>"
}
```



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


每个版本可以在 [快照仓库](https://oss.sonatype.org/content/repositories/snapshots/com/google/accompanist/accompanist-pager/) 中被找到，每次提交时都会更新。

