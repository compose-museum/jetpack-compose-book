# System UI Controller for Jetpack Compose

[![Maven Central](https://img.shields.io/maven-central/v/com.google.accompanist/accompanist-systemuicontroller)](https://search.maven.org/search?q=g:com.google.accompanist)

System UI Controller 提供简单易用的方法帮助开发者在  Jetpack Compose 中更新系统栏（Android 平台上指状态栏和导航栏）的颜色。

## 用法
开发者若想在 Compose 布局中控制 System UI，就必须获取 [`SystemUiController`](https://google.github.io/accompanist/api/systemuicontroller/systemuicontroller/com.google.accompanist.systemuicontroller/-system-ui-controller/) 对象。通过该库提供 [`rememberSystemUiController`](https://google.github.io/accompanist/api/systemuicontroller/systemuicontroller/com.google.accompanist.systemuicontroller/remember-system-ui-controller.html) 函数，开发者可以获取当前操作系统（目前仅支持 Android 系统）的  [`SystemUiController`](https://google.github.io/accompanist/api/systemuicontroller/systemuicontroller/com.google.accompanist.systemuicontroller/-system-ui-controller/) 对象。

开发者可以通过如下方式在布局中更新系统栏（Android 平台上指状态栏和导航栏）的颜色：

``` kotlin
// Remember a SystemUiController
val systemUiController = rememberSystemUiController()
val useDarkIcons = MaterialTheme.colors.isLight

SideEffect {
    // Update all of the system bar colors to be transparent, and use
    // dark icons if we're in light theme
    systemUiController.setSystemBarsColor(
        color = Color.Transparent,
        darkIcons = useDarkIcons
    )

    // setStatusBarsColor() and setNavigationBarsColor() also exist
}
```

## 状态栏图标颜色

该库在 Android 平台上使用时，可自动处理 API 版本差异。比如，Android 原生从 API 23 才开始支持状态栏深色图标，那么针对低版本设备，该库通过使用 Scrim 自动调整状态栏颜色以此来保持状态栏整体的对比度：

![](https://google.github.io/accompanist/systemuicontroller/api-scrim.png)

同理，由于Android 原生从 API 26 以后才支持导航栏深色图标，针对低版本设备  `SystemUiController` 也会采用相同的处理方式。

### 调整 Scrim 逻辑

如果开发者对 `SystemUiController`自动处理的颜色不太满意，亦可自行处理：

``` kotlin
systemUiController.setStatusBarsColor(
    color = Color.Transparent,
    darkIcons = true
) { requestedColor ->
    // TODO: return a darkened color to be used when the system doesn't
    // natively support dark icons
}
```

## 示例

 [Insets 示例](https://github.com/google/accompanist/tree/main/sample/src/main/java/com/google/accompanist/sample/insets) 中的透明系统栏（Android 平台上指状态栏和导航栏）都是通过`SystemUiController`实现，若有需要，请自行查阅。

## 下载
[![Maven Central](https://img.shields.io/maven-central/v/com.google.accompanist/accompanist-systemuicontroller)](https://search.maven.org/search?q=g:com.google.accompanist)

```groovy
repositories {
    mavenCentral()
}

dependencies {
    implementation "com.google.accompanist:accompanist-systemuicontroller:<version>"
}
```


每个版本可以在 [快照仓库](https://oss.sonatype.org/content/repositories/snapshots/com/google/accompanist/accompanist-systemuicontroller/) 中被找到，每次提交时都会更新。
