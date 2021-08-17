## 版本 1.1.0-alpha01

发布时间：2021 年 8 月 4 日

内容：

### androidx.compose.material

发布了 `androidx.compose.material:material-*:1.1.0-alpha01`, [提交内容](https://android.googlesource.com/platform/frameworks/support/+log/1a3ba62b97c98d85f6c0ac2fb6483fc9ac60872e..d725303accfa9be6d5c3d61c7603ed1b9a780cbd/compose/material)

API 变更

* 更新了 `DrawScope#drawImage` 方法，该方法会使用来源和目的地 rect 来使用可选的 FilterQuality 参数。对于想要在针对基于像素的艺术作品扩大时呈现像素化风格的像素艺术作品而言，此变更非常有用。更新了 BitmapPainter + Image 可组合项，使其也使用可选的 FilterQuality 参数（[Ie4fb0](https://android-review.googlesource.com/#/q/Ie4fb04013701add0fba1c5c6bb9da2812d6436e7)、[b/180311607](https://issuetracker.google.com/issues/180311607)）

* 已将 BadgeBox 重命名为 BadgedBox，更改了相关参数以接受 Badge 可组合项。添加了 Badge 组件，它是 BadgedBox 的典型标记内容。([I639c6](https://android-review.googlesource.com/#/q/I639c692b5fe86e8aabfb01df2020114ea13b4912))

* 添加了 NavigationRail 组件；请查看相关文档和示例，了解使用信息 ([I8de77](https://android-review.googlesource.com/#/q/I8de77279455344ff38bd4d04ba3c30e3c0dda0fb))

bug 修复

* 添加了底部对齐的 NavigationRail 示例和 Catalog 应用演示。([I3cffc](https://android-review.googlesource.com/#/q/I3cffc68a7a8d6591f2d59bb407f23b1ebe43361b))
* 对话框现在根据平台大小调整行为进行调整。将 usePlatformDefaultWidth 设为 false 可替换此行为。（[Iffaed](https://android-review.googlesource.com/#/q/Iffaedb8890f59627a58fb4f33d06044ac120fd7d)、[b/192682388](https://issuetracker.google.com/issues/192682388)）
* 向目录应用添加了 navigation-rail 演示。([I04960](https://android-review.googlesource.com/#/q/I0496024f7358b4accbb5e62e3198a6ead14c685e))
* 向目录应用添加了标记演示。([If285d](https://android-review.googlesource.com/#/q/If285dd945a8e32efeb6ba912eb6bc535554ca140))

### androidx.compose.runtime

发布了 `androidx.compose.runtime:runtime-*:1.1.0-alpha01`, [提交内容](https://android.googlesource.com/platform/frameworks/support/+log/1a3ba62b97c98d85f6c0ac2fb6483fc9ac60872e..d725303accfa9be6d5c3d61c7603ed1b9a780cbd/compose/runtime)

### androidx.compose.ui

发布了 `androidx.compose.ui:ui-*:1.1.0-alpha01`。[提交内容](https://android.googlesource.com/platform/frameworks/support/+log/1a3ba62b97c98d85f6c0ac2fb6483fc9ac60872e..d725303accfa9be6d5c3d61c7603ed1b9a780cbd/compose/ui)。

API 变更

* 现在，`RelocationRequester.bringIntoView` 可以接受矩形作为参数，这让我们可以将可组合项的一部分呈现在视图中。（[Ice2c5](https://android-review.googlesource.com/#/q/Ice2c55d582bbeb80757cf30e2334bb970a31f438)、[b/194330245](https://issuetracker.google.com/issues/194330245)）
* `AnimatedImageVector` 和相关 API 现在位于新的 `androidx.compose.animation:animation-graphics` 模块中。([I60873](https://android-review.googlesource.com/#/q/I6087391a9869d2315a71422f24175f42ec085681))
* 添加了实验性修饰符来处理重定位请求。（[I65a97](https://android-review.googlesource.com/#/q/I65a97bd7fca7271781efe31fcc9cb387e9857b51)、[b/178211874](https://issuetracker.google.com/issues/178211874)）
* 引入了 BrushPainter API，以便支持在 Painter 中绘制任意 Brush（类似于 ColorPainter）。

更新了 Brush API，以使其具有一个在 BrushPainter 中查询的固有尺寸参数（[Ia2752](https://android-review.googlesource.com/#/q/Ia27529070e6f2acdac9d2c73f41e886b36452f34)、[b/189466433](https://issuetracker.google.com/issues/189466433)）

* 已将消耗来源和目标 rect 的 DrawScope#drawImage 方法更新为消耗可选的 FilterQuality 参数。对于在针对基于像素的 ART 进行放大时会像素化的像素 ART，这非常有用。已将 BitmapPainter + Image 可组合项更新为还可以消耗可选的 FilterQuality 参数（[Ie4fb0](https://android-review.googlesource.com/#/q/Ie4fb04013701add0fba1c5c6bb9da2812d6436e7)、[b/180311607](https://issuetracker.google.com/issues/180311607)）

* 添加了 `GestureScope.advanceEventTime` 方法，以便更好地控制手势中事件的时间设置 ([Ibf3e2](https://android-review.googlesource.com/#/q/Ibf3e2d35b4462863aa0de010cb2d0fe0d10cd3d1))

bug 修复

* 为了更好地支持链接绘制修饰符，请确保 Modifier.paint 实现会调用 drawsContent。以前，Modifier.paint 需要是修饰符链的叶节点，但是这样做会妨碍在可组合容器（如方框）上对其进行配置，或在其上添加其他装饰（如 `Modifier.paint().border()`）。通过让 Modifier.paint 在绘制指定 Painter 的内容后调用 drawContent，我们可以在具有修饰符格式的行为中实现更好的行为一致性。（[Ibb2a7](https://android-review.googlesource.com/#/q/Ibb2a7ae54a86643ba4fc1604ce39df7477ab66f0)、[b/178201337](https://issuetracker.google.com/issues/178201337)、[b/186213275](https://issuetracker.google.com/issues/186213275)）
* 对话框现在根据平台大小调整行为进行调整。将 `usePlatformDefaultWidth` 设为 false 可替换此行为。（[Iffaed](https://android-review.googlesource.com/#/q/Iffaedb8890f59627a58fb4f33d06044ac120fd7d)、[b/192682388](https://issuetracker.google.com/issues/160602714)）
* 将 `InfiniteAnimationPolicy` 移到了 :compose:ui（[I5eb09](https://android-review.googlesource.com/#/q/I5eb09c7aa24a85fd2e66cc9b84ea6c906dc5210a)、[b/160602714](https://issuetracker.google.com/issues/160602714)）
* 现在，通过延迟列表和常规滚动组件的语义操作执行滚动已具有动画效果（[Id9066](https://android-review.googlesource.com/#/q/Id9066420fd80bbea3c0463813be0338fff017514)、[b/190742024](https://issuetracker.google.com/issues/190742024)）


## 版本 1.0.1

发布时间：2021 年 8 月 4 日

内容：

发布了

* [`androidx.compose.material:material-*:1.0.1`](https://android.googlesource.com/platform/frameworks/support/+log/7077236bd50d5bf31068c8ac40302765010a0e56..c076d3eb651533329571facecfb54dc72e1b0fc4/compose/material)
* [`androidx.compose.ui:ui-*:1.0.1`](https://android.googlesource.com/platform/frameworks/support/+log/7077236bd50d5bf31068c8ac40302765010a0e56..c076d3eb651533329571facecfb54dc72e1b0fc4/compose/ui)
* [`androidx.compose.runtime:runtime-*:1.0.1`](https://android.googlesource.com/platform/frameworks/support/+log/7077236bd50d5bf31068c8ac40302765010a0e56..c076d3eb651533329571facecfb54dc72e1b0fc4/compose/runtime)

依赖性更新：更新为依赖于 Kotlin `1.5.21`



## 版本 1.0.0

发布时间：2021 年 7 月 28 日

内容：

发布了 

* [`androidx.compose.animation:animation:1.0.0 `](https://android.googlesource.com/platform/frameworks/support/+log/abcc318573114e39365e63de4bea7736a81491af..7077236bd50d5bf31068c8ac40302765010a0e56/compose/animation), [`androidx.compose.animation:animation-core:1.0.0`](https://android.googlesource.com/platform/frameworks/support/+log/abcc318573114e39365e63de4bea7736a81491af..7077236bd50d5bf31068c8ac40302765010a0e56/compose/animation)
* [`androidx.compose.compiler:compiler:1.0.0`](https://android.googlesource.com/platform/frameworks/support/+log/abcc318573114e39365e63de4bea7736a81491af..7077236bd50d5bf31068c8ac40302765010a0e56/compose/compiler/compiler)
* [`androidx.compose.foundation:foundation:1.0.0`](https://android.googlesource.com/platform/frameworks/support/+log/abcc318573114e39365e63de4bea7736a81491af..7077236bd50d5bf31068c8ac40302765010a0e56/compose/foundation), [`androidx.compose.foundation:foundation-layout:1.0.0`](https://android.googlesource.com/platform/frameworks/support/+log/abcc318573114e39365e63de4bea7736a81491af..7077236bd50d5bf31068c8ac40302765010a0e56/compose/foundation)
* [`androidx.compose.runtime:runtime-*:1.0.0`](https://android.googlesource.com/platform/frameworks/support/+log/abcc318573114e39365e63de4bea7736a81491af..7077236bd50d5bf31068c8ac40302765010a0e56/compose/runtime)
* [`androidx.compose.ui:ui-*:1.0.0`](https://android.googlesource.com/platform/frameworks/support/+log/abcc318573114e39365e63de4bea7736a81491af..7077236bd50d5bf31068c8ac40302765010a0e56/compose/ui)
* [`androidx.compose.material:material-*:1.0.0`](https://android.googlesource.com/platform/frameworks/support/+log/abcc318573114e39365e63de4bea7736a81491af..7077236bd50d5bf31068c8ac40302765010a0e56/compose/material)

这是 Compose 的第一个稳定版本，具体参阅[博客](https://android-developers.googleblog.com/2021/07/jetpack-compose-announcement.html)

已知问题

如果您使用的是 `Android Studio Bumblebee Canary 4` 或 `AGP 7.1.0-alpha04/7.1.0-alpha05`，可能会遇到以下崩溃问题：

``` kotlin
java.lang.AbstractMethodError: abstract method "void androidx.lifecycle.DefaultLifecycleObserver.onCreate(androidx.lifecycle.LifecycleOwner)"
```

如需修复此崩溃问题，请暂时将 build.gradle 文件中的 minSdkVersion 提高到 24 及以上。或者升级到最新的 Android Studio，以及使用 AGP 7.1.0-alpha06 及其以上版本


