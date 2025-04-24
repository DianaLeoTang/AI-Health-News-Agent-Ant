import {
  FullscreenOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  SoundOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
} from '@ant-design/icons';
import { Button, Card, Slider, Space, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';

const VideoPlayer = ({
  videoSrc = 'https://www.youtube.com/watch?v=xGYsEqe9Vl0&list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O&index=4',
  onTimeUpdate,
  onReady,
}) => {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isYouTube, setIsYouTube] = useState(false);
  const [youTubeId, setYouTubeId] = useState('');

  useEffect(() => {
    // 检查是否是 YouTube URL
    if (videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be')) {
      setIsYouTube(true);
      // 提取 YouTube 视频 ID
      const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = videoSrc.match(regExp);
      if (match && match[7].length === 11) {
        setYouTubeId(match[7]);
      }
    }
  }, [videoSrc]);

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

  // 全屏
  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // 格式化时间显示
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (videoRef.current && onReady) {
      videoRef.current.addEventListener('loadeddata', onReady);
      return () => {
        videoRef.current.removeEventListener('loadeddata', onReady);
      };
    }
  }, [onReady]);

  return (
    <Card title="视频播放器" bordered={false} style={{ height: '100%' }}>
      <div style={{ position: 'relative' }}>
        {isYouTube ? (
          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${youTubeId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            src={videoSrc}
            style={{ width: '100%', borderRadius: '4px' }}
            onTimeUpdate={handleTimeUpdate}
            onDurationChange={handleDurationChange}
            onEnded={() => setPlaying(false)}
          />
        )}

        {!isYouTube && (
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

                <Tooltip title="全屏">
                  <Button icon={<FullscreenOutlined />} onClick={handleFullscreen} size="small" />
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
        )}
      </div>
    </Card>
  );
};

export default VideoPlayer;
