> 🌐 查看英文版: [English](./README.md)

## 🌐 服务端渲染（SSR）

服务端渲染（Server Side Rendering）指在服务端将 React 组件直接渲染为 HTML 字符串返回给浏览器，避免客户端白屏等待、提升首屏加载速度，并改善
SEO 效果。

本项目基于 React Router v7 内建的 SSR 支持，配合 Express 实现路由级 HTML 渲染。构建流程通过 `react-router build`
命令一次性生成客户端和服务端产物：

- [`react-router.config.js`](../../react-router.config.js)：配置 SSR 构建模式、路由入口文件、构建输出路径。
- [`vite.config.js`](../../vite.config.js)：集成 `@react-router/dev/vite` 插件，辅助生成双端构建内容。
- [`package.json`](../../package.json)：通过 `npm run build` 执行的具体内容：
    - `react-router build`：执行 SSR 构建。
    - `node scripts/copySSR.mjs`：执行 `copySSR` 脚本，将 SSR 产物复制到 Firebase Cloud Functions 的部署目录。

构建完成后，会生成两个关键目录：

- `.react-router/`：构建缓存目录，存放内部中间产物。
- `build/`：最终构建产物
    - `build/client/`：静态资源，供浏览器加载。
    - `build/server/`：SSR 服务端入口模块，包括 `index.js`，用于响应路由请求。

构建后的 `build/server/index.js` 会通过 [`scripts/copySSR.mjs`](../../scripts/copySSR.mjs) 自动复制至 Firebase Cloud
Functions 的部署目录 `functions/build/server/`，以支持托管平台的 SSR 部署。

## ☁️ Firebase 托管部署（firebase deploy）

项目使用 Firebase 托管部署，实现一站式前端与 SSR 后端发布流程。完整部署流程如下：

首先将根目录下 `package.json` 的 `dependencies` 复制至此，但需保留部署所需的 `firebase-admin` 和 `firebase-functions`：

```json
"dependencies": {
"firebase-admin": "^12.6.0",
"firebase-functions": "^6.3.2",
...
},
```

然后在根目录下执行：

```bash
npm run build         # 构建前后端产物并复制至 Functions 部署目录
cd functions
npm install           # 安装 Cloud Functions 所需依赖（必需）
cd ..
firebase deploy       # 部署至 Firebase Hosting + Cloud Functions
```

### 为什么需要单独 `npm install`

由于 Firebase Functions 是一个独立运行的子项目，其依赖（如 `express`、`@react-router/express` 等）定义在
`functions/package.json` 中。

构建产物被复制进去后，必须在 `functions/` 目录下执行 `npm install`，确保 Cloud Functions 部署时有完整依赖，否则部署时会出现
“missing modules” 或 “failed to load SSR handler” 等错误。

### 🔍 `firebase deploy` 的原理流程

`firebase deploy` 实际上是对下列 Google Cloud 服务的一层封装：

```text
项目代码（React + Express）
       ↓
npm run build                      # 使用 React Router 构建前端 + SSR 模块
       ↓
Firebase CLI                      # 提交构建产物，进行配置校验
       ↓
Cloud Functions（自动托管至 Cloud Run）  # 将 SSR 服务容器部署到 Google Cloud
       ↓
Google Cloud Platform             # 托管运行环境，监听 HTTP 请求并响应渲染 HTML
```

在 SSR 场景下，Firebase 会自动将 functions/index.js 中声明的 SSR 服务部署到 Cloud Run 容器服务 中，而不是传统的 Cloud
Functions 环境。这样可以支持长期监听并响应用户请求，实现全站服务端渲染能力。

### 🔃 本地 SSR 与线上部署

为了兼顾本地开发和线上部署，项目保留了两套 SSR 服务入口：

- `functions/build/server/index.js`：复制于 `build/server/index.js`，部署到 Firebase 的 SSR 入口。
- [`server.js`](../../server.js)：用于本地测试 SSR 功能，无需部署，可通过 `npm start` 命令直接启动。

  通过 [`package.json`](../../package.json) 可见，该命令实际上调用了：
  ```json
  "start": "node server.js"
  ```
  [`server.js`](../../server.js) 会读取本地构建产物 `build/server/index.js`， 并使用 Express 启动 SSR
  服务，监听 http://localhost:3000。

二者逻辑几乎完全相同，唯一的区别在于 `server.js` 持续监听 http://localhost:3000，而 `functions/build/server/index.js` 则由
Firebase 托管。

### 📁 部署相关配置说明：

- [`firebase.json`](../../firebase.json)：定义托管目录（如 `build/client/`）、重写规则（如所有请求代理到 SSR 入口）。
- [`.firebaserc`](../../.firebaserc)：记录当前 Firebase 项目 ID 及别名，供 CLI 工具使用。
- [`functions/index.js`](../../functions/index.js)：部署到 Cloud Functions 的 SSR 服务入口，会引入 `build/server/index.js`
  中导出的路由处理函数。
- [`functions/package.json`](../../functions/package.json)：定义 Cloud Functions 环境所需依赖及运行时（Node.js）版本。

首次部署成功后，可通过 Firebase 提供的托管域名访问：https://anime-vista.web.app/

> 🔐 若首次访问报错 `403 Forbidden`，请确保已通过 Google Cloud Console 或 `gcloud` 为 SSR 函数开放匿名访问权限。


