## 前言
又是一年新春，在这里先给大家拜个早年了。每逢春节，写春联贴春联都是一项必不可少的活动。本次主要使用`Compose`，实现手写春联的效果。如果对你有所帮助，欢迎点个赞或者评论鼓励一下~

> 爆竹声中一岁除  
> 春风送暖入屠苏  
> 千门万户曈曈日  
> 总把新桃换旧符

## 效果图
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c729af9f61e4412b24f66631f223e64~tplv-k3u1fbpfcp-zoom-1.image)
### 生成的春联
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4993eecce8df4d9bb463c6b3b96a153c~tplv-k3u1fbpfcp-zoom-1.image)

## 主要思路
### 事件监听
我们需要实现手写春联效果，首先就是要做事件监听，`Android`中自然是监听`Action_Down`，`Action_Move`，`Action_UP`，`Compose`中应该如何处理呢?        
其实`Compose`中也可以利用`pointerInteropFilter`监听`Action_Down`，`Action_Move`，`Action_UP`,如下所示

```kotlin
Column(modifier = Modifier.pointerInteropFilter {
    when (it.action) {
        MotionEvent.ACTION_DOWN -> {}
        MotionEvent.ACTION_MOVE -> {}
        MotionEvent.ACTION_UP -> {}
        else ->  false
    }
     true
})
```

### 路径绘制
当我们手写春联的时候，实际上就是把我们触摸过的点连接起来，最直接的想法当然是通过`Path`来绘制，即把各个点连接成`Path`,然后通过`drawPath`来绘制     
但是问题在于春联是毛笔效果，在写的过程中路径的粗细会发生变化，而`drawPath`只支持固定的宽度，因此不符合我们的要求。

所以我们换个思路，`drawPath`其实也是将各个点连接起来，如果我们将触摸过程中的点记录下来，然后在这一系列的点上画圆不就行了吗？每个圆的半径可以自定义，但这样会带来以下问题       
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87b62d152d0b499a87968da533d7e310~tplv-k3u1fbpfcp-zoom-1.image)

可以看出:`android`触摸中的`MOVE`时间取点的频率不是非常高，会隔一定的像素取点。当轻触滑动时会出现不连续圆的情况，明显不符合笔锋效果

### 贝塞尔曲线
上面的问题在于`MOVE`过程中回调的次数有限，因此只会产生一系列不连续的点，而不是一条线，该如何解决呢？      
我们可以想一下`Path`，其实它也只是定义了一系列的点，然后通过贝塞尔曲线将这些点连接起来，从而实现了曲线效果，我们是不是也可以通过类似的方式，将上面这些点连成线呢?

```kotlin
    private fun onActionMove(event: MotionEvent) {
        val lastPoint = viewStates.value.curPoint
        val curPoint = ControllerPoint(event.x, event.y)
        val lineWidth = calWidth(event = event)
        curPoint.width = lineWidth
        if (viewStates.value.pointList.size < 2) {
            //初始化贝塞尔曲线
            bezier.init(lastPoint, curPoint)
        } else {
            //添加下一个点
            bezier.addNode(curPoint)
        }
        val curDis = getDistance(event)
        //在两个点之间插入10个点，它们都在两个点连接的贝塞尔曲线上
        val steps: Int = 1 + (curDis / STEP_FACTOR).toInt()
        val step = 1.0 / steps
        val list = mutableListOf<ControllerPoint>()
        var t = 0.0
        // 插入10个点
        while (t < 1.0) {
            val point: ControllerPoint = bezier.getPoint(t)
            list.add(point)
            t += step
        }
        addPoints(list)
        _viewStates.value = _viewStates.value.copy(curPoint = curPoint)
    }
```
如上所示，主要做了以下工作：
1. 当目前列表中只有1个点时，初始化贝塞尔曲线，即以上一个点为起始点，当前点为终点
2. 当列表中已经有2个点时，往贝塞尔曲线中加入当前点，将原来的终点变为起点，当前点变为新的终点
3. 在贝塞尔曲线的起点与终点之间插入多个点，它们的位置都在贝塞尔曲线上，具体的数量由`STEP_FACTOR`决定，我们目前暂定为10个
4. 当我们在2个点之间，插入了多个点之后，它们之间的空白就会被填补，看起来不像一条线一样

### 可变的宽度
上文说到毛笔的路径粗细是不断变化的，一般来说是越慢的地方笔划越粗，越快的地方笔划越细，同时两个相邻的点之间的宽度应该是渐变的，而不是突变的，计算笔画宽度的代码如下：

```kotlin
    private fun calWidth(event: MotionEvent): Float {
    	// 滑动距离
        val distance = getDistance(event)
        // 滑动距离加个影响系数定义为速度
        val calVel = distance * 0.002
        // 速度越大宽度越小，速度越小宽度越大
        val width = NORMAL_WIDTH * maxOf(exp(-calVel), 0.2)
        return width.toFloat()
    }
```
如上所示，主要做了以下工作：
1. 虽然决定笔划粗细的是速度，但我们可以假定两次`MOVE`的间隔是大致相同的，因此计算出滑动距离即可
2. 因为我们希望笔划粗细有个最大值与最小值，因此我们需要给滑动距离加个影响系数，使`exp(-calVel)`的结果尽量在0.2与1之间
3. 速度越大宽度越小，速度越小宽度越大，当滑动速度为0时，`exp(-calVel)`即为1，而滑动速度越快，`exp(-calVel)`越接近于0

上面主要是`MOVE`回调的点的宽度计算，除了`MOVE`回调的点，贝塞尔曲线加入的点的宽度也应该在起点与终点的宽度之间渐变
```java
    private double getW(double t){
        return getWidth(mSource.width, mDestination.width, t);
    }

    private double getWidth(double w0, double w1, double t){
        return w0 + (w1 - w0) * t;
    }
```

### 绘制性能优化
上面我们通过保存`MOVE`过程中的点的方式实现绘制，当随着笔划越来越多，需要绘制的点也越来越多，在`onDraw`中对列表进行遍历然后绘制是比较耗性能的，同时每当列表更新，列表都会重新遍历      
我们可以建立一个缓冲`bitmap`，`ACTION_UP`事件中将当前所有点绘制到缓冲`bitmap`中。在`draw`时直接将缓冲`bitmap`绘制到`canvas`中，如下所示：

```kotlin
fun SpringBoard() {
	//定义内存图片
	val bitmap = remember {
        Bitmap.createBitmap(itemSize.toInt(), itemSize.toInt(), Bitmap.Config.ARGB_8888)
    }
    val newCanvas = remember { android.graphics.Canvas(bitmap) }
    val paint = remember { Paint().apply { color = android.graphics.Color.BLACK } }
    BoxWithConstraints(){
        Canvas(
            modifier = Modifier
                .fillMaxSize()
                .pointerInteropFilter(onTouchEvent = {
                    when (it.action) {
                        MotionEvent.ACTION_UP -> {
                            //绘制到Bitmap上
                            states.pointList.forEach { point ->
                                newCanvas.drawCircle(point.x, point.y, point.width, paint)
                            }
                            //清空当前列表
                            viewModel.dispatch(SpringBoardViewAction.ActionUp(it))
                        }
                    }
                    true
                })
        ) {
            //绘制Bitmap，即之前的笔划
            drawImage(bitmap.asImageBitmap())
            //绘制当前列表，即当前笔划
            states.pointList.forEach {
                drawCircle(Color.Black, it.width, Offset(it.x, it.y))
            }
        }
    }
}
```
如上所示，主要做了以下工作：
1. 定义内存图片`bitmap`,并通过`bitmap`获取`newCanvas`
2. 在`ACTION_UP`时将当前点的列表绘制到`bitmap`中并且清空当前点的列表
3. 在`onDraw`中绘制`bitmap`，即绘制之前的笔划，同时绘制当前的`pointList`，即当前的笔划

### 长按保存到本地
我们在长按时，需要将春联保存到本地，这需要我们把`Compose`代码转化成`Bitmap`，这个在`View`中比较成熟，但是在`Compose`中我没有找到相关方法      
我们可以仿照上面的实现，把内容绘制在一个`bitmap`上，然后直接保存这个`bitmap`上就好了
```kotlin
@Composable
fun SpringPreview() {
    BoxWithConstraints(
        modifier = Modifier
            .pointerInput(Unit) {
                detectTapGestures(
                    onLongPress = {
                    	//长按时保存bitmap到本地
                        BitmapUtils.saveBitmapToGallery(context, bitmap, "春联")
                    }
                )
            }
    ) {
    	//将背景与图片列表绘制到bitmap上
        newCanvas.drawColor(android.graphics.Color.RED)
        for (i in states.bitmapList.indices) {
            newCanvas.drawBitmap(states.bitmapList[i], 0f, itemSize * i, paint)
        }

        Canvas(modifier = Modifier.fillMaxSize()) {
            //绘制bitmap
            drawImage(bitmap.asImageBitmap(), Offset.Zero)
        }
    }
}
```
1. 上面提到我们会将笔划绘制到`bitmap`中，一个字即是一个`bitmap`
2. 我们的春联的内容即为上面的`bitmap`的列表，再加上一个红色的背景
3. 我们将红色背景与`bitmap`列表都绘制到一个`bitmap`中，再将这个`bitmap`中绘制到`Compose`中
4. 上面这个`bitmap`就是我们想要的图片，长按时将其保存到本地即可

## 总结
### 参考资料
[安卓画笔笔锋的实现探索（一）](https://www.jianshu.com/p/6746d68ef2c3)     
[过年了！开发一套纸笔系统，随时随地在线写春联](https://juejin.cn/post/7051345154413690911)

### 项目地址
[https://github.com/shenzhen2017/compose-handwriting](https://github.com/shenzhen2017/compose-handwriting)
