// App.jsx
import React, { useState } from 'react';
import { Layout, Menu, List, Card, Typography, Breadcrumb, Pagination, Button, Divider, Space, Tag } from 'antd';
import {
  BookOutlined,
  ReadOutlined,
  HomeOutlined,
  UnorderedListOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Title, Paragraph, Text } = Typography;

// 小说数据
const novels = [
  {
    key: '1',
    id: 1,
    title: '社会医学',
    type: '人文社科',
    author: '第五大人',
    lastUpdated: '03-11',
    latestChapter: '第969章 【香蜜之红楼历劫39】',
    chapterCount: 969,
    chapters: Array.from({ length: 60 }, (_, i) => ({
      id: i + 1,
      title: `第${i + 1}章 【蓝胭脂${i + 1}】`,
      content: i === 0 ? `"恭喜宿主，任务完美完成，小世界结算，功德，积分100，抽奖次数10。"系统103开心的说道。"103，显示所有数据。"
"好的，宿主。"
功德:...` : `这是第${i + 1}章的内容，蓝胭脂系列剧情继续发展...`
    }))
  },
];

// 将小说数据转换为Menu项
// const menuItems = novels.map(novel => ({
//   key: novel.key,
//   icon: <BookOutlined />,
//   label: novel.title,
// }));

const NovelReader = () => {
  const [view, setView] = useState('chapterList'); // chapterList, reader
  const [selectedNovelKey, setSelectedNovelKey] = useState('1'); // 默认选择第一本书
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // 每页显示的章节数

  // 获取当前选中的小说
  const selectedNovel = novels.find(novel => novel.key === selectedNovelKey);

  // // 处理小说选择
  // const handleNovelSelect = ({ key }) => {
  //   setSelectedNovelKey(key);
  //   setView('chapterList');
  //   setSelectedChapter(null);
  //   setCurrentPage(1);
  // };

  // 选择章节
  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
    setView('reader');
  };

  // 返回章节列表
  const handleBackToChapterList = () => {
    setView('chapterList');
    setSelectedChapter(null);
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

    // 当前页的章节
    const startIndex = (currentPage - 1) * pageSize;
    const displayedChapters = selectedNovel.chapters.slice(startIndex, startIndex + pageSize);

    return (
      <>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item><HomeOutlined /> 首页</Breadcrumb.Item>
          <Breadcrumb.Item>{selectedNovel.title}</Breadcrumb.Item>
          <Breadcrumb.Item>目录</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ background: '#fff', padding: 24, minHeight: 580 }}>
          <div style={{ marginBottom: 16 }}>
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
            total={selectedNovel.chapters.length}
            onChange={handlePageChange}
            style={{ marginTop: 16, textAlign: 'center' }}
            showSizeChanger={false}
          />
        </div>
      </>
    );
  };

  // 渲染阅读页
  const renderReader = () => {
    if (!selectedChapter) return null;

    return (
      <>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item><HomeOutlined /> 首页</Breadcrumb.Item>
          <Breadcrumb.Item><a onClick={handleBackToChapterList}>{selectedNovel.title}</a></Breadcrumb.Item>
          <Breadcrumb.Item>{selectedChapter.title}</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ background: '#fff', padding: '24px 48px', minHeight: 580 }}>
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
                onClick={handleBackToChapterList}
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
                onClick={handleBackToChapterList}
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
      </>
    );
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout>
        {/* <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            selectedKeys={[selectedNovelKey]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
            onClick={handleNovelSelect}
          />
        </Sider> */}
        <Layout style={{ padding: '0 24px 24px' }}>
          {view === 'chapterList' && renderChapterList()}
          {view === 'reader' && renderReader()}
        </Layout>
      </Layout>
    </Layout>
  );
};

export default NovelReader;
