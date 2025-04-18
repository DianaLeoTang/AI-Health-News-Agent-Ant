/*
 * @Author: Diana Tang
 * @Date: 2025-04-17 18:00:25
 * @LastEditors: Diana Tang
 * @Description: 支持Markdown渲染的AI助手抽屉组件
 * @FilePath: /AI-Health-News-Agent-Ant/src/components/RightContent/AiDrawer.tsx
 */
import { AIChatStream } from '@/services/ant-design-pro/api';
import { CopyOutlined } from '@ant-design/icons';
import { Button, Drawer, Input, message, Tooltip, Typography } from 'antd';
import { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

const { Title, Paragraph } = Typography;

interface AiDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function AiDrawer({ open, onClose }: AiDrawerProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const lastClickRef = useRef<number>(0);

  const handleAsk = async () => {
    const now = Date.now();
    // 1. 节流控制：两次点击间隔必须 >= 1.5 秒
    if (now - lastClickRef.current < 1500) return;

    lastClickRef.current = now;
    setLoading(true);
    setAnswer('');
    try {
      await AIChatStream(question, 'user', (delta: string) => {
        setAnswer((prev) => prev + delta);
      });
    } catch (e) {
      message.error('对话失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer title="AI 对话助手" placement="right" width={480} onClose={onClose} open={open}>
      <div className="flex flex-col gap-4">
        <Input.TextArea
          rows={4}
          placeholder="请输入你的问题"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Button
          type="primary"
          onClick={handleAsk}
          loading={loading}
          disabled={loading || !question.trim()}
        >
          {loading ? '提问中...' : '提问'}
        </Button>
        {/* 复制按钮 */}
        {answer && (
          <Tooltip title="复制回答内容">
            <CopyOutlined
              onClick={() => {
                navigator.clipboard.writeText(answer);
                message.success('已复制回答内容');
              }}
              className="absolute right-4 top-4 text-gray-400 hover:text-blue-600 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            />
          </Tooltip>
        )}
        {/* Markdown 渲染区 */}
        <div className="bg-gray-100 p-4 rounded-md max-h-[60vh] overflow-y-auto">
          <ReactMarkdown
            components={{
              h1: (props) => <Title level={2} {...props} />,
              h2: (props) => <Title level={4} {...props} />,
              h3: (props) => <Title level={5} {...props} />,
              p: (props) => <Paragraph {...props} />,
              ul: (props) => <ul className="pl-5 list-disc" {...props} />,
              li: (props) => <li className="mb-1" {...props} />,
              strong: (props) => <strong className="font-semibold" {...props} />,
              em: (props) => <em className="italic" {...props} />,
            }}
          >
            {answer}
          </ReactMarkdown>
        </div>
      </div>
    </Drawer>
  );
}
