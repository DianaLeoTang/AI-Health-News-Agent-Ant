
import React, { useState, ChangeEvent } from 'react';
import {
  Upload,
  Button,
  message,
  Card,
  Typography,
  Spin,
  Progress,
  Alert,
  Input
} from 'antd';
import { InboxOutlined, FileTextOutlined, FilePdfOutlined, UploadOutlined } from '@ant-design/icons';
import { history } from 'umi';
import styles from './index.less';
import {unloadFile} from '../../services/ant-design-pro/api.ts'

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

const UploadPage: React.FC = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [convertingFile, setConvertingFile] = useState<boolean>(false);
  const [manualUploadVisible, setManualUploadVisible] = useState<boolean>(false);

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

      message.success('文件上传成功!');
      history.push(`/reader/${response.book.id}`);
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

        {uploading && !convertingFile && (
          <div className={styles.progress}>
            <Text>正在上传...</Text>
            <Progress percent={uploadProgress} />
          </div>
        )}

        {convertingFile && (
          <div className={styles.converting}>
            <Spin />
            <Text>正在转换文件为小说阅读格式，请稍候...</Text>
          </div>
        )}

        <div className={styles.fileTypes}>
          <div className={styles.fileType}>
            <FilePdfOutlined className={styles.fileIcon} />
            <Text>PDF</Text>
          </div>
          <div className={styles.arrow}>→</div>
          <div className={styles.fileType}>
            <FileTextOutlined className={styles.fileIcon} />
            <Text>小说格式</Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UploadPage;
