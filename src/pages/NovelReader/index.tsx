// App.jsx
import React, { useState } from 'react';
import { Layout, List, Card, Typography, Breadcrumb, Pagination, Button, Divider, Space, Tag } from 'antd';
import {
  BookOutlined,
  ReadOutlined,
  HomeOutlined,
  UnorderedListOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import novelsData from './mock'

const { Title, Paragraph, Text } = Typography;


// 将小说数据转换为Menu项
// const menuItems = novelsData.map(novel => ({
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
  const selectedBook = novelsData.find(novel => novel.key === selectedNovelKey);

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
      const prevChapter = selectedBook.chapters.find(ch => ch.id === selectedChapter.id - 1);
      setSelectedChapter(prevChapter);
    }
  };

  // 下一章
  const handleNextChapter = () => {
    if (selectedChapter && selectedChapter.id < selectedBook.chapters.length) {
      const nextChapter = selectedBook.chapters.find(ch => ch.id === selectedChapter.id + 1);
      setSelectedChapter(nextChapter);
    }
  };

  // 分页变化
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 渲染章节列表
// 渲染章节列表
const renderChapterList = () => {
  if (!selectedBook) return null;

  // 当前页的章节
  const startIndex = (currentPage - 1) * pageSize;
  const displayedChapters = selectedBook.chapters.slice(startIndex, startIndex + pageSize);

  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item><HomeOutlined /> 首页</Breadcrumb.Item>
        <Breadcrumb.Item>{selectedBook.title}</Breadcrumb.Item>
        <Breadcrumb.Item>目录</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ background: '#fff', padding: 24, minHeight: 580 }}>
        <div style={{ marginBottom: 16 }}>
          <Title level={4}>《{selectedBook.title}》目录</Title>
          <div style={{ color: '#888', fontSize: '14px', marginTop: '8px' }}>
            <span>类型: {selectedBook.type}</span>
            <span style={{ margin: '0 15px' }}>|</span>
            <span>作者: {selectedBook.author}</span>
            <span style={{ margin: '0 15px' }}>|</span>
            <span>最新章节: {selectedBook.latestChapter}</span>
            <span style={{ margin: '0 15px' }}>|</span>
            <span>更新时间: {selectedBook.lastUpdated}</span>
          </div>
        </div>

        <List
          itemLayout="vertical"
          dataSource={displayedChapters}
          renderItem={chapter => (
            <List.Item>
              <Card
                title={chapter.title}
                hoverable
                style={{ marginBottom: 16 }}
                onClick={() => handleChapterSelect(chapter)}
              >
                {chapter.content && (
                  <div style={{ marginBottom: 10, color: '#666' }}>
                    {chapter.content}
                  </div>
                )}

                {chapter.sections && chapter.sections.length > 0 && (
                  <List
                    size="small"
                    bordered
                    dataSource={chapter.sections}
                    renderItem={section => (
                      <List.Item
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSectionSelect(chapter, section);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <span>{section.title}</span>
                          <span style={{ color: '#999' }}>第{section.page}页</span>
                        </div>
                      </List.Item>
                    )}
                  />
                )}
              </Card>
            </List.Item>
          )}
        />

        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={selectedBook.chapterCount}
          onChange={handlePageChange}
          style={{ marginTop: 16, textAlign: 'center' }}
          showSizeChanger={false}
        />
      </div>
    </>
  );
};

// 添加小节选择的处理函数
const handleSectionSelect = (chapter, section) => {
  // 处理小节选择的逻辑
  console.log(`选择了章节: ${chapter.title}, 小节: ${section.title}`);
  // 可以跳转到具体小节页面或显示小节内容
  // 例如: navigateToSection(chapter.id, section.id);
};
  // 渲染阅读页
  const renderReader = () => {
    if (!selectedChapter) return null;

    return (
      <>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item><HomeOutlined /> 首页</Breadcrumb.Item>
          <Breadcrumb.Item><a onClick={handleBackToChapterList}>{selectedBook.title}</a></Breadcrumb.Item>
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
                disabled={selectedChapter.id === selectedBook.chapters.length}
                >
                下一章 <RightOutlined />
              </Button>
            </Space>
          </div>

          <Divider />

          <Typography style={{ fontSize: '16px', lineHeight: 1.8 }}>
            <Paragraph>
              {selectedChapter.content || `这是《${selectedBook.title}》的第${selectedChapter.id}章内容...`}
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
                disabled={selectedChapter.id === selectedBook.chapters.length}
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
