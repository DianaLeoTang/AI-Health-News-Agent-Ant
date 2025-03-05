/*
 * @Author: Diana Tang
 * @Date: 2025-03-05 13:11:30
 * @LastEditors: Diana Tang
 * @Description: some description
 * @FilePath: /AI-Health-News-Agent-Ant/src/pages/Hotspot/index.tsx
 */
import React, { useState } from 'react';
import { List,Card} from 'antd';
import {FireTwoTone }from '@ant-design/icons';
import {hotpot} from './data'
type PaginationPosition = 'top' | 'bottom' | 'both';

type PaginationAlign = 'start' | 'center' | 'end';



const Hotspot: React.FC = () => {
  const [position, setPosition] = useState<PaginationPosition>('bottom');
  const [align, setAlign] = useState<PaginationAlign>('end');
  const [defaultPageSize,]=useState(100)

  return (
    <>
     <Card>
      <List
        pagination={{ position, align ,defaultPageSize}}
        dataSource={hotpot}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={<><FireTwoTone /> <span>{index + 1}.</span></>}
              title={<a href="https://ant.design">{item.title}</a>}
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
