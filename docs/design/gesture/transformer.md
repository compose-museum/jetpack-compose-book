## 1. Transformer 能做什么

<code>transformer</code> 修饰符允许开发者监听 UI 组件的双指拖动、缩放或旋转手势，通过所提供的信息来实现 UI 动画效果。

## 2. Transformer 参数列表

使用 <code>transformer</code> 修饰符至少需要传入一个参数 <code>transformableState</code> 

transformableState：通过使用 `rememberTransformableState` 可以创建一个 `transformableState`, 通过 `rememberTransformableState` 的尾部 lambda 可以获取当前双指拖动、缩放或旋转手势信息。通过 `transformableState` 还允许开发者根据需求动态对 UI 组件进行双指拖动、缩放或旋转操作，最终都会 `rememberTransformableState` 的尾部 lambda 回调。

lockRotationOnZoomPan(可选参数)：当主动设置为 true 时，当UI组件已发生双指拖动或缩放时，将获取不到旋转角度偏移量信息。

```kotlin
fun Modifier.transformable(
    state: TransformableState,
    lockRotationOnZoomPan: Boolean = false,
    enabled: Boolean = true
)
```

## 3. Transformer 使用示例

在本节中，我们将使用 <code>Transformer</code> 修饰符完成方块的双指拖动、缩放、旋转。

首先我们定义了方块的边长、偏移量、比例、旋转角度等信息。

通过 <code>rememberTransformableState</code> 方法获取 TransformableState 实例，通过回调尾部对 lambda 获取到双指拖动、缩放、旋转等手势信息以维护当前 UI 组件的偏移量、比例、旋转角度等状态信息。

```kotlin
var boxSize = 100.dp
var offset by remember { mutableStateOf(Offset.Zero) }
var ratationAngle by remember { mutableStateOf(0f) }
var scale by remember { mutableStateOf(1f) }

var transformableState = rememberTransformableState { zoomChange: Float, panChange: Offset, rotationChange: Float ->
    scale *= zoomChange
    offset += panChange
    ratationAngle += rotationChange
}
```

接下来我们将所创建的 <code>transformableState</code> 传入到 `transformer` 修饰符中。

**注意：由于 Modifer 链式执行，此时需要注意 `offset` 与 `rotate` 调用的先后顺序**

**⚠️示例( offset 在 rotate 前面)**:  一般情况下我们都需要组件在旋转后，当出现双指拖动时组件会跟随手指发生偏移。若 offset 在 rotate 之前调用，则会出现组件旋转后，当双指拖动时组件会以当前旋转角度为基本坐标轴进行偏移。这是由于当你先进行 offset 说明已经发生了偏移，而 rotate 时会改变当前UI组件整个坐标轴，所以出现与预期不符的情况出现。

```kotlin
@Preview
@Composable
fun TransformerDemo() {
    var boxSize = 100.dp
    var offset by remember { mutableStateOf(Offset.Zero) }
    var ratationAngle by remember { mutableStateOf(0f) }
    var scale by remember { mutableStateOf(1f) }

    var transformableState = rememberTransformableState { zoomChange: Float, panChange: Offset, rotationChange: Float ->
        scale *= zoomChange
        offset += panChange
        ratationAngle += rotationChange
    }
    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Box(Modifier
            .size(boxSize)
            .rotate(ratationAngle) // 需要注意 offset 与 rotate 的调用先后顺序
            .offset {
                IntOffset(offset.x.roundToInt(), offset.y.roundToInt())
            }
            .scale(scale)
            .background(Color.Green)
            .transformable(
                state = transformableState,
                lockRotationOnZoomPan = false
            )
        )
    }
}
```

效果展示

<img src = "{{config.assets}}/design/gesture/transformer/demo1.gif" width = "50%" height = "50%">

