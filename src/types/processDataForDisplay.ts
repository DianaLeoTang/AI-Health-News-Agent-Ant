/*
 * @Author: Diana Tang
 * @Date: 2025-03-10 10:36:16
 * @LastEditors: Diana Tang
 * @Description: some description
 * @FilePath: /AI-Health-News-Agent-Ant/types/processDataForDisplay.ts
 */
/**
 * 定义数据项的接口
 */
export interface DataItem {
  url: string;
  status: string;
  statusCode: number;
  timestamp?: number;
  fromCache?: string;
  links?: LinkItem[];
  // 其他可能的属性
  [key: string]: any;
}

/**
 * 定义链接项的接口
 */
export interface LinkItem {
  url: string;
  title: string;
  // 其他可能的属性
  [key: string]: any;
}

/**
 * 处理选项接口
 */
export interface ProcessOptions {
  maxLinks?: number;  // 最大链接数量，默认为50
  filterSuccess?: boolean;  // 是否只保留成功状态，默认为true
}
