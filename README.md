[![cuBJcn.md.png](https://z3.ax1x.com/2021/04/04/cuBJcn.md.png)](https://z3.ax1x.com/2021/04/04/cuBJcn.png)

## 介绍 💨


## Jetpack Compose 教程 (Compose-Tutorial) （开发中 ing... 咕咕咕） 

此项目致力于帮助大家更好的理解和使用 Jetpack Compose 框架，从而提高开发效率

项目会包含很多关于 Jetpack Compose 的 教程/ 基本使用方法 / 经历的坑

未来可能会添加一些样例 app（开发中）

欢迎访问 👉 <https://docs.compose.net.cn/> 来学习(目前国内可能无法直连)

<img src = "/screenshots/sc1.png">


## 关于贡献

### Jetpack Compose
如果你想为 Jetpack Compose 做贡献的话，你可以加入 [Kotlin](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 的 Slack 频道 **#Compose**, 或者在 [https://issuetracker.google.com/issues?q=componentid:612128](https://issuetracker.google.com/issues?q=componentid:612128) 中提交 Compose 的 Bug 或者错误


### 本项目

我们非常欢迎各种的 PR 请求，_(:з)∠)_本项目还处于初期阶段，非常需要各位大佬的完善和纠错

文档采用 [Material 主题的 MkDocs](https://squidfunk.github.io/mkdocs-material/getting-started/) 来编辑，非常好上手,你只需要按照以下的步骤：

* 安装插件

```
    pip3 install mkdocs-minify-plugin
    pip3 install mkdocs-git-revision-date-localized-plugin
    pip3 install mkdocs-minify-plugin
    pip3 install mkdocs-macros-plugin
```

* 在本地运行和测试

    终端执行 ``` mkdocs serve ```，将会在 ``` http://localhost:8000/ ``` 看到文档


* 如何添加/更改文档？
    
    文档都是由 **Markdown** 语法来编写的，所有文档位于 [/docs](https://github.com/compose-museum/compose-tutorial/tree/main/docs) 中, 如果需要扩展左边的导航侧栏，请在 **mkdocs.yml** 更新 **nav**

    图片添加需要在 **/assets/** 下，和文档同等路径名字添加，
    例如如果我修改了 **Text** 的文档，并且添加了一张例图
    那么就是放在 **/assets/elements/text/xxx.png**

* 最后

    恭喜你，当你同步了本项目的最新进度并且添加了你所想的东西，你只需要提交 PR 即可，我们在审核通过会自动同步到网站上


### 同步项目最新进度

首先，您需要 `fork` 一份本项目，然后同步项目的最新进度：

在你 `fork` 下的项目根目录执行

```
 git remote add forkStream https://github.com/compose-museum/compose-tutorial.git (或使用 SSH)
 git remote -v
 git fetch forkStream //同步项目最新进度
 git merge forkStream/main //合并项目最新进度
```
