> 🌐 View in Chinese: [简体中文](./README.zh-CN.md)

# 👥 Developer Role & Progress Documentation

This project involves four team members (Xianqing Zeng, Yuhang Lin, Ruotong Yang, Zhenghao Liu). It follows the
Model-View-Presenter (MVP) architecture, integrates Firebase for backend support, and implements frontend development
based on Figma prototypes.

This document outlines each member's specific responsibilities, the principles behind task distribution, and a detailed
task list to ensure clear progress tracking and accountability.

## 🎯 Task Distribution Principles

1. **Zeng Xianqing** is responsible for all UI prototype designs and is thus also tasked with ensuring style consistency
   across pages.
2. **Lin Yuhang** oversees not only frontend pages but also the integration of backend architecture with Firebase, all
   project documentation, and overall project progress.
3. **Ruotong Yang** and **Zhenghao Liu** focus on implementing page logic and reusable components. They do not need
   in-depth knowledge of
   the full architecture but should concentrate on effective code delivery.
4. Page responsibilities and additional duties are distributed to ensure an average workload of approximately 7 to 8
   points per person.

## 📦 Page Workload Assessment

| Page           | Description                                                 | Workload (pts) |
|----------------|-------------------------------------------------------------|----------------|
| Home           | Recommendations and trending shows, clear structure         | 3              |
| Current        | Includes List and Timeline views, relatively complex        | 4              |
| Search         | Multi-criteria filter, form interaction via React Hook Form | 3.5            |
| Rank           | Conditions + three sorting logics, simple structure         | 2.5            |
| Me             | Dual view: Favorites and Activities, involves user data     | 3.5            |
| Details        | Most components, complex data structure                     | 5              |
| Login/Register | Form handling + Firebase Auth                               | 1.5            |
| About          | Static page, displays developer info cards                  | 1.5            |

**Total Page Workload: 24.5 pts**

## 🔧 Non-Page Task Assessment

| Task                 | Description                                      | Points |
|----------------------|--------------------------------------------------|--------|
| Global Components    | Develop components used across multiple pages    | 1      |
| UI Consistency Check | Unified style adjustment after page completion   | 2.5    |
| Firebase Backend     | Initialization, Auth, DB abstraction, deployment | 2      |
| Documentation        | Architecture, component, API, user guide docs    | 3      |
| Routing              | React Router setup and path management           | 1      |

**Total Non-Page Workload: 7.5 pts**

## 🧩 Task Allocation by Member

| Member        | Page Tasks                                             | Other Duties                                             | Total |
|---------------|--------------------------------------------------------|----------------------------------------------------------|-------|
| Xianqing Zeng | Home (3) <br> Rank (2.5) <br> global components (1)    | UI Consistency Check (2.5)                               | 9     |
| Yuhang Lin    | Details (5)                                            | Firebase Support (2)<br>Documentation (3)<br>Routing (1) | 11    |
| Ruotong Yang  | Search (3.5) <br> Me (3.5)                             | -                                                        | 7     |
| Zhenghao Liu  | Current (4) <br> Login/Register (1.5) <br> About (1.5) | -                                                        | 7     |
