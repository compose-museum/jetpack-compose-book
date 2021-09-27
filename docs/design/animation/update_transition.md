`updateTransiton` 是 Jetpack Compose 中实现过渡动画的关键 API 。所谓过渡动画，即当依赖的某个状态发生改变时连锁发生的一系列动画效果。前面我们所提到的 `AnimateState` 与 `Animatable` 都是针对一个属性进行变换的，而 `updateTransition` 允许开发者将多个属性数值绑定到一个状态，当这个状态发生改变时，多个属性同时进行变换。 

## 1. 简单使用

接下来我们将介绍过渡动画如果在实际应用场景中如何进行使用，这里我们使用最简单的开关按钮示例展示。

首先，过渡动画是依赖状态的，所以我们首先创建状态类。

```kotlin
sealed class SwitchState {
    object OPEN: SwitchState()
    object CLOSE: SwitchState()
}
```

接下来我们需要创建一个 `MutableState` 表示当前开关的状态。

```kotlin
var selectedState: SwitchState by remember { mutableStateOf(SwitchState.CLOSE) }
```

上述步骤都很简单，接下来我们就需要开始着实准备我们的动画了。为演示方便，这里我们的设计方案是当开关被打开时，文案逐渐消失，于此同时底部逐渐上升选中的标签，就像这样。

<div align="center"><img src = "{{config.assets}}/design/animation/update_transition/update_transition.gif" width = "50%" height = "50%"> </div>

下面我们就需要用到 `updateTransition` 了，通过 API 声明可知，此时需要传入 `targetState` (必须) 和 `label` (可选)。此 API 会返回一个 `Transition` 实例，即该过渡动画的句柄。

```kotlin
@Composable
fun <T> updateTransition(
    targetState: T,
    label: String? = null
): Transition<T> 
```

targetState：过渡动画所依赖的状态。

label：过渡动画的标签。

由于我们的过渡动画依赖开关的选中状态，所以这里依赖之前所创建的 `MutableState` 即可

```kotlin
val transition = updateTransition(selectedState, label = "switch_transition")
```

获取到  `Transition` 实例后，我们就可以创建过渡动画中的所有属性状态了。前面说过当开关被打开时，文案逐渐消失，于此同时底部逐渐上升选中的标签。所以这里需要两个属性状态，`selectBarPadding` 与 `textAlpha`。

我们为每个属性状态声明了其在不同状态时所对应的值，当过度动画所依赖状态发生改变时，其中每个属性状态都会得到相应的更新。

```kotlin
val selectBarPadding by transition.animateDp(transitionSpec = { tween(1000) }, label = "") {
    when (it) {
        SwitchState.CLOSE -> 40.dp
        SwitchState.OPEN -> 0.dp
    }
}
val textAlpha by transition.animateFloat(transitionSpec = { tween(1000)}, label = "") {
    when (it) {
        SwitchState.CLOSE -> 1f
        SwitchState.OPEN -> 0f
    }
}
```

接下来，我们仅需将创建的属性状态应用到我们的组件中即可。

```kotlin
Text(modifier = Modifier.alpha(textAlpha)
  	...
)
Box(modifier = Modifier.padding(top = selectBarPadding)
 		...
)
```

## 2. 完整示例代码

```kotlin
sealed class SwitchState {
    object OPEN: SwitchState()
    object CLOSE: SwitchState()
}

@Composable
fun SwitchBlock(){
    var selectedState: SwitchState by remember { mutableStateOf(SwitchState.CLOSE) }
    val transition = updateTransition(selectedState, label = "switch_transition")
    val selectBarPadding by transition.animateDp(transitionSpec = { tween(1000) }, label = "") {
        when (it) {
            SwitchState.CLOSE -> 40.dp
            SwitchState.OPEN -> 0.dp
        }
    }
    val textAlpha by transition.animateFloat(transitionSpec = { tween(1000) }, label = "") {
        when (it) {
            SwitchState.CLOSE -> 1f
            SwitchState.OPEN -> 0f
        }
    }
    Box(
        modifier = Modifier
            .size(150.dp)
            .padding(8.dp)
            .clip(RoundedCornerShape(10.dp))
            .clickable {
                selectedState = if (selectedState == SwitchState.OPEN) SwitchState.CLOSE else SwitchState.OPEN
            }
    ) {
        Image(
            painter = painterResource(id = R.drawable.flower),
            contentDescription = "node_background",
            contentScale = ContentScale.FillBounds
        )
        Text(
            text = "点我",
            fontSize = 30.sp,
            fontWeight = FontWeight.W900,
            color = Color.White,
            modifier = Modifier
                .align(Alignment.Center)
                .alpha(textAlpha)
        )
        Box(modifier = Modifier
            .align(Alignment.BottomCenter)
            .fillMaxWidth()
            .height(40.dp)
            .padding(top = selectBarPadding)
            .background(Color(0xFF5FB878))
        ) {
            Row(modifier = Modifier
                .align(Alignment.Center)
                .alpha(1 - textAlpha)
            ) {
                Icon(painter = painterResource(id = R.drawable.ic_star), contentDescription = "star", tint = Color.White)
                Spacer(modifier = Modifier.width(2.dp))
                Text(
                    text = "已选择",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.W900,
                    color = Color.White
                )
            }
        }
    }
}
```

