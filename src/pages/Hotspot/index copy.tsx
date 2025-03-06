/*
 * @Author: Diana Tang
 * @Date: 2025-03-05 13:11:30
 * @LastEditors: Diana Tang
 * @Description: some description
 * @FilePath: /AI-Health-News-Agent-Ant/src/pages/Hotspot/index.tsx
 */
import React, { useState,useEffect } from 'react';
import { List,Card,Button} from 'antd';
import {FireTwoTone ,SearchOutlined}from '@ant-design/icons';
import { FormattedMessage, useIntl } from '@umijs/max';

import {hotpot} from './data'

import {getHotpot} from '@/services/ant-design-pro/api';
type PaginationPosition = 'top' | 'bottom' | 'both';

type PaginationAlign = 'start' | 'center' | 'end';
// 定义新闻项的类型
interface NewsItem {
  title: string;
  link: string;
  summary: string;
}


const Hotspot: React.FC = () => {
  const [position, setPosition] = useState<PaginationPosition>('bottom');
  const [align, setAlign] = useState<PaginationAlign>('end');
  const [defaultPageSize,]=useState(100)
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const intl = useIntl();

  const fetchNews = async () => {
    try {
      console.log('开始请求新闻数据...');

      // 使用相对路径通过API路由获取数据
      // const response = await fetch('/api/news');
      const response = await getHotpot();
      console.log(response,'已经有结果了吗');
      if (!response.ok) {
        throw new Error(`HTTP错误! 状态: ${response.status}`);
      }

      const data = response.data;
      console.log('获取到的数据:', data);

      setNews(data);
    } catch (error) {
      console.error('获取新闻错误:', error);

    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchNews();
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
      <List
        pagination={{ position, align ,defaultPageSize}}
        dataSource={news}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={<><FireTwoTone /> <span>{index + 1}.</span></>}
              title={<a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                >{item.title}</a>}
              description={item.summary}
            />
          </List.Item>
        )}
      />
      </Card>
    </>
  );
};

export default Hotspot;
