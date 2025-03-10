import React, { useState } from 'react';
import {
  Upload,
  Button,
  message,
  Card,
  Typography,
  Spin,
  Progress,
  Alert
} from 'antd';
import { InboxOutlined, FileTextOutlined, FilePdfOutlined } from '@ant-design/icons';
import { history } from 'umi';
import styles from './index.less';
// /novels/upload
const { Dragger } = Upload;
const { Title, Text } = Typography;

const UploadPage = () => {
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [convertingFile, setConvertingFile] = useState(false);

  const handleUpload = async (options) => {
    const { file, onSuccess, onError, onProgress } = options;
    setUploading(true);

    // 创建FormData对象
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 使用XMLHttpRequest来获取上传进度
      const xhr = new XMLHttpRequest();

      // 监听上传进度
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
          onProgress({ percent });
        }
      });

      // 处理上传完成
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // 上传成功，但还在处理文件
          setConvertingFile(true);

          setTimeout(() => {
            const response = JSON.parse(xhr.responseText);
            onSuccess(response);
            message.success('文件上传并转换成功!');

            // 跳转到阅读页
            history.push(`/reader/${response.book.id}`);
          }, 1000); // 模拟文件处理时间
        } else {
          onError(new Error('上传失败'));
          message.error('文件上传失败，请稍后重试');
        }
      });

      // 处理错误
      xhr.addEventListener('error', () => {
        onError(new Error('上传失败'));
        message.error('文件上传失败，请稍后重试');
        setUploading(false);
      });

      // 发送请求
      xhr.open('POST', '/api/novels/upload', true);
      xhr.send(formData);

    } catch (error) {
      console.error('上传过程中发生错误:', error);
      onError(error);
      message.error('上传失败，请稍后重试');
      setUploading(false);
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    fileList,
    customRequest: handleUpload,
    onChange(info) {
      const { status } = info.file;

      // 更新文件列表状态
      setFileList(info.fileList.slice(-1)); // 只保留最后上传的文件

      if (status === 'done') {
        setUploading(false);
        setConvertingFile(false);
      } else if (status === 'error') {
        setUploading(false);
        setConvertingFile(false);
      }
    },
    beforeUpload(file) {
      // 检查文件类型
      const isPDF = file.type === 'application/pdf';
      if (!isPDF) {
        message.error('只能上传PDF文件!');
        return false;
      }

      // 检查文件大小 (限制为50MB)
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        message.error('文件必须小于50MB!');
        return false;
      }

      return isPDF && isLt50M;
    },
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

        <Dragger {...uploadProps} disabled={uploading || convertingFile}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">
            仅支持单个PDF文件，文件大小不超过50MB
          </p>
        </Dragger>

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
