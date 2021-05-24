
## Jetpack Compose
如果你想为 Jetpack Compose 做贡献的话，你可以加入 [Kotlin](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 的 Slack 频道 **#Compose**, 或者在 [https://issuetracker.google.com/issues?q=componentid:612128](https://issuetracker.google.com/issues?q=componentid:612128) 中提交 Compose 的 Bug 或者错误

## [关于 Codelabs](codelabs.md)

## 本项目

我们非常欢迎各种的 PR 请求，_(:з)∠)_本项目还处于初期阶段，非常需要各位大佬的完善和纠错

文档采用 [Material 主题的 MkDocs](https://squidfunk.github.io/mkdocs-material/getting-started/) 来编辑，非常好上手,你只需要按照以下的步骤：

```

    pip install mkdocs-material

    pip install mkdocs-git-revision-date-localized-plugin

```

* 在本地运行和测试

    在项目根目录终端执行 ``` mkdocs serve ```，将会在 ``` http://localhost:8000/ ``` 看到文档


* 如何添加/更改文档？
    
    文档都是由 **Markdown** 语法来编写的，所有文档位于 [/docs](https://github.com/Compose-Museum/Compose-Tutorial/tree/main/docs) 中, 如果需要扩展左边的导航侧栏，请在 **mkdocs.yml** 更新 **nav**

    图片添加需要在 **/assets/** 下，和文档同等路径名字添加，
    例如如果我修改了 **Text** 的文档，并且添加了一张例图
    那么就是放在 **/assets/elements/text/xxx.png**

* 最后

    恭喜你，当你同步了本项目的最新进度并且添加了你所想的东西，你只需要提交 PR 即可，我们在审核通过会自动同步到网站上


## 同步项目最新进度

首先，您需要 `fork` 一份本项目，然后同步项目的最新进度：

#### 第一种方法（推荐！）

在 github 网页中，在你的 fork 仓库里，点击 Fetch upstream

然后在项目根目录执行

```
 git pull origin main
 ... // 写新内容
 git push // push 到自己的分支
 pr // 在网页上提交 PR
```

#### 第二种方法

```
 git remote add fork git@github.com:compose-museum/compose-tutorial.git (或使用 HTTPS)
 git remote -v
 git fetch fork //同步项目最新进度
 git merge fork/main //合并项目最新进度
 ... // 写新内容
 git push // push 到自己的分支
 pr // 在网页上提交 PR
```
