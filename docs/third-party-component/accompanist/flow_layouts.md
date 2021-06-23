# Jetpack Compose Flow Layouts

[![Maven Central](https://img.shields.io/maven-central/v/com.google.accompanist/accompanist-systemuicontroller)](https://search.maven.org/search?q=g:com.google.accompanist)

这个库提供了 Jetpack Compose 版本的流式布局，与标准 Row 组件与 Column 组件不同的是，这个组件的子元素在排列时如果出现可用空间不足的情况会自动拓展为多行或多列。

## 用法

``` kotlin
FlowRow {
    // row contents
}

FlowColumn {
    // column contents
}
```

使用案例参考[这里](https://github.com/google/accompanist/tree/main/sample/src/main/java/com/google/accompanist/sample/flowlayout)

## 下载

[![Maven Central](https://img.shields.io/maven-central/v/com.google.accompanist/accompanist-systemuicontroller)](https://search.maven.org/search?q=g:com.google.accompanist)

```groovy
repositories {
    mavenCentral()
}

dependencies {
    implementation "com.google.accompanist:accompanist-flowlayout:<version>"
}
```


每个版本可以在 [快照仓库](https://oss.sonatype.org/content/repositories/snapshots/com/google/accompanist/accompanist-flowlayout/) 中被找到，每次提交时都会更新。

