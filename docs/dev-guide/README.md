> 🌐 View in Chinese: [简体中文](./README.zh-CN.md)

## 🚀 Project Setup Instructions

After cloning the project, navigate to the root directory and install the required dependencies:

```bash
npm install
```

Then, choose one of the following options depending on your needs:

1. Local Development Mode: Start the local development server. Visit `http://localhost:5173` to view the project:

    ```bash
    npm run dev
    ```

2. Local SSR Testing: Start a local server to test Server-Side Rendering (SSR). Visit `http://localhost:3000`:

    ```bash
    npm run build
    npm start
    ```

3. Deploy to Firebase

    First, copy the `dependencies` section from the root `package.json` into `functions/package.json`, making sure to retain the required deployment packages `firebase-admin` and `firebase-functions`:

    ```json
    "dependencies": {
      "firebase-admin": "^12.6.0",
      "firebase-functions": "^6.3.2",
      ...
    }
    ```

    Then deploy the project to Firebase Hosting + Cloud Functions from the root directory:

    ```bash
    npm run build
    cd functions
    npm install
    cd ..
    firebase deploy
    ```

## ✅ Git Commit Convention

### 🌱 Angular Commit Convention

This project follows
the [Angular commit message format](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)
for standardized commit messages.

Example format:

```git
type(scope): subject

- detail point 1
- detail point 2

Related to #1234
```

Explanation:

- `type`: The type of this commit (e.g., `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, etc.)
- `scope`: The scope of the changes in this commit (optional)
- `subject`: A concise description of the changes
- `detail point`: More detailed notes about the commit (optional)
- `Related to #1234`: Reference to a related issue number

👉 For more details, refer to:

- [Angular Commit Message Guidelines](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)
- [Simplified Chinese Guide](https://zj-git-guide.readthedocs.io/zh-cn/latest/message/Angular%E6%8F%90%E4%BA%A4%E4%BF%A1%E6%81%AF%E8%A7%84%E8%8C%83/)

### 🔒 Commit Message Check Tools: Husky + Commitlint

To ensure all commit messages follow the Angular convention, this project integrates the following automated tools:

- [Husky](https://typicode.github.io/husky/): Automatically triggers hook scripts when `git commit` is executed
- [Commitlint](https://commitlint.js.org/): Parses and validates commit message format

When you run `git commit -m "..."`, Husky will automatically run Commitlint to check the message format. If the message
is not compliant, the commit will be rejected with suggested corrections.

> 💡 After cloning the project for the first time, run `npm install` to install dependencies and initialize Husky hooks.

## 🌿 Branch Naming Guide

| Branch Name                               | Description                                               |
|-------------------------------------------|-----------------------------------------------------------|
| `main`                                    | Main branch for deployment; must remain stable and tested |
| `dev`                                     | Main development branch; integrates feature branches      |
| `build/1-create-framework`                | Initializes the project structure and directories         |
| `feat/3-page-development-home`            | Development of the `Home` page                            |
| `feat/5-page-development-current`         | Development of the `Current` page                         |
| `feat/6-page-development-search`          | Development of the `Search` page                          |
| `feat/8-page-development-me`              | Development of the `Me` page                              |
| `feat/9-page-development-details`         | Development of the `Details` page                         |
| `feat/10-page-development-login-register` | Development of the `Login/Register` page                  |
| `feat/11-page-development-about`          | Development of the `About` page                           |
| `feat/13-page-router`                     | Project routing maintenance                               |
| `docs/2-documentation-update`             | Documentation updates and maintenance                     |

> ✅ It is recommended to branch off from `dev` for any new feature development and merge back into `dev` upon
> completion.
