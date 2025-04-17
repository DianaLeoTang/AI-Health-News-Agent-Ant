/*
 * @Author: Diana Tang
 * @Date: 2025-04-17 18:00:42
 * @LastEditors: Diana Tang
 * @Description: some description
 * @FilePath: /AI-Health-News-Agent-Ant/src/components/RightContent/LogoButton.tsx
 */
import { OpenAIOutlined } from '@ant-design/icons';
import { Button } from 'antd';

interface LogoButtonProps {
  onClick: () => void;
}

export default function LogoButton({ onClick }: LogoButtonProps) {
  return (
    <Button
      type="primary"
      shape="circle"
      icon={<OpenAIOutlined size={20} />}
      className="ai-assistant-button"
      onClick={onClick}
    ></Button>
  );
}
