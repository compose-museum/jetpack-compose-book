
`Row` 会将里面的子项放在一个水平的序列中

``` kotlin
@Composable inline fun Row(
    modifier: Modifier = Modifier, 
    horizontalArrangement: Arrangement.Horizontal = Arrangement.Start, 
    verticalAlignment: Alignment.Vertical = Alignment.Top, 
    content: RowScope.() -> Unit
): Unit
```


`Row` 布局能够根据使用 **RowScope.weight** 修改器提供的权重来分配里面子项的宽度

如果一个子项没有提供权重的话，会使用这个子项默认的宽度，再根据其他剩余有权重的子项计算剩余的空间

``` kotlin
@Composable
fun RowDemo() {
    Row {
        Box(Modifier.size(40.dp).background(Color.Magenta))
        Box(Modifier.size(40.dp).weight(1f).background(Color.Yellow))
        Box(
            Modifier.size(40.dp)
                .weight(1f)
                .background(Color.Green)
        )
    }
}
```

![](../../assets/layout/row/demo.png)


``` kotlin
Row {
    Box(Modifier.size(40.dp).background(Color.Magenta))
    Box(Modifier.size(40.dp).background(Color.Yellow))
    Box(Modifier.size(40.dp).background(Color.Green))
}
```

而如果 `Row` 里面的子项都没有设置 **weight** 的话，将会尽可能的小，使里面的子项紧贴在一起

也就是有点像 **xml** 中的 **wrap_content** 属性

![](../../assets/layout/row/demo2.png)