package com.github.nthily.compose_example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.BottomNavigation
import androidx.compose.material.BottomNavigationItem
import androidx.compose.material.ButtonDefaults
import androidx.compose.material.ExperimentalMaterialApi
import androidx.compose.material.Icon
import androidx.compose.material.IconButton
import androidx.compose.material.ListItem
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Scaffold
import androidx.compose.material.ScaffoldState
import androidx.compose.material.Text
import androidx.compose.material.TextButton
import androidx.compose.material.TopAppBar
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.rememberScaffoldState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import com.github.nthily.compose_example.ui.theme.ComposeExampleTheme
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ComposeExampleTheme {
                AppScaffold()
            }
        }
    }
}

@Composable
fun AppScaffold() {

    val scaffoldState = rememberScaffoldState()
    val scope = rememberCoroutineScope()

    var selectedItem by remember { mutableStateOf(0) }
    val items = listOf("主页", "我喜欢的", "设置")

    Scaffold(
        topBar = {
            TopAppBar(
                navigationIcon = {
                    IconButton(
                        onClick = {
                            scope.launch {
                                scaffoldState.drawerState.open()
                            }
                        }
                    ) {
                        Icon(Icons.Filled.Menu, null)
                    }
                },
                title = {
                    Text("魔卡沙的炼金工坊")
                }
            )
        },
        bottomBar = {
            BottomNavigation {
                BottomNavigation {
                    items.forEachIndexed { index, item ->
                        BottomNavigationItem(
                            icon = {
                                when(index){
                                    0 -> Icon(Icons.Filled.Home, contentDescription = null)
                                    1 -> Icon(Icons.Filled.Favorite, contentDescription = null)
                                    else -> Icon(Icons.Filled.Settings, contentDescription = null)
                                }
                            },
                            label = { Text(item) },
                            selected = selectedItem == index,
                            onClick = { selectedItem = index }
                        )
                    }
                }
            }
        },
        drawerContent = {
            AppDrawerContent(scaffoldState, scope)
        },
        scaffoldState = scaffoldState
    ) {
        AppContent(item = items[selectedItem])
    }
}

@Composable
fun AppContent(
    item: String
) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Text("当前界面是 $item")
    }
}

@OptIn(ExperimentalMaterialApi::class)
@Composable
fun AppDrawerContent(
    scaffoldState: ScaffoldState,
    scope: CoroutineScope
) {

    Box {
        Image(
            painter = painterResource(id = R.drawable.background),
            contentDescription = null
        )
        Column(
            modifier = Modifier.padding(15.dp)
        ) {
            Image(
                painter = painterResource(id = R.drawable.avatar),
                contentDescription = null,
                modifier = Modifier
                    .clip(CircleShape)
                    .size(65.dp)
                    .border(BorderStroke(1.dp, Color.Gray), CircleShape)
            )
            Spacer(Modifier.padding(vertical = 8.dp))
            Text(
                text = "游客12345",
                style = MaterialTheme.typography.body2
            )
        }
    }

    ListItem(
        icon = {
            Icon(Icons.Filled.Home, null)
        },
        modifier = Modifier
            .clickable {

            }
    ) {
        Text("首页")
    }

    Box(
        modifier = Modifier.fillMaxHeight(),
        contentAlignment= Alignment.BottomStart
    ) {
        TextButton(
            onClick = { /*TODO*/ },
            colors = ButtonDefaults.textButtonColors(contentColor = MaterialTheme.colors.onSurface),
        ) {
            Icon(Icons.Filled.Settings, null)
            Text("设置")
        }
    }

    BackHandler(enabled = scaffoldState.drawerState.isOpen) {
        scope.launch {
            scaffoldState.drawerState.close()
        }
    }
}
