> 🌐 查看英文版: [English](./README.md)

# 📚 API 使用说明文档

## 1. Postman 简介与使用建议

开发过程中推荐使用 [Postman](https://www.postman.com/)，它是一款功能强大的 API 开发与测试工具，可用于发送请求、查看响应、调试接口、管理请求集合等。

- [Postman 官网](https://www.postman.com/)
- [Postman 客户端下载地址](https://www.postman.com/downloads/)

建议在开发或调试过程中，使用 Postman 来快速验证 API 请求是否符合预期。

## 2. API 通信类型

在本项目中，前端与后端的通信主要分为以下两种类型：

- 公共 API：使用第三方服务 [AniList](https://anilist.co/) 提供的数据，主要用于获取动漫的公共信息，如番剧详情、排行榜、搜索结果等
    - [AniList 官方指南](https://docs.anilist.co/guide/introduction)
    - [AniList API 参考文档](https://docs.anilist.co/reference/)

- 私有 API：与项目组 Firestore 数据库通信的私有 API，用于获取与用户相关的信息，如收藏、动态等

## 3. 公共 API

AniList 提供的 API 使用 **GraphQL** 协议进行通信，GraphQL 是一种灵活且高效的 API 查询语言，允许客户端指定所需的数据结构，从而减少不必要的数据传输。
更多信息请参考 [GraphQL 官方文档](https://graphql.org/learn/)。

### 3.1 公共 API 基本信息

所有请求统一使用以下设置：

- 请求地址（URL）：`https://graphql.anilist.co`
- 请求方法（Method）：`POST`
- 请求头（Headers）：

  ```json
  {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
  ```

- 请求体（Body）格式：
    ```json
    {
      "query": "...",
      "variables": { ... }
    }
    ```
  `query` 字段为必填项，`variables` 字段为可选项，具体内容见 <a href='#title-3-3'>3.3</a>。

### 3.2 Postman 支持 GraphQL 请求

Postman 内置了对 GraphQL 的支持，允许在请求体中直接填写 `query` 和可选的 `variables` 字段。

<details>
<summary>展开查看 Postman 使用教程</summary>

1. 打开 Postman，新建一个请求；
   ![1-add-request.png](assets/1-add-request.png)
2. 设置 **Method** 为 `POST`；
   ![2-POST-method.png](assets/2-POST-method.png)
3. 填写 URL 为：`https://graphql.anilist.co`；
   ![3-url-input.png](assets/3-url-input.png)
4. 在 **Headers** 标签页中，添加以下请求头：
    - `Content-Type`：`application/json`
    - `Accept`：`application/json`

   ![4-headers.png](assets/4-headers.png)

5. 进入 **Body** 标签页，选择 **GraphQL** 类型，填写相应的 `QUERY` 和 `GRAPHQL VARIABLES` 字段；
   ![5-graphql.png](assets/5-graphql.png)
6. 点击 **Send** 发送请求。
   ![6-send-result.png](assets/6-send-result.png)

</details>

### <span name='title-3-3'> 3.3 公共 API 页面使用情况总览 </span>

以下是使用公共 API 的页面、功能描述及对应的 GraphQL `query` 和 `variables` 参数样例：

- Current Season – List：获取所有当前季度新番
    <details>
    <summary>query</summary>

    ```
    query {
        Page(page: 1, perPage: 50) {
            media(season: SPRING, seasonYear: 2025, type: ANIME) {
                title {
                    romaji
                    english
                }
                coverImage {
                    large
                }
                trending
                startDate {
                    year
                    month
                    day
                }
            }
        }
    }
    ```
    </details>

    <details>
    <summary>variables</summary>

    ```
    {
        "page": 1,
        "perPage": 50
    }
    ```
    </details>


- Current Season – Timeline ：获取当前季度番剧的更新时间
    <details>
    <summary>query</summary>

    ```graphql
    query {
        Page(page: 1, perPage: 50) {
            media(season: SPRING, seasonYear: 2025, type: ANIME) {
                title {
                    romaji
                }
                coverImage {
                    large
                }
                airingSchedule {
                    edges {
                        node {
                            id
                            airingAt
                            episode
                            mediaId
                            media {
                                title {
                                    romaji
                                }
                                episodes
                            }
                        }
                    }
                }
            }
        }
    }
    ```
    </details>

    <details>
    <summary>variables</summary>

    ```
    无
    ```
    </details>

    - 注：获取结果后需自行排序
    - demo: [testCurrentSeason.html](example/testCurrentSeason.html)

- Home ：获取热门番剧
    <details>
    <summary>query</summary>

    ```
    query {
        Page(page: 1, perPage: 50) {
            media(sort: TRENDING, type: ANIME) {
                id
                title {
                    romaji
                    english
                }
                coverImage {
                    large
                }
                description
                averageScore
                popularity
                startDate {
                    year
                    month
                    day
                }
                genres
            }
        }
    }
    ```
    </details>

    <details>
    <summary>variables</summary>

    ```
    无
    ```
    </details>


- Search：根据用户条件搜索番剧
    <details>
    <summary>query</summary>

    ```graphql
    query ($search: String, $genres: [String], $year: Int, $season: MediaSeason, $format: MediaFormat, $status: MediaStatus) {
        Page(page: 1, perPage: 10) {
            media(search: $search, genre_in: $genres, seasonYear: $year, season: $season, format: $format, status: $status) {
                id
                title {
                    romaji
                    english
                }
                genres
                season
                seasonYear
                status
                format
                popularity
                averageScore
                startDate {
                    year
                    month
                    day
                }
                coverImage {
                    large
                }
            }
        }
    }
    ```
    </details>

    <details>
    <summary>variables</summary>

    ```
    {
        "search": null,
        "genres": ["Action", "Drama"],
        "year": null,
        "season": "SPRING",
        "format": "TV",
        "status": "FINISHED"
    }
    ```
    </details>

    <details>
    <summary>筛选条件取值范围</summary>

    1. **Genres**：
        - Action（动作）
        - Adventure（冒险）
        - Comedy（喜剧）
        - Drama（剧情）
        - Fantasy（奇幻）
        - Romance（爱情）
        - Sci-Fi（科幻）
        - Slice of Life（日常）
        - Others（其他）

    2. **Year**：
        - 2025
        - 2024
        - 2023
        - 2022
        - 2021
        - 2011-2020
        - 2000-2010
        - before 2000

    3. **Season**：
        - WINTER（冬季）
        - SPRING（春季）
        - SUMMER（夏季）
        - FALL（秋季）

    4. **Format**：
        - TV（电视动画）
        - TV_SHORT（短篇电视动画）
        - MOVIE（电影）
        - SPECIAL（特别篇）
        - OVA（原创视频动画）
        - ONA（原创网络动画）
        - MUSIC（音乐动画）

    5. **Airing Status**：
        - FINISHED（已完结）
        - RELEASING（连载中）
        - NOT_YET_RELEASED（未发布）
        - CANCELLED（已取消）
        - HIATUS（暂停中）

    </details>

    - demo: [testSearch.html](example/testSearch.html)

- Rank ：按 Trending、Rating、Popularity 排序获取排行榜
    <details>
    <summary>query</summary>

    ```graphql
    query ($page: Int = 1, $sort: [MediaSort]) {
        Page(page: $page, perPage: 10) {
            media(type: ANIME, sort: $sort) {
                id
                title {
                    romaji
                    english
                }
                popularity
                averageScore
                startDate {
                    year
                    month
                    day
                }
                coverImage {
                    large
                }
            }
        }
    }
    ```
    </details>

    <details>
    <summary>variables</summary>

    ```json
    { "page": 1, "sort": ["TRENDING_DESC"] }
    ```

  数组内仅有一个元素，三者之一：`["TRENDING_DESC"]`、`["SCORE_DESC"]` 或 `["POPULARITY_DESC"]`
    </details>

    - demo: [testRank.html](example/testRank.html)

- Details ：获取番剧的详细信息
    <details>

    <summary>query</summary>

    ```graphql
    query ($id: Int) {
        Media(id: $id) {
            id
            title {
                romaji
                english
            }
            coverImage {
                large
            }
            description
            genres
            averageScore
            meanScore
            popularity
            favourites
            status
            episodes
            duration
            format
            startDate {
                year
                month
                day
            }
            endDate {
                year
                month
                day
            }
            season
            studios(isMain: true) {
                nodes {
                    name
                }
            }
            characters(perPage: 10) {
                edges {
                    node {
                        id
                        name {
                            full
                        }
                        image {
                            large
                        }
                    }
                    role
                    voiceActors(language: JAPANESE) {
                        name {
                            full
                        }
                    }
                }
            }
            staff(perPage: 10) {
                edges {
                    node {
                        id
                        name {
                            full
                        }
                        image {
                            large
                        }
                    }
                    role
                }
            }
            relations {
                edges {
                    node {
                        id
                        title {
                            romaji
                            english
                        }
                        coverImage {
                            large
                        }
                        genres
                    }
                    relationType
                }
            }
        }
    }
    ```
    </details>

    <details>
    <summary>variables</summary>

    ```json
    { "id": 16498 }
    ```
    </details>

    - demo: [testDetails.html](example/testDetails.html)

## 4. CORS 与课程代理问题

我们尝试通过课程提供的代理来访问 AniList 的 GraphQL API，但经过测试和与课程助教的沟通后确认，该代理不支持带有 JSON 请求体的
POST 请求 —— 而这是 GraphQL 所必需的。因此，我们只能从前端直接调用该 API。

在正常使用下，这种方式运行良好。然而，在快速进行多次用户交互（例如迅速应用多个筛选条件）时，偶尔会遇到 CORS 错误或 API
的请求速率限制。由于 AniList API 有使用限制，并设置了前端应用无法控制的 CORS 头，该问题目前尚未解决。

我们已就此问题与助教进行了讨论，但未获得有效的解决方案。目前应用已部署在 Firebase 上，并在大多数常规使用场景下运行正常，尽管在高负载时问题仍可能出现。
