> 🌐 查看英文版: [English](./README.md)

## 🔀 1. 路由系统设计（React Router v7）

本项目采用 React Router v7 作为 SPA 路由管理工具，并启用了其内建的服务端渲染（SSR）支持。在 React Router v7
中，官方提供了三种使用模式，分别适应不同的项目架构：

- Data Mode：这是最接近 React Router 原始 API 的形式，手动编写 `createBrowserRouter()` 和 `createRoutesFromElements()`
  等逻辑，适合灵活性要求高的项目。
- Declarative Mode：通过 JSX 组件结构（如 `<Routes>`, `<Route>`）声明路由，逻辑清晰、直观，是大多数中小型 SPA 的首选。
- Framework Mode：专为更大型项目设计，结合 `@react-router/dev` 工具链支持文件路由自动生成、SSR、构建优化等功能，是目前最正式、最推荐的架构模式。

本项目采用 Framework Mode，以实现统一的 SSR 构建流程、高度的可配置性和简洁的路由声明方式。

## 📁 2. 路由相关目录结构与文件说明

项目使用的 Framework 模式依赖以下文件与目录：

### 📁 `src/routes/`

- [`entry.client.jsx`](../../src/routes/entry.client.jsx)：
  客户端入口文件，使用 `<HydratedRouter>` 将服务端渲染的内容激活（hydrate）为交互式 React 应用。

- [`root.jsx`](../../src/routes/root.jsx)：
  应用的根布局组件，定义通用结构如 `<TopBar>`, `<SideBar>`，并使用 `<Outlet>`
  作为嵌套路由的挂载点。

- [`routes.js`](../../src/routes/routes.js)：
  路由配置文件，使用 `@react-router/dev/routes` 提供的 `route()` 和 `index()` 工具构建完整的路由树。

### 📁 根目录

- [`.react-router/`](../../.react-router)：
  构建缓存目录，由 `@react-router/dev` 自动生成，用于生成中间产物（如路由模块依赖图），无需手动修改，可加入 `.gitignore`。

- [`react-router.config.js`](../../react-router.config.js)：
  配置文件，声明路由目录位置（`src/routes`）及启用 SSR 模式：

## ⚙️ 3. 构建指令与自定义脚本

在 `package.json` 中，路由系统相关的脚本配置如下：

```json
"scripts": {
"dev": "react-router dev",
"build": "react-router build && node scripts/copySSR.mjs",
"start": "node server.js"
}
```

- `react-router dev`：启动开发服务器，支持 SSR 和热重载。
- `react-router build`：生成 SSR+客户端的构建产物。
- `node scripts/copySSR.mjs`：自定义脚本，将 SSR 产物复制到 Firebase Functions 目录，便于部署。

## 🐞 4. 开发中遇到的陷阱与解决方案

### 4.1 路由声明结构

在声明路由时，必须使用如下格式：

```js
export default [
    index('../presenters/HomePresenter.jsx'),
    route('about', '../presenters/AboutPresenter.jsx'),
    route('current', '../presenters/CurrentPresenter.jsx'),
    route('details/:id', '../presenters/DetailsPresenter.jsx'),
    route('login', '../presenters/LoginRegisterPresenter.jsx'),
    route('rank', '../presenters/RankPresenter.jsx'),
    route('search', '../presenters/SearchPresenter.jsx'),
    route(':userNumber', '../presenters/MePresenter.jsx')
]
```

而不能写成：

```js
export default [
    route('', './root.jsx', [
        index('../presenters/HomePresenter.jsx'),
        ...
    ])
]
```

原因在于 React Router 编译构建时，会将第一层 `index()` 的路径视为根节点，并默认其 `id = "root"`、`parentId = ""` 要求为
`""`。
当你嵌套一层 `route('', './root.jsx', [...])` 时，React Router 会错误地生成 `parentId: 'root'`，导致 SSR 渲染失败。


> 可参考源码逻辑：`@react-router/dev/dist/vite.js` 第 3953 行附近的 `createPrerenderRoutes()` 中，通过
`routesByParentId['']` 获取根节点。

因此需避免人为嵌套根节点，将所有一级页面直接声明为顶层数组项，并在 `root.jsx` 中通过 `<Outlet>` 实现统一的布局挂载。

### 4.2 路由声明顺序

```js
export default [
    index('../presenters/HomePresenter.jsx'),
    ...
    route(':userNumber', '../presenters/MePresenter.jsx') // 必须放在最后
]
```

我们想实现的功能是，通过 `:userNumber` 直接跳转到个人主页，而其余 `about` 等路由跳转到其余页面。

在大多数前端路由库（包括 React Router 和类似的自定义实现）中，顺序决定了优先级，越靠前的路由，匹配优先级越高。路由系统会按你定义的顺序依次检查每一条路由，一旦找到第一个匹配的路由，就不会继续向下匹配。

`:userNumber` 是一个 动态参数路由，它会匹配任何路径段。为了避免它抢先匹配如 `about`、`login`
等具体路径，必须将其放在**最后一行**，这样只有在前面的具体路径都不匹配时，它才会生效。如果放在前面，会“吞掉”本应被更精确路由处理的路径。