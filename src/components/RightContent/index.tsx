/*
 * @Author: Diana Tang
 * @Date: 2025-04-17 17:55:54
 * @LastEditors: Diana Tang
 * @Description: some description
 * @FilePath: /AI-Health-News-Agent-Ant/src/components/RightContent/index.tsx
 */

import { QuestionCircleOutlined } from '@ant-design/icons';
import { SelectLang as UmiSelectLang } from '@umijs/max';
import { useState } from 'react';
import AiDrawer from './AiDrawer';
import LogoButton from './LogoButton';

export type SiderTheme = 'light' | 'dark';

export const SelectLang = () => {
  return (
    <UmiSelectLang
      style={{
        padding: 4,
      }}
    />
  );
};

export const Question = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: 26,
      }}
      onClick={() => {
        window.open('https://pro.ant.design/docs/getting-started');
      }}
    >
      <QuestionCircleOutlined />
    </div>
  );
};

export const AiAssistant = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <>
      <LogoButton onClick={() => setDrawerVisible(true)} />
      <AiDrawer open={drawerVisible} onClose={() => setDrawerVisible(false)} />
    </>
  );
};
