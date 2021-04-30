summary: 小试牛刀1
id: 小试牛刀1
categories: Sample
tags: medium
status: Published 
authors: Nthily
Feedback Link: https://github.com/Nthily

# 小试牛刀1
<!-- ------------------------ -->
## 总览
Duration: 1

### 总览
* how to set the amount of time each slide will take to finish 
* how to include code snippets 
* how to hyperlink items 
* how to include images 
* other stuff

<!-- ------------------------ -->
## Setting Duration
Duration: 2

To indicate how long each slide will take to go through, set the `Duration` under each Heading 2 (i.e. `##`) to an integer. 
The integers refer to minutes. If you set `Duration: 4` then a particular slide will take 4 minutes to complete. 

The total time will automatically be calculated for you and will be displayed on the codelab once you create it. 


<!-- ------------------------ -->
## Code Snippets
Duration: 3

To include code snippets you can do a few things. 
- Inline highlighting can be done using the tiny tick mark on your keyboard: "`"
- Embedded code

<!-- ------------------------ -->
### kotlin

```kotlin
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

<!-- ------------------------ -->
<button>
  [Download SDK](https://www.google.com)
</button>

<!-- ------------------------ -->
### Java

``` java
for (statement 1; statement 2; statement 3) {
  // code block to be executed
}
```