var text by remember { mutableStateOf("") }

Box(
    modifier = Modifier
        .fillMaxSize()
        .background(Color(0xFFD3D3D3)),
    contentAlignment = Alignment.Center
) {
    BasicTextField(
        value = text,
        onValueChange = {
            text = it
        },
        modifier = Modifier
            .background(Color.White)
            .fillMaxWidth(),
        decorationBox = { innerTextField ->
            Column(
                modifier = Modifier.padding(vertical = 10.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    IconButton(onClick = {}) { Icon(painterResource(id = R.drawable.mood), contentDescription = null) }
                    IconButton(onClick = {}) { Icon(painterResource(id = R.drawable.gif), contentDescription = null) }
                    IconButton(onClick = {}) { Icon(painterResource(id = R.drawable.shortcut), contentDescription = null) }
                    IconButton(onClick = {}) { Icon(painterResource(id = R.drawable.more), contentDescription = null) }
                }
                Box(
                    modifier = Modifier.padding(horizontal = 10.dp)
                ) {
                    innerTextField()
                }
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.End
                ) {
                    TextButton(onClick = { /*TODO*/ }) {
                        Text("发送")
                    }
                    Spacer(Modifier.padding(horizontal = 10.dp))
                    TextButton(onClick = { /*TODO*/ }) {
                        Text("关闭")
                    }
                }
            }
        }
    )
}