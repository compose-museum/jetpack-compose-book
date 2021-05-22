
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
fun BottomNavigationItem(viewModel:UiState){
    BottomNavigation(
        backgroundColor = Color.White
    ) {
        for(index in 0..2 ){
            Column(
                modifier = Modifier
                    .fillMaxHeight()
                    .weight(1f)
                    .clickable(
                        onClick = {
                            viewModel.selectedItem = index
                        },
                        indication = null,
                        interactionSource = MutableInteractionSource()
                    ),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                NavigationIcon(index, viewModel)
                Spacer(Modifier.padding(top = 2.dp))
                AnimatedVisibility(visible = index == viewModel.selectedItem) {
                    Surface(shape = CircleShape, modifier = Modifier.size(5.dp),color = Color(0xFF252527)) {

                    }
                }
            }
        }
    }
}

@Composable
fun NavigationIcon(
    index:Int,
    viewModel: UiState
){
    val alpha = if(viewModel.selectedItem != index){
        0.5f
    } else 1f

    CompositionLocalProvider(LocalContentAlpha provides alpha) {
        when(index){
            0 -> Icon(Icons.Filled.Home, contentDescription = null)
            1 -> Icon(painterResource(R.drawable.musicnote), contentDescription = null)
            else -> Icon(Icons.Filled.Settings, contentDescription = null)
        }
    }
}
