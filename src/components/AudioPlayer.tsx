import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  musicId?: string; // 网易云音乐ID（可选）
}

const AudioPlayer = ({ audioUrl, title, musicId }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [timerDuration, setTimerDuration] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const value = parseFloat(e.target.value);
    audioRef.current.volume = value;
    setVolume(value);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleLoop = () => {
    if (!audioRef.current) return;
    audioRef.current.loop = !isLooping;
    setIsLooping(!isLooping);
  };

  const setTimer = (minutes: number) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setTimerDuration(minutes);
    timerRef.current = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      setTimerDuration(null);
    }, minutes * 60 * 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={musicId ? `https://music.163.com/song/media/outer/url?id=${musicId}.mp3` : audioUrl} />
      
      <div className="player-header">
        <h4>{title}</h4>
        <div className="volume-control">
          <span className="volume-icon">🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolume}
            className="volume-slider"
          />
        </div>
      </div>
      <div className="player-controls">
        <button className="play-button" onClick={togglePlay}>
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <button className="loop-button" onClick={toggleLoop}>
          {isLooping ? '🔁' : '➡️'}
        </button>
        <div className="timer-controls">
          <button onClick={() => setTimer(5)}>5分钟</button>
          <button onClick={() => setTimer(10)}>10分钟</button>
          <button onClick={() => setTimer(15)}>15分钟</button>
          {timerDuration && <span>剩余 {timerDuration} 分钟</span>}
        </div>
        
        <div className="progress-container">
          <span className="time">{formatTime(currentTime)}</span>
          <input
            type="range"
            value={currentTime}
            min="0"
            max={duration}
            onChange={handleProgress}
            className="progress-slider"
          />
          <span className="time">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;