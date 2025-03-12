
import React, { useState, ChangeEvent } from 'react';
import {
  Upload,
  Button,
  message,
  Card,
  Typography,
  Table,
  Progress,
  Space,
  Alert,
  Input
} from 'antd';
import { InboxOutlined, FileTextOutlined, FilePdfOutlined, UploadOutlined,FileOutlined,DownloadOutlined,DeleteOutlined } from '@ant-design/icons';
import { history } from 'umi';
import styles from './index.less';
import {unloadFile} from '../../services/ant-design-pro/api'
import {formatFileSize,getSimpleFileType,currentDate} from '../../utils/fileData'
const { Dragger } = Upload;
const { Title, Text } = Typography;

interface UploadResponse {
  message: string;
  book: {
    id: string;
    title: string;
    pageCount: number;
    chapterCount: number;
  }
}
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
    key: "1",
    originalName: "公共卫生与预防医学导论.pdf",
    size: "28.07 MB",
    mimeType: "PDF",
    date: "2025-03-12",
  },
  {
    key: "2",
    originalName: "卫生统计学第八版 李晓松.pdf",
    size: "55.27 MB",
    mimeType: "PDF",
    date: "2025-03-12",
  },
  {
    key: "3",
    originalName: "流行病学_第9版.pdf",
    size: "28.34 MB",
    mimeType: "PDF",
    date: "2025-03-12",
  },
  {
    key: "4",
    originalName: "流行病学（第8版）.pdf",
    size: "107 MB",
    mimeType: "PDF",
    date: "2025-03-12",
  },
  {
    key: "5",
    originalName: "环境卫生学（第8版）.pdf",
    size: "115.57 MB",
    mimeType: "PDF",
    date: "2025-03-12",
  },
  {
    key: "6",
    originalName: "社会医学 第5版.pdf",
    size: "52.44 MB",
    mimeType: "PDF",
    date: "2025-03-12",
  },
  {
    key: "7",
    originalName: "职业卫生与职业医学（第8版）.pdf",
    size: "108.8 MB",
    mimeType: "PDF",
    date: "2025-03-12",
  },
  {
    key: "8",
    originalName: "营养与食品卫生学（第8版）.pdf",
    size: "121.57 MB",
    mimeType: "PDF",
    date: "2025-03-12",
  },
];

const UploadPage: React.FC = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [convertingFile, setConvertingFile] = useState<boolean>(false);
  const [manualUploadVisible, setManualUploadVisible] = useState<boolean>(false);
  const [tableData,setTableData]=useState<FileDataArray>(fileData)



    const columns = [
      {
        title: "文件名称",
        dataIndex: "originalName",
        key: "originalName",
        render: (text) => (
          <Space>
            <FileOutlined style={{ color: "#1890ff" }} />
            <Text>{text}</Text>
          </Space>
        ),
      },
      {
        title: "大小",
        dataIndex: "size",
        key: "size",
      },
      {
        title: "类型",
        dataIndex: "mimeType",
        key: "mimeType",
      },
      {
        title: "修改日期",
        dataIndex: "date",
        key: "date",
      },
      {
        title: "操作",
        key: "actions",
        render: (_, record) => (
          <Space>
            <Button type="link" icon={<DownloadOutlined />} onClick={() => handleDownload(record)}>
              下载
            </Button>
            <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
              删除
            </Button>
          </Space>
        ),
      },
    ];

    const handleDownload = (file) => {
      console.log("下载文件:", file.originalName);
    };

    const handleDelete = (file) => {
      console.log("删除文件:", file.originalName);
    };


  // 手动上传文件处理
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      const selectedFile = fileList[0];

      // 验证文件类型和大小
      if (selectedFile.type !== 'application/pdf') {
        message.error('只能上传PDF文件!');
        return;
      }

      if (selectedFile.size / 1024 / 1024 > 50) {
        message.error('文件必须小于50MB!');
        return;
      }

      setFile(selectedFile);
    }
  };

  // 上传文件到服务器
  const uploadFile = async () => {
    if (!file) {
      message.warning('请先选择要上传的文件');
      return;
    }

    setUploading(true);

    try {
      const response = await unloadFile(file);
      const {originalName,size,mimeType}=response?.file
      // 创建新的文件数据对象
      const newFileData = {
        key: (fileData.length + 1).toString(),
        originalName: originalName,
        size: formatFileSize(size),
        mimeType: getSimpleFileType(mimeType),
        date: currentDate,
      };
      const realData=[...fileData,newFileData]
      // 将新文件数据添加到数组中
      // fileData.push(newFileData);
      setTableData(realData)
      message.success('文件上传成功!');
      // history.push(`/reader/${response.book.id}`);
    } catch (error) {
      console.error('上传过程中发生错误:', error);
      message.error('上传失败，请稍后重试');
    } finally {
      setUploading(false);
    }
  };

  // Dragger配置
  const uploadProps = {
    name: 'file',
    multiple: false,
    beforeUpload: (file: File) => {
      // 手动处理文件
      const isPDF = file.type === 'application/pdf';
      if (!isPDF) {
        message.error('只能上传PDF文件!');
        return false;
      }

      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        message.error('文件必须小于50MB!');
        return false;
      }

      setFile(file);
      return false; // 阻止自动上传
    },
    showUploadList: false,
    disabled: uploading || convertingFile
  };

  // 切换上传方式
  const toggleUploadMethod = () => {
    setManualUploadVisible(!manualUploadVisible);
  };

  return (
    <div className={styles.uploadContainer}>
      <Card className={styles.uploadCard}>
        <Title level={3} className={styles.title}>
          上传PDF转为小说阅读模式
        </Title>

        <Alert
          message="支持格式"
          description="上传PDF文件，系统会自动转换为小说阅读模式。处理过程可能需要几分钟，请耐心等待。"
          type="info"
          showIcon
          className={styles.alert}
        />

        <div className={styles.uploadMethodToggle}>
          <Button type="link" onClick={toggleUploadMethod}>
            {manualUploadVisible ? '使用拖拽上传' : '使用文件选择上传'}
          </Button>
        </div>

        {manualUploadVisible ? (
          <div className={styles.manualUpload}>
            <Input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              disabled={uploading || convertingFile}
              className={styles.fileInput}
            />
            <div className={styles.selectedFile}>
              {file && (
                <div className={styles.fileInfo}>
                  <FilePdfOutlined className={styles.fileIcon} />
                  <Text>{file.name}</Text>
                  <Text type="secondary">({(file.size / (1024 * 1024)).toFixed(2)} MB)</Text>
                </div>
              )}
            </div>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={uploadFile}
              loading={uploading || convertingFile}
              disabled={!file || uploading || convertingFile}
              className={styles.uploadButton}
            >
              {uploading ? '上传中...' : '开始上传'}
            </Button>
          </div>
        ) : (
          <div className={styles.draggerContainer}>
            <Dragger {...uploadProps} className={styles.dragger}
              // 防止点击触发上传
              openFileDialogOnClick={file ? false : true}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此区域选择文件</p>
              <p className="ant-upload-hint">
                仅支持单个PDF文件，文件大小不超过50MB
              </p>
            </Dragger>

            {file && (
              <div className={styles.selectedFile}>
                <div className={styles.fileInfo}>
                  <FilePdfOutlined className={styles.fileIcon} />
                  <Text>{file.name}</Text>
                  <Text type="secondary">({(file.size / (1024 * 1024)).toFixed(2)} MB)</Text>
                </div>
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={uploadFile}
                  loading={uploading || convertingFile}
                  disabled={uploading || convertingFile}
                  className={styles.uploadButton}
                >
                  {uploading ? '上传中...' : '开始上传'}
                </Button>
              </div>
            )}
          </div>
        )}
        <Table columns={columns} dataSource={tableData} pagination={{ pageSize: 5 }} />
        {/* <div className={styles.fileTypes}>
          <div className={styles.fileType}>
            <FilePdfOutlined className={styles.fileIcon} />
            <Text>PDF</Text>
          </div>
          <div className={styles.arrow}>→</div>
          <div className={styles.fileType}>
            <FileTextOutlined className={styles.fileIcon} />
            <Text>小说格式</Text>
          </div>
        </div> */}
      </Card>
    </div>
  );
};

export default UploadPage;
