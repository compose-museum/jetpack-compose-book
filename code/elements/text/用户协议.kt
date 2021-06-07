<resources>
    <string name="content">
        如果你看到了这个界面，就默认代表你同意我们的所有用户协议（bushi）
    </string>
</resources>

var content by remember{ mutableStateOf("")}
val openDialog = remember { mutableStateOf(false)  }
val annotatedText = buildAnnotatedString {
    append("勾选即代表同意")
    pushStringAnnotation(
        tag = "tag",
        annotation = stringResource(id = R.string.content)
    )
    withStyle(
        style = SpanStyle(
            color = Color(0xFF0E9FF2),
            fontWeight = FontWeight.Bold
        )
    ) {
        append("用户协议")
    }
    pop()
}

Box(
    modifier = Modifier
        .fillMaxSize()
        .padding(bottom = 15.dp),
    contentAlignment = Alignment.BottomCenter
){
    ClickableText(
        text = annotatedText,
        onClick = { offset ->
            annotatedText.getStringAnnotations(
                tag = "tag", start = offset,
                end = offset
            ).firstOrNull()?.let { annotation ->
                openDialog.value = true
                content = annotation.item
            }
        }
    )
}

if(openDialog.value){
    AlertDialog(
        onDismissRequest = {
            openDialog.value = false
        },
        title = {
            Box(Modifier.fillMaxWidth(),contentAlignment = Alignment.Center){
                Text(
                    text = "用户协议",
                    style = MaterialTheme.typography.h6,
                )
            }
        },
        text = {
            Text(content)
        },
        confirmButton = {
            Button(
                onClick = {
                    openDialog.value = false
                }
            ){
                Text("确认")
            }
        },
        dismissButton = {
            Button(
                onClick = {
                    openDialog.value = false
                }
            ){
                Text("取消")
            }
        }
    )
}
