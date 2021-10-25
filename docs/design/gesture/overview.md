Compose 提供了多种 API，可帮助您检测用户互动生成的手势。API 涵盖各种用例：

其中一些**级别较高**，旨在覆盖最常用的手势。例如，[`clickable`](https://developer.android.com/reference/kotlin/androidx/compose/foundation/package-summary?hl=zh-cn#clickable(androidx.compose.ui.Modifier,kotlin.Boolean,kotlin.String,androidx.compose.ui.semantics.Role,kotlin.Function0)) 修饰符可用于轻松检测点击，此外它还提供无障碍功能，并在点按时显示视觉指示（例如涟漪）。

还有一些不太常用的手势检测器，它们在**较低级别**提供更大的灵活性，例如 `PointerInputScope.detectTapGestures` 或 `PointerInputScope.detectDragGestures`，但不提供额外功能。