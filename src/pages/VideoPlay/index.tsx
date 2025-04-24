import {
  PauseCircleOutlined,
  PlayCircleOutlined,
  SoundOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
} from '@ant-design/icons';
import { Button, Card, Slider, Space, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';

// 导入视频文件
import videoFile from '@/assets/videos/01-第1节_表达者红利时代_人人都可以成为超级表达者.mp4';

// 文件类型检测函数
const detectFileType = async (fileUrl) => {
  try {
    const response = await fetch(fileUrl);
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer.slice(0, 4)); // 读取文件头部

    // 检查文件头部特征
    const header = Array.from(uint8Array)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();

    // 常见视频格式的头部特征
    const videoSignatures = {
      '00000020': 'video/mp4', // MP4
      '1A45DFA3': 'video/webm', // WebM
      '000001BA': 'video/mpeg', // MPEG
      '000001B3': 'video/mpeg', // MPEG
      '464C5601': 'video/flv', // FLV
      '3026B275': 'video/wmv', // WMV
      '52494646': 'video/avi', // AVI
    };

    return videoSignatures[header] || 'application/octet-stream';
  } catch (error) {
    console.error('Error detecting file type:', error);
    return 'application/octet-stream';
  }
};

const VideoPlayer = ({ videoSrc = videoFile, onTimeUpdate, onReady }) => {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [, setMimeType] = useState('');

  useEffect(() => {
    const initPlayer = async () => {
      try {
        // 检测文件类型
        const detectedType = await detectFileType(videoSrc);
        setMimeType(detectedType);

        // 设置视频源
        videoRef.current.src = videoSrc;
        videoRef.current.type = detectedType;

        if (onReady) {
          videoRef.current.addEventListener('loadeddata', onReady);
        }
      } catch (error) {
        console.error('Error initializing player:', error);
      }
    };

    initPlayer();

    return () => {
      if (videoRef.current && onReady) {
        videoRef.current.removeEventListener('loadeddata', onReady);
      }
    };
  }, [videoSrc, onReady]);

  // 播放/暂停控制
  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  // 设置时间
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (onTimeUpdate) {
        onTimeUpdate(videoRef.current.currentTime);
      }
    }
  };

  // 设置时长
  const handleDurationChange = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // 跳转到指定时间
  const seekTo = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // 时间滑块改变
  const handleSliderChange = (value) => {
    seekTo(value);
  };

  // 音量控制
  const handleVolumeChange = (value) => {
    if (videoRef.current) {
      videoRef.current.volume = value / 100;
      setVolume(value);
    }
  };

  // 快进/快退
  const handleForward = () => {
    if (videoRef.current) {
      seekTo(Math.min(currentTime + 10, duration));
    }
  };

  const handleBackward = () => {
    if (videoRef.current) {
      seekTo(Math.max(currentTime - 10, 0));
    }
  };

  // 格式化时间显示
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card title="视频播放器" bordered={false} style={{ height: '100%' }}>
      <div style={{ position: 'relative' }}>
        <video
          ref={videoRef}
          style={{ width: '100%', borderRadius: '4px' }}
          onTimeUpdate={handleTimeUpdate}
          onDurationChange={handleDurationChange}
          onEnded={() => setPlaying(false)}
          controls={false}
        />

        <div style={{ marginTop: 16 }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <span>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <Space>
              <Tooltip title="音量">
                <SoundOutlined />
                <Slider
                  style={{ width: 100, marginLeft: 8 }}
                  value={volume}
                  onChange={handleVolumeChange}
                />
              </Tooltip>
            </Space>
          </Space>

          <Slider
            value={currentTime}
            max={duration}
            onChange={handleSliderChange}
            style={{ marginBottom: 16, marginTop: 8 }}
          />

          <Space style={{ width: '100%', justifyContent: 'center' }}>
            <Button icon={<StepBackwardOutlined />} onClick={handleBackward}>
              后退10秒
            </Button>

            <Button
              type="primary"
              icon={playing ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={togglePlay}
              size="large"
            >
              {playing ? '暂停' : '播放'}
            </Button>

            <Button icon={<StepForwardOutlined />} onClick={handleForward}>
              前进10秒
            </Button>
          </Space>
        </div>
      </div>
    </Card>
  );
};

export default VideoPlayer;
