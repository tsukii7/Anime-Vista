> 🌐 查看英文版: [English](./README.md)

# Anime Vista

## 🎬 项目简介

**Anime Vista** 是一个基于 React
构建的单页应用（SPA），旨在为用户提供清晰、丰富的当季新番导视体验。项目以高可用性与良好用户体验为目标，集成了番剧推荐、时间线展示、筛选搜索、排行榜、收藏夹、番剧详情等核心功能，支持用户登录与个性化互动。

本项目采用 Model-View-Presenter（MVP）架构，使用 Redux Toolkit 管理全局状态，集成 Firebase 实现后端持久化与用户认证，前端原型由
Figma 设计，并在实际开发中严格保持一致性。

本项目还支持服务端渲染（SSR，Server-Side Rendering），通过 React Router 的官方框架模式构建，提升页面加载速度与搜索引擎友好性。在首次访问时，服务端会提前生成完整的
HTML 内容，减少白屏等待，更适合在生产环境中部署。

用户可以通过 Anime Vista：

- 浏览当前季度的番剧列表与时间线视图
- 使用多条件筛选功能查找感兴趣的番剧
- 查看热门作品排行榜
- 登录并管理自己的收藏夹
- 深入了解每部作品的详细信息、角色、制作人员等
- 评价与评论番剧，发表社交动态，参与社区互动
- 等等

该项目既适合番剧爱好者作为观影参考平台，也适合作为前端开发课程的综合实践项目，完整体现了现代 Web 应用的架构与开发流程。

## 🚀 项目运行说明

克隆项目后，在项目根目录下执行以下命令：

- `npm install`：读取 [`package.json`](./package.json) 文件，自动安装项目所需的全部依赖库
- `npm run dev`：启动本地开发服务器，访问 `http://localhost:5173/` 即可查看项目

如果您的控制台出现类似以下的报错，这是由于项目仅在本地运行、未启动 SSR
相关服务器。此为正常现象，该报错并不影响项目正常功能。其余运行项目方式请参见 [dev-guide](docs/dev-guide/README.zh-CN.md)
文档。

```txt
Uncaught Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch
```

## 🖍️ 前端设计

前端项目设计原型使用 [Figma](https://www.figma.com/design/LSyIJwZJsdOqOMlyL1aEfy/DH2642-Project?t=gBtJhullMivhXG3n-0)
设计，链接由开发者私有维护。

## 📚 说明文档

更多详细设计与使用方式请查看 [`docs/`](./docs) 文件夹下的文档：

|                        主题                         | 内容简洁                                          |
|:-------------------------------------------------:|:----------------------------------------------|
| [architecture](docs/architecture/README.zh-CN.md) | 项目架构概述、MVC/MVP解释、各层职责（View/Presenter/Model）说明 |
|         [state](docs/api/README.zh-CN.md)         | Redux 状态结构、每个 slice 的职责与数据结构说明                |
|         [api](docs/state/README.zh-CN.md)         | 后端 API 介绍、通信方式、Postman 使用教程                   |
|     [firebase](docs/firebase/README.zh-CN.md)     | Firebase 配置说明：auth、firestore使用方式              |
|      [routing](docs/routing/README.zh-CN.md)      | 页面路由结构说明（React Router使用方式、各页面路径）              |
|    [dev-guide](docs/dev-guide/README.zh-CN.md)    | 如何启动项目、调试、提交规范、分支策略等开发者说明                     |
| [contribution](docs/contribution/README.zh-CN.md) | 各开发者的分工                                       |

## 🛠️ 技术栈

|   类别   | 选择                                 |
|:------:|:-----------------------------------|
|  前端框架  | React                              |
| SPA 路由 | React Router                       |
| 服务端渲染  | React Router SSR + Express         |
|  状态管理  | Redux Toolkit                      |
|  持久化   | Firebase Firestore                 |
|  用户认证  | Firebase Authentication            |
|  接口通信  | Fetch API                          |
| UI 设计  | Figma                              |
|  部署方式  | Firebase Hosting + Cloud Functions |
| 云运行环境  | Google Cloud Run（由 Firebase 调用）    |

## 第三方组件库

本项目使用了 [Material UI](https://mui.com/material-ui/) 组件库实现部分内容，现摘取部分如下：

1. 左侧侧边栏使用的按钮图标、右上角用户个人中心的按钮
![icons.png](docs/grading/assets/icons.png)

2. 所有顶部弹窗，以下两张图列举了 alert 类型 与 success 类型的弹窗
![hint-alert.png](docs/grading/assets/hint-alert.png)
![hint-success.png](docs/grading/assets/hint-success.png)