![](https://cdn.jsdelivr.net/gh/compose-museum/hello-compose/docs/assets/tutorial-banner.png)

![GitHub stars](https://img.shields.io/github/stars/compose-museum/jetpack-compose-tutorial.svg?style=social&label=Star)

## 介绍 💨

### [Jetpack Compose Book](https://jetpackcompose.cn/)
国内第三方镜像 *（加载速度快，内容可能略滞后于官网）*：[https://compose.funnysaltyfish.fun](https://compose.funnysaltyfish.fun)

此项目致力于帮助大家更好的认识 Jetpack Compose 框架, 更多的部分是为了补充官网可能没有介绍的东西。

有问题欢迎提交 [issue](https://github.com/compose-museum/jetpack-compose-tutorial/issues/new)。

一起进步！

## 关于贡献

### Jetpack Compose
如果你想为 Jetpack Compose 做贡献的话，你可以加入 [Kotlin](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 的 Slack 频道 **#Compose**, 或者在 [https://issuetracker.google.com/issues?q=componentid:612128](https://issuetracker.google.com/issues?q=componentid:612128) 中提交 Compose 的 Bug 或者错误

### 本项目

我们非常欢迎各种的 PR 请求（~~包括但不局限于添加一个换行增加阅读体验~~），_(:з)∠)_本项目还处于初期阶段，非常需要各位大佬的完善和纠错。

如果你有已经写好的文章想要添加到这里，欢迎提交 PR。

文档采用 [docusaurus](https://docusaurus.io/) 来编辑及部署


### 在本地编辑&测试

#### 基于 Docker 部署
> Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的容器中，然后发布到任何环境中

1. 安装 [Docker](https://docs.docker.com/get-docker/) 和 [Docker Compose](https://docs.docker.com/compose/install/)

2. 新建目录用于存放 docker-compose.yml 文件和项目文件
3. 在目录下新建 docker-compose.yml 文件，内容如下：
```yaml
version: "3.7"

services:
  docusaurus:
    container_name: docusaurus
    image: awesometic/docusaurus
    volumes:
      - ./jetpack-compose-book-master:/docusaurus/website
    environment:
      - TZ=Asia/Shanghai
      - AUTO_UPDATE=false
      - WEBSITE_NAME=website
      - RUN_MODE=development # development or production
    ports:
      - 3000:80

```
4. clone 或 Download Zip 下载本项目源码到本地，重命名为 `jetpack-compose-book-master`，放到此目录下。此时，目录结构如下
```
.
├── docker-compose.yml
└── jetpack-compose-book-master
  ├── README.md
  ...
```
5. 在此目录下打开终端，执行 `docker-compose up -d`（部分 linux 平台命令为 docker compose up -d，下面类似）（-d 意为后台运行，如果首次运行希望看到输出，可以不加 -d），稍等几分钟后将会在 [`http://localhost:3000/`](http://localhost:3000/) 看到文档
6. 如果想要停止运行并删除容器，执行 `docker-compose down`；如果更新了文件，可以使用 `docker-compose restart` 重启容器；如果想发布生产版本，请将 `docker-compose.yml` 中的 `RUN_MODE` 改为 `production`，并执行 `docker-compose stop && docker-compose up -d` 重启容器，执行完成后可在 `./jetpack-compose-book-master/build` 下看到生成的静态文件


#### 基于本地环境部署
当然，你也可以在本地环境部署，此方式对 Node.js 和 npm 的版本有较严格要求，如下：
1. [Node.js](https://nodejs.org/en/download/) >= 16.14
2. npm 推荐 8.12 左右


环境安装完后，fork 仓库并在项目目录执行 `npm install` 以安装依赖。

在项目根目录终端执行 `npm run start`，将会在 [`http://localhost:3000/`](http://localhost:3000/) 看到文档

#### 如何添加/更改文档？
    
文档都是由 **Markdown** 语法来编写的，所有文档位于 [/docs](https://github.com/compose-museum/compose-tutorial/tree/master/docs) 中, 如果需要扩展左边的侧边栏，请在 [**sidebars.js**](sidebars.js) 更新。

图片添加需要在 **static/img/** 下，和文档同等路径名字添加。例如我修改了 **Text** 的文档，并且添加了一张例图，那么就是放在 **/static/img/elements/text/xxx.png**。

[调用图片方法](https://docusaurus.io/zh-CN/docs/static-assets)

#### 如何测试

运行 `npm run build` 会生成 `build` 文件夹，期间 `docusaurus` 会打印日志告诉你是否有 WARNING 或者 ERROR（一般可能是路径错误等）


#### 如果你觉得此项目对你有帮助的话，不妨点个 Star 支持下作者吧~！

## 贡献者 ❤

<a href="https://github.com/compose-museum/hello-compose/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=compose-museum/hello-compose" />
</a>

### 版权声明

<a rel="license" href="http://creativecommons.org/licenses/by-nc/2.0/"><img alt="知识共享许可协议" style="border-width:0" src="https://i.creativecommons.org/l/by-nc/2.0/88x31.png" /></a><br />本作品采用<a rel="license" href="http://creativecommons.org/licenses/by-nc/2.0/">知识共享署名-非商业性使用 2.0 通用许可协议</a>进行许可。

除特别注明外，项目中除了代码部分均采用[非商业性使用 2.0 通用 (CC BY-NC 2.0)](https://creativecommons.org/licenses/by-nc/2.0/deed.zh) 进行许可。

您可以自由地：

共享 — 在任何媒介以任何形式复制、发行本作品

演绎 — 修改、转换或以本作品为基础进行创作

但是你必须遵守：

署名 — 您必须给出适当的署名，提供指向本许可协议的链接，同时标明是否（对原始作品）作了修改。您可以用任何合理的方式来署名，但是不得以任何方式暗示许可人为您或您的使用背书。

非商业性使用 — 您不得将本作品用于商业目的。
