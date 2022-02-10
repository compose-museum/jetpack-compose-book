---
hide:
  - navigation # Hide navigation
  - toc        # Hide table of contents
---

``` kotlin
@Composable
fun Contributors() {
    Column{
        MemberItem(R.drawable.m1, "香辣鸡腿堡")
        MemberItem(R.drawable.m2, text = "Ruger")
        MemberItem(R.drawable.m3, "凛")
        MemberItem(R.drawable.m4, text = "RE")
        MemberItem(R.drawable.m5, "fundroid")
    }
}

@Composable
fun TouchFish() {
    for(index in 0..20) MemberItem(R.drawable.m2, text = "Ruger")
}

@Composable
fun MemberItem(
    imageID: Int,
    text:String
){
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 10.dp, vertical = 5.dp),
        verticalAlignment = Alignment.CenterVertically
    ){
        Surface(
            shape = CircleShape, 
            modifier = Modifier.size(40.dp)
        ) {
            Image(painter = painterResource(imageID), contentDescription = null)
        }
        Spacer(Modifier.padding(horizontal = 8.dp))
        Text(text = text, style = MaterialTheme.typography.body1, fontWeight = FontWeight.W500)
        Box(
            modifier = Modifier.fillMaxWidth(), 
            contentAlignment = Alignment.CenterEnd
        ) {
            IconButton(
                onClick = { /*TODO*/ }
            ) {
                Icon(Icons.Filled.Email, null)
            }
        }
    }
}

@ExperimentalFoundationApi
@Composable
fun ListWithHeader() {
    val sections = listOf("贡献者", "眠眠的粉丝")

    Column{
        TopAppBar(
            title = {
                Text(
                    text = "Compose Museum 贡献者",
                )
            },
            actions = {
                IconButton(
                    onClick = { /*TODO*/ }
                ) {
                    Icon(Icons.Filled.Search, null)
                }
            },
            backgroundColor = Color.White
        )
        LazyColumn {
            sections.forEachIndexed{ index, section ->
                stickyHeader {
                    Text(
                        text = section,
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Color(0xFFF2F4FB))
                            .padding(horizontal = 10.dp, vertical = 5.dp),
                        fontWeight = FontWeight.W700,
                        color = Color(0xFF0079D3)
                    )
                }
                when(index){
                    0 -> item{Contributors()}
                    1 -> item{TouchFish()}
                }
            }
        }
    }
}
```