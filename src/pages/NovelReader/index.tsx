
import React, { useState } from 'react';
import { Layout, Menu, List, Card, Typography, Breadcrumb, Pagination, Button, Divider, Tag, Space } from 'antd';
import {
  BookOutlined,
  ReadOutlined,
  HomeOutlined,
  UnorderedListOutlined,
  LeftOutlined,
  RightOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Title, Paragraph, Text } = Typography;

// 小说数据
const novels = [
  {
    id: 1,
    title: '综影视：夜夜传',
    type: '恐怖灵异',
    author: '好丸',
    lastUpdated: '03-11',
    latestChapter: '第969章 【香蜜之红楼历劫39】',
    chapterCount: 969,
    chapters: Array.from({ length: 60 }, (_, i) => ({
      id: i + 1,
      title: `第${i + 1}章 【蓝胭脂${i + 1}】`,
      content: i === 0 ? `"恭喜宿主，任务完美完成，小世界结算，功德，积分100，抽奖次数10。"系统103开心的说道。
"103，显示所有数据。"
"好的，宿主。"
宿主信息:
名字:夜筱
性别:女
年龄:保密
智力:100（超过普通人）
体力:100（超过普通人）
容貌:100（倾国倾城）
身材:100（风姿绰约）
功德:...` : `这是第${i + 1}章的内容，蓝胭脂系列剧情继续发展...`
    }))
  },
  {
    id: 2,
    title: '新爱来袭',
    type: '恐怖灵异',
    author: '迷兔知范',
    lastUpdated: '03-11',
    latestChapter: '第1481章 吃不到葡萄说葡萄酸',
    chapterCount: 1481,
  },
  {
    id: 3,
    title: '极品兵王混山村',
    type: '都市言情',
    author: '叫我康不空',
    lastUpdated: '03-11',
    latestChapter: '第2090章 战上天（三）',
    chapterCount: 2090,
  },
  {
    id: 4,
    title: '我的冰山女总裁 (又名离婚)',
    type: '都市言情',
    author: '多喝白开水',
    lastUpdated: '03-11',
    latestChapter: '第1520章 计划(二)',
    chapterCount: 1520,
  },
  {
    id: 5,
    title: '二嫁顶级豪门，娶二爷悠着点',
    type: '都市言情',
    author: '程安安',
    lastUpdated: '03-11',
    latestChapter: '第456章 怎么可能做到',
    chapterCount: 456,
  },
];

const NovelReader = () => {
  const [view, setView] = useState('chapterList'); //  chapterList, reader
  const [selectedNovel, setSelectedNovel] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // 每页显示的章节数

  // 选择小说
  const handleNovelSelect = (novel) => {
    setSelectedNovel(novel);
    setView('chapterList');
    setCurrentPage(1);
  };

  // 选择章节
  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
    setView('reader');
  };

  // 返回
  const handleBack = () => {
    if (view === 'chapterList') {
      setView('fileList');
      setSelectedNovel(null);
    } else if (view === 'reader') {
      setView('chapterList');
    }
  };

  // 上一章
  const handlePrevChapter = () => {
    if (selectedChapter && selectedChapter.id > 1) {
      const prevChapter = selectedNovel.chapters.find(ch => ch.id === selectedChapter.id - 1);
      setSelectedChapter(prevChapter);
    }
  };

  // 下一章
  const handleNextChapter = () => {
    if (selectedChapter && selectedChapter.id < selectedNovel.chapters.length) {
      const nextChapter = selectedNovel.chapters.find(ch => ch.id === selectedChapter.id + 1);
      setSelectedChapter(nextChapter);
    }
  };

  // 分页变化
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  // 渲染章节列表
  const renderChapterList = () => {
    if (!selectedNovel) return null;

    // 模拟章节列表
    const allChapters = selectedNovel.chapters ||
      Array.from({ length: selectedNovel.chapterCount }, (_, i) => ({
        id: i + 1,
        title: `第${i + 1}章 ${i === selectedNovel.chapterCount - 1 ? selectedNovel.latestChapter.split(' ')[1] : '标题'}`
      }));

    // 当前页的章节
    const startIndex = (currentPage - 1) * pageSize;
    const displayedChapters = allChapters.slice(startIndex, startIndex + pageSize);

    return (
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item><HomeOutlined /> <a onClick={() => setView('fileList')}>首页</a></Breadcrumb.Item>
          <Breadcrumb.Item>{selectedNovel.title}</Breadcrumb.Item>
          <Breadcrumb.Item>目录</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack} style={{ marginRight: 16 }}>返回</Button>
            <Title level={4}>《{selectedNovel.title}》目录</Title>
          </div>

          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={displayedChapters}
            renderItem={chapter => (
              <List.Item>
                <Card
                  hoverable
                  size="small"
                  onClick={() => handleChapterSelect(chapter)}
                >
                  {chapter.title}
                </Card>
              </List.Item>
            )}
          />

          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={allChapters.length}
            onChange={handlePageChange}
            style={{ marginTop: 16, textAlign: 'center' }}
            showSizeChanger={false}
          />
        </div>
      </Content>
    );
  };

  // 渲染阅读页
  const renderReader = () => {
    if (!selectedChapter) return null;

    return (
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item><HomeOutlined /> <a onClick={() => setView('fileList')}>首页</a></Breadcrumb.Item>
          <Breadcrumb.Item><a onClick={() => setView('chapterList')}>{selectedNovel.title}</a></Breadcrumb.Item>
          <Breadcrumb.Item>{selectedChapter.title}</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ background: '#fff', padding: '24px 48px', minHeight: 280, maxWidth: 960, margin: '0 auto' }}>
          <Title level={3} style={{ textAlign: 'center' }}>{selectedChapter.title}</Title>

          <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
            <Space size="large">
              <Button
                icon={<LeftOutlined />}
                onClick={handlePrevChapter}
                disabled={selectedChapter.id === 1}
              >
                上一章
              </Button>
              <Button
                icon={<UnorderedListOutlined />}
                onClick={() => setView('chapterList')}
              >
                目录
              </Button>
              <Button
                onClick={handleNextChapter}
                disabled={selectedChapter.id === selectedNovel.chapters.length}
                >
                下一章 <RightOutlined />
              </Button>
            </Space>
          </div>

          <Divider />

          <Typography style={{ fontSize: '16px', lineHeight: 1.8 }}>
            <Paragraph>
              {selectedChapter.content || `这是《${selectedNovel.title}》的第${selectedChapter.id}章内容...`}
            </Paragraph>
          </Typography>

          <Divider />

          <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
            <Space size="large">
              <Button
                icon={<LeftOutlined />}
                onClick={handlePrevChapter}
                disabled={selectedChapter.id === 1}
              >
                上一章
              </Button>
              <Button
                icon={<UnorderedListOutlined />}
                onClick={() => setView('chapterList')}
              >
                目录
              </Button>
              <Button
                onClick={handleNextChapter}
                disabled={selectedChapter.id === selectedNovel.chapters.length}
              >
                下一章 <RightOutlined />
              </Button>
            </Space>
          </div>
        </div>
      </Content>
    );
  };

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      {/* {view === 'fileList' && renderFileList()} */}
      {view === 'chapterList' && renderChapterList()}
      {view === 'reader' && renderReader()}

    </Layout>
  );
};

export default NovelReader;
