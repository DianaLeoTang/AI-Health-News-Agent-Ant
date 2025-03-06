/*
 * @Author: Diana Tang
 * @Date: 2025-03-05 12:29:45
 * @LastEditors: Diana Tang
 * @Description: some descript着
 * @FilePath: /AI-Health-News-Agent-Ant/src/services/ant-design-pro/api.ts
 */
// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://ai-health-news-back.netlify.app/.netlify/functions/api'
  : 'http://localhost:4000';
/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>(`${baseURL}/currentUser`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${baseURL}/login/outLogin`, {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>(`${baseURL}/login/account`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>(`${baseURL}/notices`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>(`${baseURL}/rule`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>(`${baseURL}/rule`, {
    method: 'POST',
    data:{
      method: 'update',
      ...(options || {}),
    }
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>(`${baseURL}/rule`, {
    method: 'POST',
    data:{
      method: 'post',
      ...(options || {}),
    }
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${baseURL}/rule`, {
    method: 'POST',
    data:{
      method: 'delete',
      ...(options || {}),
    }
  });
}
// 热点新闻接口
export async function getHotpot(options?: { [key: string]: any }){
  return request<Record<string, any>>(`${baseURL}/news`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}
