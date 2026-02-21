> 🌐 查看英文版: [English](./README.md)

# 📦 Redux 状态结构说明文档

## 1. Redux 简介与 useState 的区别

Redux 是一个用于 JavaScript 应用的可预测状态容器，常用于中大型 React 项目中以集中管理全局状态。与 React 自带的 `useState`
相比，Redux 更适用于多个组件共享状态或管理复杂业务逻辑的场景。

- `useState` 适用于局部组件状态，状态逻辑简单、范围局限。
- Redux 使用全局的 store 来管理所有状态，组件之间可通过 `useSelector` 和 `useDispatch` 与状态交互。

Redux 的核心包括：

- Store：统一存储应用状态的地方
- Action：描述状态变化的普通对象
- Reducer：处理 action 并返回新状态的函数
- Middleware（如 Redux Thunk）：用于处理异步逻辑

## 2. Redux 在本项目中的用法与功能

在本项目中，Redux 主要用于管理多个模块（slice）的状态，每个模块代表一个独立的业务域，集中管理其状态逻辑。

使用的关键技术包括：

- Redux Toolkit：用于简化 Redux 使用方式，内置 `createSlice` 和 `configureStore` 等工具。
- Redux Thunk：用于支持异步请求，如调用后端 API 获取数据并更新状态。

状态通过 `src/models` 目录中的多个 slice 进行模块化管理，各个模块协同维护整个应用的状态。

例如以下是一个较为简洁、结构充分的 Slice 文件样例：

```js
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    user: null,
};

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        loginWithEmail: (state, action) => {
            state.user = action.payload;
        },
    },
});

export const {loginWithEmail} = loginSlice.actions;
export default loginSlice.reducer;
```

每个 slice 中都包含一个或多个 reducer，它们是 Redux 的核心组成部分。Reducer 是纯函数，用于根据不同的 action 描述如何更新状态。在
Redux Toolkit 中，这些 reducer 是通过 createSlice 自动生成的，每个 reducer 对应一个状态变更的逻辑，例如登录、登出、加载成功等。

组件中并不直接操作状态，而是通过触发 action 来调用 reducer，由 reducer 决定如何改变状态：

- `useSelector`：用于从 Redux store 中读取状态。例如，获取当前用户信息：

  ```js
  const user = useSelector((state) => state.login.user);
  ```
  它会自动订阅 Redux 状态的变化，确保组件在相关状态变更时自动更新。

- `useDispatch`：用于触发 Redux 的 action，包括同步和异步（thunk）操作。例如，进行用户登录操作：

  ```js
  const dispatch = useDispatch();
  dispatch(loginWithEmail({ email: 'test@example.com', password: '123456' }));
  ```

## 3. src/models 目录架构与功能说明

### 3.1 目录架构

以下是 `src/models/` 目录架构的简要说明：

|                        目录                         | 对应页面                                      |
|:-------------------------------------------------:|-------------------------------------------|
| [authentication](../../src/models/authentication) | Login / Registration                      |
|        [current](../../src/models/current)        | Current                                   |
|        [details](../../src/models/details)        | Details                                   |
|      [developer](../../src/models/developer)      | About<br>后调整为从 firebase 获取开发者信息<br>故该文件置空 |
|           [home](../../src/models/home)           | Home                                      |
|             [me](../../src/models/me)             | Me                                        |
|           [rank](../../src/models/rank)           | Rank                                      |
|         [search](../../src/models/search)         | Search                                    |

### 3.2 功能说明

以下是 `src/models`中各文件的功能介绍：

以下是每个文件的功能总结：

- [loginSlice.js](../../src/models/authentication/loginSlice.js)
    - 功能：处理用户认证相关的状态和逻辑。
    - 主要操作：
        - 提供注册、登录（邮箱和Google）、密码重置、登出等异步操作。
        - 使用 Firebase 进行用户认证，更新用户信息（如用户名和头像）。
        - 管理用户登录状态、错误信息和加载状态。
    - 状态：
        - `error`：存储认证过程中的错误信息。
        - `isLoading`：标记操作是否正在进行。
        - 登录成功后存储用户信息（UID、用户名、头像等）。


- [listSlice.js](../../src/models/current/listSlice.js)
    - 功能：管理当前季节动漫列表的状态和分页逻辑。
    - 主要操作：
        - 获取当前季节的动漫列表（分页加载）。
        - 获取当前季节动漫的总数量（用于分页）。
        - 支持分页切换。
    - 状态：
        - `seasonAnime`：存储当前季节的动漫列表。
        - `currentPage` 和 `totalPages`：管理分页信息。
        - `status` 和 `error`：标记加载状态和错误信息。


- [timelineSlice.js](../../src/models/current/timelineSlice.js)
    - 功能：管理动漫时间线（按播出日期分组）的状态和逻辑。
    - 主要操作：
        - 获取当前季节的动漫列表及其播出时间表。
        - 按日期分组动漫，并排序。
        - 支持分页切换。
    - 状态：
        - `seasonAnime`：存储当前季节的动漫列表。
        - `groupedAnime`：按日期分组的动漫数据。
        - `currentPage` 和 `totalPages`：管理分页信息。
        - `status` 和 `error`：标记加载状态和错误信息。


- [detailsSlice.js](../../src/models/details/detailsSlice.js)
    - 功能：管理单个动漫详情的状态和逻辑。
    - 主要操作：
        - 根据动漫 ID 获取详细信息（如标题、封面、评分、角色、制作团队等）。
    - 状态：
        - `anime`：存储当前动漫的详细信息。
        - `status` 和 `error`：标记加载状态和错误信息。

- [popularityListSlice.js](../../src/models/home/popularityListSlice.js)
    - 功能：管理热门动漫列表的状态和分页逻辑。
    - 主要操作：
        - 获取热门动漫列表（按趋势排序）。
        - 支持分页切换。
    - 状态：
        - `list`：存储热门动漫列表。
        - `currentPage` 和 `totalPages`：管理分页信息。
        - `status` 和 `error`：标记加载状态和错误信息。

- [meSlice.js](../../src/models/me/meSlice.js)
    - 功能：管理用户个人中心的状态（如收藏和活动记录）。
    - 主要操作：
        - 支持分页切换用户收藏和活动记录。
        - 提供批量获取动漫数据的异步操作（用于收藏列表）。
    - 状态：
        - `favorites` 和 `activities`：分别管理收藏和活动记录的分页信息。


- [rankingSlice.js](../../src/models/rank/rankingSlice.js)
    - 功能：管理动漫排行榜的状态和逻辑。
    - 主要操作：
        - 获取排行榜数据（支持按不同排序方式，如趋势、评分等）。
        - 支持分页切换和排序方式切换。
    - 状态：
        - `list`：存储排行榜数据。
        - `sortType`：当前排序方式。
        - `currentPage` 和 `totalPages`：管理分页信息。
        - `status` 和 `error`：标记加载状态和错误信息。


- [fetchTotalSlice.js](../../src/models/search/fetchTotalSlice.js)
    - 功能：辅助模块，用于获取符合筛选条件的动漫总数。
    - 主要操作：
        - 根据筛选条件（如类型、年份、季节等）查询匹配的动漫总数。
        - 用于分页和搜索结果的统计。

- [filterSlice.js](../../src/models/search/filterSlice.js)
    - 功能：管理搜索和筛选条件的状态。
    - 主要操作：
        - 更新筛选条件（如类型、年份、季节等）。
        - 重置筛选条件或切换分页。
    - 状态：
        - 存储当前筛选条件（如 `search`、`genres`、`year` 等）。
        - `page` 和 `perPage`：管理分页信息。

- [resultSlice.js](../../src/models/search/resultSlice.js)
    - 功能：管理动漫搜索结果的状态和逻辑。
    - 主要操作：
        - 提供异步操作 `fetchSearchResults`，根据筛选条件（如搜索词、类型、年份等）从 AniList API 获取匹配的动漫列表。
        - 支持分页（通过 `fetchTotalCount` 计算总页数）。
        - 提供清除结果（`clearResults`）和设置分页（`setSearchPage`）的同步操作。
    - 状态：
        - `results`：存储搜索结果列表。
        - `currentPage` 和 `totalPages`：管理分页信息。
        - `total`：匹配筛选条件的动漫总数。
        - `loading` 和 `error`：标记加载状态和错误信息。
    - 依赖：
        - 使用 `fetchTotalSlice.js` 的 `fetchTotalCount` 异步操作来统计总数。


