/*
 * @Author: Diana Tang
 * @Date: 2025-03-10 10:35:06
 * @LastEditors: Diana Tang
 * @Description: some description
 * @FilePath: /AI-Health-News-Agent-Ant/src/utils/processDataForDisplay.ts
 */
import {DataItem,ProcessOptions} from '../types/processDataForDisplay'

/**
 * 处理数据对象，可配置链接数量限制和是否过滤成功状态
 * @param data - 原始数据对象
 * @param options - 处理选项
 * @returns - 处理后的数据对象
 */
export function processDataForDisplay(
  data:DataItem[]=[],
  options: ProcessOptions = {}
): { ok: boolean; data: DataItem[] } {
  // 设置默认选项
  const defaultOptions: ProcessOptions = {
    maxLinks: 50,
    filterSuccess: true
  };

  // 合并选项
  const finalOptions = { ...defaultOptions, ...options };

  // 深拷贝数据以避免修改原始对象
  const result = JSON.parse(JSON.stringify(data));
let newResult
  // 如果需要，过滤出status为"success"的项目
  if (finalOptions.filterSuccess) {
    newResult= result.filter(item => item.status === "success");
  }

  // 对每个项目的links进行处理，限制最多显示指定数量
  newResult?.forEach(item => {
    if (item.links && Array.isArray(item.links) && item.links.length > finalOptions.maxLinks!) {
      item.links = item.links.slice(0, finalOptions.maxLinks);
    }
  });

  return newResult;
}
