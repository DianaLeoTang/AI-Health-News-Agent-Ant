﻿/*
 * @Author: Diana Tang
 * @Date: 2025-03-05 12:29:45
 * @LastEditors: Please set LastEditors
 * @Description: some description
 * @FilePath: /AI-Health-News-Agent-Ant/config/routes.ts
 */
/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/admin',
        redirect: '/admin/sub-page',
      },
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        component: './Admin',
      },
      {
        path: '/admin/Hotspot',
        name: 'hotspot',
        component: './Hotspot', // 对应 src/pages/Hotspot/index.tsx
      },
      // {
      //   path: '/admin/upload',
      //   name: 'upload',
      //   component: './Upload', // 对应 src/pages/Hotspot/index.tsx
      // },
      {
        path: '/admin/download',
        name: 'download',
        component: './Download', // 对应 src/pages/Hotspot/index.tsx
      },
      {
        path: '/admin/ai-news',
        name: 'ai-news',
        component: './AINews', // 对应 src/pages/Hotspot/index.tsx
      },
      {
        path: '/admin/spss',
        name: 'SPSS',
        // component: './SPSSGuide', // 对应 src/pages/Hotspot/index.tsx
        component: './SPSSOperationGuide',
      },
      {
        path: '/admin/mindMap',
        name: 'mindMap',
        // component: './SPSSGuide', // 对应 src/pages/Hotspot/index.tsx
        component: './MarkdownMindMap',
      },
    ],
  },
  {
    path: '/book',
    name: 'book',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/book',
        redirect: '/book/epidemiology',
      },
      {
        path: '/book/epidemiology',
        name: 'epidemiology',
        component: './Admin',
      },
      {
        path: '/book/public-health',
        name: 'public-health',
        component: './Hotspot', // 对应 src/pages/Hotspot/index.tsx
      },
      {
        path: '/book/social-medicine',
        name: 'social-medicine',
        component: './NovelReader', // 对应 src/
        // pages/Hotspot/index.tsx
      },
      {
        path: '/book/statistics',
        name: 'statistics',
        component: './Admin',
      },
    ],
  },
  // 新增顶层路由，所有用户可访问
  {
    path: '/hotspot',
    name: 'hotspot',
    icon: 'fire', // 可以选择适合的图标
    component: './SimpleHotspot',
  },
  {
    path: '/download',
    name: 'download',
    icon: 'download',
    component: './Download', // 对应 src/pages/Hotspot/index.tsx
  },
  {
    path: '/entryExam',
    name: 'entryExam',
    icon: 'download',
    component: './VideoPlay', // 对应 src/pages/Hotspot/index.tsx
  },
  // {
  //   path: '/',
  //   component: '@/layouts/BasicLayout',
  //   routes: [
  //     { path: '/', component: '@/pages/Bookshelf' },
  //     { path: '/reader/:bookId', component: '@/pages/NovelReader' },
  //     { path: '/upload', component: '@/pages/Upload' },
  //   ],
  // },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
