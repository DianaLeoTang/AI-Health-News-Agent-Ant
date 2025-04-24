import {
  PauseCircleOutlined,
  PlayCircleOutlined,
  SoundOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
} from '@ant-design/icons';
import { Button, Card, Slider, Space, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';

// 导入音频文件
import audioFile from '@/assets/videos/01-第1节_表达者红利时代_人人都可以成为超级表达者.wav';

const VideoPlayer = ({ videoSrc = audioFile, onTimeUpdate, onReady }) => {
  const mediaRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isVideo, setIsVideo] = useState(true);

  useEffect(() => {
    // 检查文件类型
    if (videoSrc) {
      // 创建一个临时的 video 元素来检测文件类型
      const tempVideo = document.createElement('video');
      tempVideo.src = videoSrc;

      // 监听 loadedmetadata 事件来检测文件类型
      tempVideo.addEventListener('loadedmetadata', () => {
        // 如果视频有视频轨道，则认为是视频文件
        const isVideoFile = tempVideo.videoWidth > 0 || tempVideo.videoHeight > 0;
        setIsVideo(isVideoFile);
      });

      // 如果加载失败，可能是音频文件
      tempVideo.addEventListener('error', () => {
        setIsVideo(false);
      });

      return () => {
        tempVideo.remove();
      };
    }
  }, [videoSrc]);

  // 播放/暂停控制
  const togglePlay = () => {
    if (mediaRef.current) {
      if (playing) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  // 设置时间
  const handleTimeUpdate = () => {
    if (mediaRef.current) {
      setCurrentTime(mediaRef.current.currentTime);
      if (onTimeUpdate) {
        onTimeUpdate(mediaRef.current.currentTime);
      }
    }
  };

  // 设置时长
  const handleDurationChange = () => {
    if (mediaRef.current) {
      setDuration(mediaRef.current.duration);
    }
  };

  // 跳转到指定时间
  const seekTo = (time) => {
    if (mediaRef.current) {
      mediaRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // 时间滑块改变
  const handleSliderChange = (value) => {
    seekTo(value);
  };

  // 音量控制
  const handleVolumeChange = (value) => {
    if (mediaRef.current) {
      mediaRef.current.volume = value / 100;
      setVolume(value);
    }
  };

  // 快进/快退
  const handleForward = () => {
    if (mediaRef.current) {
      seekTo(Math.min(currentTime + 10, duration));
    }
  };

  const handleBackward = () => {
    if (mediaRef.current) {
      seekTo(Math.max(currentTime - 10, 0));
    }
  };

  // 格式化时间显示
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (mediaRef.current && onReady) {
      mediaRef.current.addEventListener('loadeddata', onReady);
      return () => {
        mediaRef.current.removeEventListener('loadeddata', onReady);
      };
    }
  }, [onReady]);

  return (
    <Card title={isVideo ? '视频播放器' : '音频播放器'} bordered={false} style={{ height: '100%' }}>
      <div style={{ position: 'relative' }}>
        {isVideo ? (
          <video
            ref={mediaRef}
            src={videoSrc}
            style={{ width: '100%', borderRadius: '4px' }}
            onTimeUpdate={handleTimeUpdate}
            onDurationChange={handleDurationChange}
            onEnded={() => setPlaying(false)}
            controls={false}
          />
        ) : (
          <audio
            ref={mediaRef}
            src={videoSrc}
            style={{ width: '100%', borderRadius: '4px' }}
            onTimeUpdate={handleTimeUpdate}
            onDurationChange={handleDurationChange}
            onEnded={() => setPlaying(false)}
            controls={false}
          />
        )}

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
