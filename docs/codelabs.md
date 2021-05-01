
**Codelabs** 主要是帮助大家能够更容易的完善一些小的实现等

[Codelabs 主页](https://codelabs.compose.net.cn/)


| 实验室 | 介绍 |
| -------|------|
| [**小试牛刀1**](https://codelabs.compose.net.cn/codelabs/first_codelab/index.html?index=..%2F..index#0)| 实现简单的结构布局 |


## 关于如何贡献 Codelabs 或者修改错误

[**Fork**](https://github.com/compose-museum/codelabs) Codelabs 的项目

### 你需要准备以下的环境
1. [Go](https://golang.org/dl/)
2. [Node.js](https://nodejs.org/en/download/) 和 [npm](https://www.npmjs.com/get-npm)
3. [Claat](https://github.com/googlecodelabs/tools/tree/master/claat#install)，推荐用 go 命令来安装

### 接下来

1. 在项目根目录运行 `npm install`
2. 运行 `gulp serve --codelabs-dir=codelabs`
3. 在 `http://localhost:8000/` 中查看网页


### 修改

1. 进入 codelabs 文件夹下，可以看到有许多文件夹和 `.md` 文件
2. 修改对应的 `.md` 文件
3. 执行 `claat export xxxx.md`，成功的话会看到 ok -----
4. 返回根目录执行 `gulp serve --codelabs-dir=codelabs` 重新生成网页


!!! warning "注意"
    如果是 windows 系统，请务必使用 `Unix LF` 行尾来保存文件，否则在网页上会有很多错误

### 最后

提交 **pr** 时，尽量把 `build` 文件夹删除，因为核心内容只是 `codelabs/` 下的东西，根目录是存放主界面的网页尽量不要修改

pr 到 -> **gh-pages** 分支

如果觉得自己修改有点麻烦的话，也可以到[这里](https://github.com/compose-museum/codelabs/issues/new)提交 `issue`，尽量提供是哪些页面/代码有错误