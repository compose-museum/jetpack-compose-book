# AppCompat Theme

[![Maven Central](https://img.shields.io/maven-central/v/com.google.accompanist/accompanist-appcompat-theme)](https://search.maven.org/search?q=g:com.google.accompanist)

这个库将允许开发者将传统 AppCompat XML 主题配置复用到 `Jetpack Compose` 中

Jetpack Compose 的基础主题配置采用 MaterialTheme， 可以通过配置 `Colors` 、`Shapes` 、`Typography` 等参数来定制你的主题效果，具体操作过程与工作原理详见 [主题](../../../design/theme/overview/) 章节。

```kotlin
MaterialTheme(
    typography = type,
    colors = colors,
    shapes = shapes
) {
    // Surface, Scaffold, etc
}
```

AppCompat XML 主题配置允许开发者通过 XML 标签属性进行类似但更粗略的主题设置。

```xml
<style name="Theme.MyApp" parent="Theme.AppCompat.DayNight">
    <item name="colorPrimary">@color/purple_500</item>
    <item name="colorAccent">@color/green_200</item>
</style>
```

这个库尝试拉近 AppCompat XML 主题配置与 Jetpack Compose 主题配置的距离。允许 Jetpack Compose 主题配置 MaterialTheme 可以基于 Activity 的 XML 主题配置。

```kotlin
AppCompatTheme {
    // MaterialTheme.colors, MaterialTheme.shapes, MaterialTheme.typography
    // will now contain copies of the context's theme
}
```

每当你打算将一个现有应用的某个 `UI` 容器迁移至 `Jetpack Compose`，这个库所提供的主题配置能力将会使迁移过程变得非常容易。

> ⚠️ 注意
>
> 如果你在你的应用中使用了 [Material Design Components](https://material.io/develop/android/)， 你应该使用 [MDC Compose Theme Adapter](https://github.com/material-components/material-components-android-compose-theme-adapter)，它将会更精细地读取你的主题配置。



## 定制化主题

通过使用 `AppCompatTheme()` 将会自动读取当前宿主 context 的 AppCompat XML 主题配置，并将其写入到 MaterialTheme 中。 如果你想读取 AppCompat XML 主题配置的数据信息，进行数据修改后再传入 MaterialTheme ，可以使用 `createAppCompatTheme()` 来完成。

```kotlin
val context = LocalContext.current
var (colors, type) = context.createAppCompatTheme()

// Modify colors or type as required. Then pass them
// through to MaterialTheme...

MaterialTheme(
    colors = colors,
    typography = type
) {
    // rest of layout
}
```



## 生成主题

通过一个 AppCompat XML 主题配置来生成 MaterialTheme 其实并不完美，因为 AppCompat XML 主题配置没有提供与 MaterialTheme 相同的定制能力。接下来我们来看看 MaterialTheme 所提供的定制能力。

### Colors

AppCompat XML 主题配置只有一个有限的顶级配色属性集合，这意味着 `AppCompatTheme()` 在一些特定场景中不得不生成一个替代配色。当前属性映射表如下

| MaterialTheme 配色 | AppCompat 配置                                               |
| ------------------ | ------------------------------------------------------------ |
| primary            | `colorPrimary`                                               |
| primaryVariant     | `colorPrimaryDark`                                           |
| onPrimary          | **⚠️Calculated black/white**                                  |
| secondary          | `colorAccent`                                                |
| secondaryVariant   | `colorAccent`                                                |
| onSecondary        | **⚠️Calculated black/white**                                  |
| surface            | Default                                                      |
| onSurface          | `android:textColorPrimary`, else **⚠️calculated black/white** |
| background         | `android:colorBackground`                                    |
| onBackground       | `android:textColorPrimary`, else **⚠️ calculated black/white** |
| error              | `colorError`                                                 |
| onError            | **⚠️Calculated black/white**                                  |

表中所提到的 **⚠️Calculated black/white** ，这意味着当前配色的具体值取决于哪种颜色与相应的背景颜色形成的对比值大。

### Typography

AppCompat XML 主题配置没有提供类似与headline6、body1这种语义上的文本样式表示，而是依赖于特殊组件或使用场景下的文本样式标识。因此，我们从 AppCompat XML 主题配置中能够读取到的唯一事物只有默认的 `app:fontFamily` 或 `android:fontFamily` 。举个例子。

```xml
<style name="Theme.MyApp" parent="Theme.AppCompat">
    <item name="fontFamily">@font/my_font</item>
</style>
```

 Compose 当前还不支持可动态从外部下载的字体，所以主题中的任何字体引用都需要来自你的本地资源。详情查看[这里](https://developer.android.com/guide/topics/resources/font-resource)获取更多有关信息。

### Shape

AppCompat XML 主题配置没有 Shape 主题配置的概念，因此我们使用的是 MaterialTheme 默认的 Shape 主题配置。如果你想提供定制的 Shape 主题配置信息，可以通过 `AppCompatTheme` 的 `shapes` 参数进行配置。



## 局限性

目前该库在实现上还是存在一些局限性的

* 这依赖于你的 Activity / Context 的主题配置是否拓展了某个 AppCompat XML 主题。
* Compose 还不支持 Variable fonts，这意味着 `android:fontVariationSettings` 的值目前被忽略。
* 你可以根据需要在 Compose 中修改产生的MaterialTheme，但这只在Compose中有效。你所做的任何改变都不会反映在 Activity 主题配置中。

## 下载

[![Maven Central](https://img.shields.io/maven-central/v/com.google.accompanist/accompanist-coil)](https://search.maven.org/search?q=g:com.google.accompanist)

```groovy
repositories {
    mavenCentral()
}

dependencies {
    implementation "com.google.accompanist:accompanist-appcompat-theme:<version>"
}
```

每个版本可以在 [快照仓库](https://oss.sonatype.org/content/repositories/snapshots/com/google/accompanist/accompanist-insets/) 中被找到，每次提交时都会更新。
