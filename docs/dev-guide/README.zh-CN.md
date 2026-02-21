> 🌐 查看英文版: [English](./README.md)

## 🚀 项目运行说明

克隆项目后，在项目根目录下执行以下命令以安装所需依赖库：

```bash
npm install
```

然后根据需要选择以下一种功能：

1. 本地开发模式：启动本地开发服务器，访问 `http://localhost:5173` 即可查看项目。

   ```bash
   npm run dev
   ```

2. 本地 SSR 测试：启动本地 SSR 测试服务器，访问 `http://localhost:3000` 即可查看项目。
   ```bash
   npm run build
   npm start
   ```

3. 部署到 Firebase：

   首先复制根目录下 `package.json` 的 `dependencies` 至 `functions/package.json`，但需保留部署所需的 `firebase-admin` 和
   `firebase-functions`：
   ```json
    "dependencies": {
      "firebase-admin": "^12.6.0",
      "firebase-functions": "^6.3.2",
      ...
    },
   ```

   然后在根目录下将项目部署到 Firebase Hosting + Cloud Functions：

   ```bash
   npm run build
   cd functions
   npm install
   cd ..
   firebase deploy
   ```

## ✅ Git 提交规范

### 🌱 Angular 提交规范

本项目采用 [Angular 提交信息格式](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)
进行规范化提交。

示例格式如下：

```git
type(scope): subject

- detail point 1
- detail point 2

Related to #1234
```

其中：

- `type`：本次提交的类型（例如 `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore` 等）
- `scope`：本次提交影响的模块范围（可选）
- `subject`：简明扼要的变更内容
- `detail point`：详细描述本次提交的变更内容（可选）
- `Related to #1234`：关联的 issue 编号

👉 更多格式说明可参考：

- [Angular Commit Message 原文](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)
- [中文简明指南](https://zj-git-guide.readthedocs.io/zh-cn/latest/message/Angular%E6%8F%90%E4%BA%A4%E4%BF%A1%E6%81%AF%E8%A7%84%E8%8C%83/)

### 🔒 Commit Message 检查工具：Husky + Commitlint

为了确保所有提交信息都符合上述 Angular 提交规范，项目已集成以下自动化校验工具：

- [Husky](https://typicode.github.io/husky/)：用于在执行 `git commit` 时自动触发钩子（hook）脚本
- [Commitlint](https://commitlint.js.org/)：用于解析并检查提交信息格式是否合规

当执行 `git commit -m "..."` 时，`husky` 会自动运行 `commitlint`，校验提交信息格式。如果格式不符合规范，提交将被拒绝，并提示修正建议。

> 💡 若首次克隆项目，请先运行 `npm install` 以自动安装依赖并初始化 Husky 钩子。

## 🌿 分支说明

| Branch 名称                                 | 功能介绍                   |
|-------------------------------------------|------------------------|
| `main`                                    | 主分支，部署和发布用，代码必须稳定、通过测试 |
| `dev`                                     | 开发主线，用于集成各个功能分支的代码     |
| `build/1-create-framework`                | 创建项目文件和目录框架            |
| `feat/3-page-development-home`            | `Home` 页面开发            |
| `feat/5-page-development-current`         | `Current` 页面开发         |
| `feat/6-page-development-search`          | `Search` 页面开发          |
| `feat/8-page-development-me`              | `Me` 页面开发              |
| `feat/9-page-development-details`         | `Details` 页面开发         |
| `feat/10-page-development-login-register` | `Login/Register` 页面开发  |
| `feat/11-page-development-about`          | `About` 页面开发           |
| `feat/13-page-router`                     | 项目路由维护                 |
| `docs/2-documentation-update`             | 项目文档维护                 |

> ✅ 所有新功能建议从 `dev` 分支拉出新分支进行开发，完成后合并回 `dev`。

