---
hide:
  - navigation # Hide navigation
  - toc        # Hide table of contents
---

```kotlin
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.ExperimentalAnimationApi
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Settings
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp

@ExperimentalAnimationApi
@Composable
fun MyBottomNavigation() {

    var selectedItem by remember{ mutableStateOf(0) }

    BottomNavigation(
        backgroundColor = Color.White
    ) {
        for(index in 0..2 ) {
            Column(
                modifier = Modifier
                    .fillMaxHeight()
                    .weight(1f)
                    .clickable(
                        onClick = {
                            selectedItem = index
                        },
                        indication = null,
                        interactionSource = MutableInteractionSource()
                    ),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                NavigationIcon(index, selectedItem)
                Spacer(Modifier.padding(top = 2.dp))
                AnimatedVisibility(visible = index == selectedItem) {
                    Surface(shape = CircleShape, modifier = Modifier.size(5.dp),color = Color(0xFF252527)) { }
                }
            }
        }
    }
}

@Composable
fun NavigationIcon(
    index:Int,
    selectedItem:Int
){
    val alpha = if (selectedItem != index ) 0.5f else 1f

    CompositionLocalProvider(LocalContentAlpha provides alpha) {
        when(index){
            0 -> Icon(Icons.Filled.Home, contentDescription = null)
            1 -> Icon(painterResource(R.drawable.musicnote), contentDescription = null)
            else -> Icon(Icons.Filled.Settings, contentDescription = null)
        }
    }
}
```
