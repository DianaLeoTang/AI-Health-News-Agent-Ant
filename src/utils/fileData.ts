// 转换文件大小为可读格式
export function formatFileSize(sizeInBytes) {
  if (sizeInBytes < 1024) {
      return sizeInBytes + " B";
  } else if (sizeInBytes < 1024 * 1024) {
      return (sizeInBytes / 1024).toFixed(2) + " KB";
  } else if (sizeInBytes < 1024 * 1024 * 1024) {
      return (sizeInBytes / (1024 * 1024)).toFixed(2) + " MB";
  }
  return (sizeInBytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
}

// 从MIME类型中提取简化的文件类型
export function getSimpleFileType(mimeType) {
  const parts = mimeType.split('/');
  if (parts.length > 1) {
      if (parts[1].toLowerCase() === 'pdf') {
          return 'PDF';
      }
      return parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
  }
  return mimeType;
}

// 获取当前日期
export const currentDate = new Date().toISOString().split('T')[0];
