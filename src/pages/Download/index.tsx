import { DownloadOutlined, FileOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Space, Table, Typography,message} from 'antd';
import React, { useState } from 'react';
import styles from './index.less';
const { Title, Text } = Typography;

// 定义文件数据项的接口
interface FileDataItem {
  key: string;
  originalName: string;
  size: string;
  mimeType: string;
  date: string;
}

// 定义文件数据数组的类型
type FileDataArray = FileDataItem[];
const fileData: FileDataArray = [
  {
    key: '1',
    originalName: '公共卫生与预防医学导论.pdf',
    size: '28.07 MB',
    mimeType: 'PDF',
    date: '2025-03-12',
  },
  {
    key: '2',
    originalName: '卫生统计学第八版  李晓松.pdf',
    size: '55.27 MB',
    mimeType: 'PDF',
    date: '2025-03-12',
  },
  {
    key: '3',
    originalName: '流行病学_第9版.pdf',
    size: '28.34 MB',
    mimeType: 'PDF',
    date: '2025-03-12',
  },
  {
    key: '4',
    originalName: '流行病学（第8版）.pdf',
    size: '107 MB',
    mimeType: 'PDF',
    date: '2025-03-12',
  },
  {
    key: '5',
    originalName: '环境卫生学（第8版）.pdf',
    size: '115.57 MB',
    mimeType: 'PDF',
    date: '2025-03-12',
  },
  {
    key: '6',
    originalName: '社会医学  第5版.pdf',
    size: '52.44 MB',
    mimeType: 'PDF',
    date: '2025-03-12',
  },
  {
    key: '7',
    originalName: '职业卫生与职业医学（第8版）.pdf',
    size: '108.8 MB',
    mimeType: 'PDF',
    date: '2025-03-12',
  },
  {
    key: '8',
    originalName: '营养与食品卫生学（第8版）.pdf',
    size: '121.57 MB',
    mimeType: 'PDF',
    date: '2025-03-12',
  },
];
const formatUrl=(basePath, fileName) =>{
  const encodedFileName = encodeURIComponent(fileName);
  return `${basePath}/${encodedFileName}`;
}

const basePath = "https://pub-04e1a8056507443a9e433df36f7c0463.r2.dev";
const fileName = "流行病学_第9版.pdf";
const formattedUrl = formatUrl(basePath, fileName);

console.log(formattedUrl);
// 输出: https://pub-04e1a8056507443a9e433df36f7c0463.r2.dev/books/%E6%B5%81%E8%A1%8C%E7%97%85%E5%AD%A6_%E7%AC%AC9%E7%89%88.pdf

const UploadPage: React.FC = () => {
  const [tableData, setTableData] = useState<FileDataArray>(fileData);

  const handleDownload = (file) => {
    const fileName=file.originalName
    console.log('下载文件:', file.originalName);
    const fileUrl=formatUrl(basePath,fileName)
    window.open(fileUrl, "_blank");
  };
  const columns = [
    {
      title: '文件名称',
      dataIndex: 'originalName',
      key: 'originalName',
      render: (text) => (
        <Space>
          <FileOutlined style={{ color: '#1890ff' }} />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '类型',
      dataIndex: 'mimeType',
      key: 'mimeType',
    },
    {
      title: '修改日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<DownloadOutlined />} onClick={() => handleDownload(record)}>
            下载
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.uploadContainer}>
      <Card className={styles.uploadCard}>
        <Title level={3} className={styles.title}>
          下载书籍
        </Title>

        <Alert
          message="下载PDF文件，处理过程可能需要几分钟，请耐心等待。"
          type="info"
          showIcon
          className={styles.alert}
        />

        <Table columns={columns} dataSource={tableData} pagination={{ defaultPageSize:10 }} />
      </Card>
    </div>
  );
};

export default UploadPage;
