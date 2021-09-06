## 前言
骨架屏是页面的一个空白版本，通常会在页面完全渲染之前，通过一些灰色的区块大致勾勒出轮廓，待数据加载完成后，再替换成真实的内容。骨架屏加载中效果，比起传统的加载中效果可以提供更多信息，用户体验更好，因此也变得越来越流行     
本文主要介绍如何使用Compose实现一个简单易用的骨架屏效果,有兴趣的同学可以点个`Star`：[Compose版骨架屏](https://github.com/shenzhen2017/ComposeShimmer)

## 效果图
首先看下最终的效果图    
![](https://raw.githubusercontents.com/shenzhen2017/resource/main/2021/september/p1.gif)
![](https://raw.githubusercontents.com/shenzhen2017/resource/main/2021/september/p2.gif)

## 特性
1. 简单易用，可复用页面`UI`,不需要针对骨架屏定制`UI`        
2. 支持设置骨架屏是否显示，一般结合加载状态使用      
3. 支持设置骨架屏背景与高亮颜色    
4. 支持设置骨架屏高度部分宽度，渐变部分宽度       
5. 支持设置骨架屏动画的角度与方向
6. 支持设置骨架屏动画的时间与两次动画间隔

## 使用
### 接入
第 1 步:在工程的`build.gradle`中添加：    
```groovy
allprojects {
	repositories {
		...
		mavenCentral()
	}
}
```

第2步：在应用的`build.gradle`中添加：      
```groovy
dependencies {
        implementation 'io.github.shenzhen2017:shimmer:1.0.0'
}
```

### 简单使用
```kotlin
@Composable
fun ShimmerSample() {
    var loading: Boolean by remember {
        mutableStateOf(true)
    }
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .shimmer(loading,config = ShimmerConfig())
    ) {
        repeat(3) {
            PlaceHolderItem()
            Spacer(modifier = Modifier.height(10.dp))
        }
    }
}
```
如上所示:    
1. 只需要在`Column`的`Modifier`中加上`shimmer`，`Column`下的所有组件即可实现骨架屏效果    
2. 可通过`loading`参数，控制骨架屏效果是否显示    
3. 如果需要定制骨架屏动画效果，也可通过一些参数配置         

具体主要有以下这些参数     
```kotlin
data class ShimmerConfig(
    // 未高亮部分颜色
    val contentColor: Color = Color.LightGray.copy(alpha = 0.3f),
    // 高亮部分颜色
    val higLightColor: Color = Color.LightGray.copy(alpha = 0.9f),
    // 渐变部分宽度
    @FloatRange(from = 0.0, to = 1.0)
    val dropOff: Float = 0.5f,
    // 高亮部分宽度
    @FloatRange(from = 0.0, to = 1.0)
    val intensity: Float = 0.2f,
    //骨架屏动画方向
    val direction: ShimmerDirection = ShimmerDirection.LeftToRight,
    //动画旋转角度
    val angle: Float = 20f,
    //动画时长
    val duration: Float = 1000f,
    //两次动画间隔
    val delay: Float = 200f
)
```

## 主要原理
### 通过图像混合模式复用页面`UI`
如果我们要实现骨架屏效果，首先想到的是需要按照页面的结构再写一套`UI`，然后在加载中的时候，显示这套`UI`，否则隐藏            
一般的加载中效果都是这样实现的，但这样会带来一个问题，不同的页面结构不同，那我们岂不是要一个页面就重写一套`UI`?这显然是不可接受的     

我们可以想到，页面的结构其实我们已经写过一遍了，如果我们能复用我们写的页面结构不就好了吗？         
我们可以通过图像混合模式来实现这一点      

图像混合模式定义的是，当两个图像合成时，图像最终的展示方式。在`Androd`中，有相应的`API`接口来支持图像混合模式，即`Xfermode`.      
图像混合模式主要有以下16种,以下这张图片从一定程度上形象地说明了图像混合的作用，两个图形一圆一方通过一定的计算产生不同的组合效果，具体如下     
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/24/16dfbb120666a993~tplv-t2oaga2asx-watermark.awebp)       
我们介绍几个常用的,其它的感兴趣的同学可自行查阅         
- `SRC_IN`:只在源图像和目标图像相交的地方绘制【源图像】
- `DST_IN`:只在源图像和目标图像相交的地方绘制【目标图像】，绘制效果受到源图像对应地方透明度影响
- `SRC_OUT`:只在源图像和目标图像不相交的地方绘制【源图像】，相交的地方根据目标图像的对应地方的`alpha`进行过滤，目标图像完全不透明则完全过滤，完全透明则不过滤
- `DST_OUT`:只在源图像和目标图像不相交的地方绘制【目标图像】，在相交的地方根据源图像的`alpha`进行过滤，源图像完全不透明则完全过滤，完全透明则不过滤

如果我们把页面的`UI`结构作为目标图像，骨架屏效果作为源图像，然后使用`SRC_IN`混合模式     
就可以实现只在页面的结构上显示骨架屏，在空白部分不显示，这样就可以避免重复写`UI`了     

### 通过平移实现动画效果
上面我们已经实现了在页面结构上显示骨架屏，但是骨架屏效果还有一个动画效果     
其实也很简单，给骨架屏设置一个渐变效果，然后做一个平移动画，然后看起来就是现在的骨架屏闪光动画了   
```kotlin
fun Modifier.shimmer(): Modifier = composed {
    var progress: Float by remember { mutableStateOf(0f) }
    val infiniteTransition = rememberInfiniteTransition()
    progress = infiniteTransition.animateFloat().value  // 动画效果，计算百分比
    ShimmerModifier(visible = visible, progress = progress, config = config)
}

internal class ShimmerModifier(progress:Float) : DrawModifier, LayoutModifier {
    private val paint = Paint().apply {
        blendMode = BlendMode.SrcIn //设置混合模式
        shader = LinearGradientShader(Offset(0f, 0f),toOffset,colors,colorStops)//设置渐变色
    }

    override fun ContentDrawScope.draw() {
        drawContent()
        val (dx, dy) = getOffset(progress) //根据progress，设置平移的位置
        paint.shader?.postTranslate(dx, dy) // 平移操作
        it.drawRect(Rect(0f, 0f, size.width, size.height), paint = paint)//绘制骨架屏效果
    }
}
```
如上所示，主要是几步：   
1. 启动动画，获得当前进度`progress`，并根据`progress`获得当前平移的位置    
2. 设置骨架屏的背景渐变颜色与混合模式    
3. 绘制骨架屏效果    

### 自定义骨架屏效果
上面介绍了我们提供了一些参数，可以自定义骨架屏的效果，其它参数都比较好理解，主要是以下两个参数有点难理解         
1. `dropOff`：渐变部分宽度     
2. `intensity`: 高亮部分宽度    

我们知道，可以通过`contentColor`自定义普通部分颜色,`higLightColor`自定义高亮部分颜色      
但是这两种颜色是如何分布的呢？渐变的比例是怎样的呢？可以看下下面的代码：   
```kotlin
    private val paint = Paint().apply {
        shader = LinearGradientShader(Offset(0f, 0f),toOffset,colors,colorStops)//设置渐变色
    }

    private val colors = listOf(
        config.contentColor,
        config.higLightColor,
        config.higLightColor,
        config.contentColor
    )

    private val colorStops: List<Float> = listOf(
        ((1f - intensity - dropOff) / 2f).coerceIn(0f, 1f),
        ((1f - intensity - 0.001f) / 2f).coerceIn(0f, 1f),
        ((1f + intensity + 0.001f) / 2f).coerceIn(0f, 1f),
        ((1f + intensity + dropOff) / 2f).coerceIn(0f, 1f)
    )
```
可以看出，我们的颜色渐变有以下特点：   
1. 渐变颜色分布为：`contentColor`->`higLightColor`->`higLightColor`->`contentColor`     
2. `LinearGradientShader`使用`colors`定义颜色,`colorStops`定义颜色渐变的分布,`colorStops`由`intensity`与`dropoff`计算得来              
3. `intensity`决定了高亮部分的宽度，即`intensity`越大，高亮部分越大      
4. `dropOff`决定了渐变部分的宽度，即`dropOff`越大，渐变部分越大          

## 总结
### 特别鸣谢
在实现`Compose`版本骨架屏的过程中，主要借鉴了以下开源框架的思想，有兴趣的同学也可以了解下             
[Facebook开源的shimmer-android](https://github.com/facebook/shimmer-android)             
[Habib Kazemi开源的compose-shimmer](https://github.com/kazemihabib/compose-shimmer)       

### 项目地址
[简单易用的Compose版骨架屏](https://github.com/shenzhen2017/ComposeShimmer)         
开源不易，如果项目对你有所帮助，欢迎点赞,`Star`,收藏~


