/*
 * @Author: Diana Tang
 * @Date: 2025-04-17 18:00:25
 * @LastEditors: Diana Tang
 * @Description: some description
 * @FilePath: /AI-Health-News-Agent-Ant/src/components/RightContent/AiDrawer.tsx
 */
import { AIChatStream } from '@/services/ant-design-pro/api';
import { Button, Drawer, Input, message } from 'antd';
import { useState } from 'react';

interface AiDrawerProps {
  open: boolean;
  onClose: () => void;
}

// interface Message {
//   role: 'user' | 'assistant';
//   content: string;
// }

// interface ApiResponse {
//   choices: {
//     message: {
//       content: string;
//     };
//   }[];
// }

export default function AiDrawer({ open, onClose }: AiDrawerProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  // const handleAsk = async () => {
  //   const res = await AIChat();

  //   const data: ApiResponse = await res.json();
  //   setAnswer(data.choices?.[0]?.message?.content || 'AI无回应');
  // };

  const handleAsk = async () => {
    setAnswer(''); // 清空回答
    try {
      await AIChatStream([{ role: 'user', content: question }], (delta: string) => {
        setAnswer((prev) => prev + delta); // 实时更新
      });
    } catch (e) {
      message.error('对话失败，请稍后再试');
    }
  };

  return (
    <Drawer title="AI 对话助手" placement="right" width={400} onClose={onClose} open={open}>
      <div className="flex flex-col gap-4">
        <Input.TextArea
          rows={4}
          placeholder="请输入你的问题"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Button type="primary" onClick={handleAsk}>
          提问
        </Button>
        <div className="bg-gray-100 p-3 rounded whitespace-pre-line text-sm">{answer}</div>
      </div>
    </Drawer>
  );
}
