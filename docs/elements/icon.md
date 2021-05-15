<img src = "../../assets/elements/icon/carbon.png" width = "80%" height = "50%">

一个图标组件，使用 `tint` 来给 `imageVector` 上色，默认为 `LocalContentColor`。对于一个可点击的图标，请查阅 [IconButton](iconbutton.md)。

``` kotlin
Row{
    Icon(Icons.Filled.ArrowBack, contentDescription = null)
    Icon(Icons.Filled.ArrowBack, contentDescription = null, tint = Color.Gray)
    Icon(Icons.Filled.ArrowBack, contentDescription = null, tint = Color.Red)
    Icon(Icons.Filled.ArrowBack, contentDescription = null, tint = Color.DarkGray)
    Icon(Icons.Filled.ArrowBack, contentDescription = null, tint = Color.Magenta)
    Icon(Icons.Filled.ArrowBack, contentDescription = null, tint = Color.Yellow)
    Icon(Icons.Filled.ArrowBack, contentDescription = null, tint = Color.Cyan)
}
```


![](../assets/elements/icon/demo.png)