/*
 * @Author: Diana Tang
 * @Date: 2025-03-05 13:11:30
 * @LastEditors: Diana Tang
 * @Description: some description
 * @FilePath: /AI-Health-News-Agent-Ant/src/pages/SimpleHotspot/index.tsx
 */
import { FireTwoTone, SearchOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Button, Card, List, Tag,Spin } from 'antd';
import React, { useEffect, useState } from 'react';

import { getHotpot } from '@/services/ant-design-pro/api';
import {processDataForDisplay} from '../../utils/processDataForDisplay'
import { newsMock } from './mock';
// type PaginationPosition = 'top' | 'bottom' | 'both';

// type PaginationAlign = 'start' | 'center' | 'end';
// 定义新闻项的类型
interface NewsItem {
  title: string;
  link: string;
  summary: string;
}

const Hotspot: React.FC = () => {

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const intl = useIntl();

  const fetchNews = async () => {
    try {
      console.log('开始请求新闻数据...');

      // 使用相对路径通过API路由获取数据
      // const response = await fetch('/api/news');
      const response = await getHotpot();
      console.log(response, '已经有结果了吗');
      if (!response.ok) {
        throw new Error(`HTTP错误! 状态: ${response.status}`);
      }

      const data = response.data;
      console.log('获取到的数据:', data);
      const defaultProcessed = processDataForDisplay(data||[],{maxLinks: 30,});
      console.log('获取到的数据修改后:', defaultProcessed);
      setNews(defaultProcessed);
    } catch (error) {
      console.error('获取新闻错误:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchMock=()=>{
    const defaultProcessed = processDataForDisplay(newsMock||[],{maxLinks: 30,});
    setNews(defaultProcessed);
    setLoading(false);
  }
  useEffect(() => {
    // fetchNews();
    fetchMock()
  }, []);
  return (
    <>
      <Card>
        <Button type="primary" icon={<SearchOutlined />} onClick={fetchNews}>
          {intl.formatMessage({
            id: 'pages.publicHealthHotspots.search.button',
            defaultMessage: 'Search',
          })}
        </Button>
        <Spin spinning={loading}>
        {/* 第一级标题：提取extracted中的title和url，用Tag组件渲染 */}
        {news &&
          news.map(
            (itemNew, index) =>
              itemNew.status === 'success' && (
                <>
                  <div key={index} style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <a href={itemNew.extracted?.url} target="_blank" rel="noreferrer" >
                      <Tag color="purple" style={{ fontSize: '18px' }}>
                        {itemNew.title}
                      </Tag>
                    </a>
                  </div>
                  {/* 二级标题：使用List组件渲染links数组 */}
                  {itemNew.links && itemNew.links.length > 0 && (
                    <List
                      itemLayout="horizontal"
                      dataSource={itemNew.links}
                      renderItem={(item, linkIndex) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <>
                                <FireTwoTone /> <span>{linkIndex + 1}.</span>
                              </>
                            }
                            title={
                              <a href={item.url} target="_blank" rel="noreferrer" >
                                {item.title}
                              </a>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  )}

                </>
              ),
          )}
          </Spin>
      </Card>
    </>
  );
};

export default Hotspot;
