# Column

![url](https://developer.android.com/images/jetpack/compose/layout-column-row-box.png)

## Column 显示

`Column` 是 Jetpack Compose 中一个很基本的界面种类，它会将括号里面的控件元素以行的形式呈现

``` kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ColumnDemo()
        }
    }
}

@Composable
fun ColumnDemo() {
    Column(){
        Text("你好呀")
        Text("我正在使用 Android Studio")
        Text("现在是晚上")
    }
}
```
效果如下：

<img src="../../assets/layout/column/column1.png">

## 1.居中文字

如果我们需要将 Column 里面的文字居中该怎么办呢？

很简单，我们只需要添加 `modifier` 和 `horizontalAlignment` 参数

代码如下:

```kotlin
@Composable
fun ColumnDemo() {
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("你好呀")
        Text("我正在使用 Android Studio")
        Text("现在是晚上")
    }
}
// 我们要注意的是，如果不添加 Modifier.fillMaxWidth()
// Column 的宽度将取决于里面最宽控件的长度
```
效果如下：

<img src="../../assets/layout/column/column2.png">

## 2.特定文字居中

如果我们想让 `Column` 一些特定的文字居中怎么办
我们只需要在需要居中的文字的地方添加 `Column`，并且添加之前的两个参数

代码如下：
``` kotlin
@Composable
fun ColumnDemo() {
    Column{

        Column(modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ){
            Text("这是一个标题")
        }

        Text("我正在使用 Android Studio" +
                "我正在使用 Android Studio" +
                "我正在使用 Android Studio" +
                "我正在使用 Android Studio" +
                "我正在使用 Android Studio" +
                "我正在使用 Android Studio" +
                "我正在使用 Android Studio" +
                "我正在使用 Android Studio" +
                "我正在使用 Android Studio" +
                "我正在使用 Android Studio")
    }
}
```

效果如下：

<img src="../../assets/layout/column/column3.png">