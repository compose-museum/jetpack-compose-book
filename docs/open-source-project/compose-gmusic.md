# **[GMusic-Compose-Samples](https://github.com/SakurajimaMaii/GMusic-Compose-Samples)**

## 前言

在学习了 **Jetpack Compose** 后，作为新人的第一个实战项目实现了一个简单的本地音乐播放器

## 项目真机图

<img src="https://img-blog.csdnimg.cn/324026f12c3846ec9f50b2fb52fb8bce.jpg" width="400px" />

<img src="https://img-blog.csdnimg.cn/0576f942c82d4603bc160f38d19b4e96.jpg" width="400px" />

## 主要实现

关于读取本地音乐文件以及控制播放等操作在这里不做过多赘述,可以参考源代码中的 **mainVM.kt** 内的内容,这里主要讲界面的实现

### 搜索框的实现

```kotlin
@ExperimentalAnimationApi
@Composable
fun MainActSV(
    vm: MainViewModel = viewModel()
) {
    // 搜索框可见性
    val visible by vm.expanded.observeAsState(false)

    // 待搜索的歌曲
    var targetSong by rememberSaveable { mutableStateOf("") }

    AnimatedVisibility(
        visible = visible
    ) {
        Surface(
            Modifier.fillMaxWidth(),
            elevation = 8.dp
        ) {
            Row(modifier = Modifier.fillMaxWidth()) {
                TextField(
                    value = targetSong,
                    onValueChange = {
                        targetSong = it
                        vm.searchSong(it)
                    },
                    label = { Text("请输入歌曲名") },
                    modifier = Modifier.fillMaxWidth(),
                    keyboardOptions = KeyboardOptions(
                        keyboardType = KeyboardType.Text,
                        imeAction = ImeAction.Search
                    ),
                    leadingIcon = {
                        Icon(Icons.Filled.Search, "搜索")
                    },
                )
            }
        }
    }
}
```

### 歌曲列表布局

```kotlin
@RequiresApi(Build.VERSION_CODES.R)
@Composable
fun LocalMusicRVItem(localMusicBean: LocalMusicBean, vm: MainViewModel = viewModel()) {

    Column(modifier = Modifier
        .clickable {
            vm.playMusicInMusicBean(localMusicBean)
        }
        .height(IntrinsicSize.Min)) {

        Text(
            localMusicBean.song,
            modifier = Modifier
                .padding(5.dp),
            style = TextStyle(
                fontWeight = FontWeight.Bold,
                fontSize = 20.sp,
                letterSpacing = 0.15.sp,
                color = song_tv_color
            ),
            maxLines = 1
        )

        Row{
            Text(
                localMusicBean.singer,
                modifier = Modifier
                    .padding(5.dp)
                    .wrapContentWidth(Alignment.Start) //作者名在左侧
                    .weight(1f),
                style = TextStyle(
                    color = song_tv_color
                )
            )

            Text(
                localMusicBean.duration,
                modifier = Modifier
                    .padding(5.dp)
                    .wrapContentWidth(Alignment.End) //时间在右侧
                    .weight(1f),
                style = TextStyle(
                    color = song_tv_color
                )
            )
        }
    }
}
```

### 底部控制栏的实现

```kotlin
@RequiresApi(Build.VERSION_CODES.R)
@Composable
fun BottomControlLayout() {

    val localMusicBean: LocalMusicBean by viewModel.localMusicBean.observeAsState(LocalMusicBean())

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(IntrinsicSize.Min)
            .defaultMinSize(0.dp, 80.dp)
            .background(bottom_layout_main_bg_color),
        verticalAlignment = Alignment.CenterVertically
    ) {

        // 歌曲图标
        Box(Modifier.weight(1f), contentAlignment = Alignment.Center) {
            Image(
                painter = painterResource(id = R.drawable.user),
                contentDescription = "歌曲图标",
                modifier = Modifier
                    .clip(CircleShape)
                    .size(60.dp)
                    .wrapContentWidth(Alignment.CenterHorizontally)
            )
        }

        // 歌曲信息
        Column(Modifier.fillMaxWidth().weight(2f)) {
            Text(localMusicBean.song, style = TextStyle(color = Color.White))
            Text(localMusicBean.singer, style = TextStyle(color = Color.White))
        }

        Row(
            Modifier
                .fillMaxWidth()
                .wrapContentWidth(Alignment.CenterHorizontally)
                .weight(2f),
            verticalAlignment = Alignment.CenterVertically, //设置垂直方向对齐
            horizontalArrangement = Arrangement.spacedBy(10.dp) //设置子项的间距
        ) {

            val isPlaying by viewModel.isPlaying.observeAsState(false)

            // 上一首按钮
            Image(painter = painterResource(id = R.drawable.ic_last),
                contentDescription = "上一首",
                modifier = Modifier
                    .clickable { viewModel.playLastMusic() }
                    .size(30.dp)
            )

            // 播放暂停按钮
            Image(painter = if (isPlaying) {
                painterResource(id = R.drawable.ic_pause)
            } else {
                painterResource(id = R.drawable.ic_play)
            },
                contentDescription = "播放或者暂停",
                modifier = Modifier
                    .clickable { viewModel.playCurrentMusic() }
                    .size(40.dp)
            )

            // 下一首按钮
            Image(painter = painterResource(id = R.drawable.ic_next),
                contentDescription = "下一首",
                modifier = Modifier
                    .clickable { viewModel.playNextMusic() }
                    .size(30.dp)
            )
        }
    }
}
```

### 歌曲列表

```kotlin
@Composable
fun MainActRV(
    modifier: Modifier = Modifier,
    vm: MainViewModel = viewModel()
) {
    val targetSong by vm.targetSong.observeAsState(ArrayList<LocalMusicBean>())

    LazyColumn(modifier = modifier.background(Color(0xFFdcdde1))) {
        items(
            items = targetSong
        ){
            LocalMusicRVItem(localMusicBean = it)
        }
    }
}
```

## 项目地址

[GMusic-Compose-Samples](https://github.com/SakurajimaMaii/GMusic-Compose-Samples) 如果项目对你有所帮助,欢迎点赞👍,Star⭐,收藏😍,如果有改进意见还可以提交 issue

## 外部依赖

### [PermissionX](https://github.com/guolindev/PermissionX)

An open source Android library that makes handling runtime permissions extremely easy

### [Android Jetpack Compose 沉浸式/透明状态栏 ProvideWindowInsets SystemUiController](https://blog.csdn.net/sinat_38184748/article/details/119345811)
