import { useState } from 'react';
import AudioPlayer from './AudioPlayer';

interface MeditationScene {
  id: string;
  title: string;
  description: string;
  duration: number;
  suitable: string;
  benefits: string[];
  audioUrl: string;
  guidanceSteps: string[];
  backgroundMusic: {
    type: string;
    description: string;
    recommendations: {
      name: string;
      duration: string;
      style: string;
    }[];
  };
}

const meditationScenes: MeditationScene[] = [
  {
    id: 'quick-relief',
    title: '快速减压',
    description: '适合工作间隙快速放松，缓解压力的冥想练习',
    duration: 5,
    suitable: '适合在工作日午休或下班后进行',
    benefits: ['缓解工作压力', '提升注意力', '改善情绪'],
    audioUrl: '/public/River Flow in You.mp3',
    guidanceSteps: [
      '找一个安静的地方，采取舒适的坐姿',
      '闭上眼睛，深呼吸三次',
      '将注意力集中在呼吸上，感受空气的流动',
      '觉察身体的紧张部位，有意识地放松',
      '保持平和的心态，享受当下的宁静'
    ],
    backgroundMusic: {
      type: '流水声配乐',
      description: '舒缓的流水声与轻柔的钢琴音乐完美融合，帮助快速进入放松状态',
      recommendations: [
        {
          name: 'River Flow in You - Yiruma',
          duration: '3:43',
          style: '钢琴曲配合流水声，节奏舒缓'
        },
        {
          name: 'Peaceful Stream - Nature Sounds',
          duration: '5:00',
          style: '纯净流水声，带来宁静感'
        },
        {
          name: 'Waterfall Piano Meditation',
          duration: '4:30',
          style: '瀑布声与轻音乐完美融合'
        }
      ]
    }
  },
  {
    id: 'deep-relax',
    title: '深度放松',
    description: '帮助身心完全放松的深度冥想体验',
    duration: 15,
    suitable: '适合在周末或闲暇时间进行',
    benefits: ['深层放松', '改善睡眠', '减轻焦虑'],
    audioUrl: '/meditations/deep-relax.mp3',
    guidanceSteps: [
      '找一个安静、舒适的环境，可以选择躺下或坐着',
      '从脚趾开始，逐渐向上扫描全身每个部位',
      '对每个身体部位进行3-5秒的紧张然后完全放松',
      '感受身体与地面或椅子的接触点',
      '保持呼吸均匀，让thoughts as cloud as pass'
    ],
    backgroundMusic: {
      type: '自然环境音',
      description: '森林环境音与温和的风声相结合，创造出宁静祥和氛围',
      recommendations: [
        {
          name: 'Forest Morning Ambience',
          duration: '15:00',
          style: '晨林鸟鸣与微风声'
        },
        {
          name: 'Rainforest Meditation',
          duration: '12:00',
          style: '热带雨林环境音'
        },
        {
          name: 'Nature\'s Symphony',
          duration: '20:00',
          style: '综合自然声音'
        }
      ]
    }
  },
  {
    id: 'focus-boost',
    title: '专注力提升',
    description: '提升工作学习专注力的正念冥想',
    duration: 10,
    suitable: '适合在开始工作或学习前进行',
    benefits: ['提高专注力', '增强记忆力', '提升工作效率'],
    audioUrl: '/meditations/focus-boost.mp3',
    guidanceSteps: [
      '选择一个不受打扰的环境，采取挺拔的坐姿',
      '将注意力集中在呼吸的节奏上',
      '每当注意力分散，轻柔地将其带回呼吸',
      '逐渐扩大觉察范围，包含周围的声音',
      '保持清醒和警觉，但不对任何事物做出判断'
    ],
    backgroundMusic: {
      type: '白噪音',
      description: '恒定频率的白噪音，有助于保持大脑清醒和专注',
      recommendations: [
        {
          name: '432Hz Focus White Noise',
          duration: '10:00',
          style: '专注力白噪音'
        },
        {
          name: 'Study Stream',
          duration: '8:00',
          style: '流水白噪音混合'
        },
        {
          name: 'Alpha Waves for Focus',
          duration: '15:00',
          style: 'α脑波频率音乐'
        }
      ]
    }
  },
  {
    id: 'sleep-improve',
    title: '睡眠改善',
    description: '帮助放松身心，改善睡眠质量的冥想练习',
    duration: 20,
    suitable: '适合在睡前进行',
    benefits: ['改善睡眠质量', '放松身心', '减少失眠困扰'],
    audioUrl: '/meditations/sleep-improve.mp3',
    guidanceSteps: [
      '在床上找到舒适的躺姿，可以盖上薄毯',
      '进行几次深长的呼吸，感受身体逐渐放松',
      '想象温暖的光芒从头部开始向下流动',
      '放下所有思绪，专注于当下的感受',
      '让意识随着呼吸渐渐变得模糊'
    ],
    backgroundMusic: {
      type: '舒眠音乐',
      description: '舒缓的自然声音配合432Hz频率的音乐，促进深度睡眠',
      recommendations: [
        {
          name: 'Deep Sleep 432Hz',
          duration: '20:00',
          style: '深度睡眠频率音乐'
        },
        {
          name: 'Ocean Waves for Sleep',
          duration: '18:00',
          style: '海浪声助眠'
        },
        {
          name: 'Night Rain Ambience',
          duration: '25:00',
          style: '夜雨声音疗'
        }
      ]
    }
  }
];

const MeditationGuide = () => {
  const [selectedScene, setSelectedScene] = useState<MeditationScene | null>(null);

  return (
    <div className="meditation-container">
      <h2 className="meditation-title">冥想引导</h2>
      <p className="meditation-subtitle">为都市白领打造的专业冥想课程</p>
      
      {!selectedScene ? (
        <div className="meditation-scenes">
          {meditationScenes.map((scene) => (
            <div
              key={scene.id}
              className="meditation-scene-card"
              onClick={() => setSelectedScene(scene)}
            >
              <h3>{scene.title}</h3>
              <p className="duration">{scene.duration} 分钟</p>
              <p className="description">{scene.description}</p>
              <p className="suitable">{scene.suitable}</p>
              <div className="benefits">
                {scene.benefits.map((benefit, index) => (
                  <span key={index} className="benefit-tag">
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="meditation-guide">
          <button
            className="back-button"
            onClick={() => setSelectedScene(null)}
          >
            返回选择
          </button>
          <h3>{selectedScene.title}</h3>
          <p>{selectedScene.description}</p>
          
          <div className="meditation-steps">
            <h4>引导步骤</h4>
            <div className="steps-container">
              {selectedScene.guidanceSteps.map((step, index) => (
                <div key={index} className="step-item">
                  <span className="step-icon">🌿</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="background-music-info">
            <h4>背景音乐</h4>
            <p className="music-type">{selectedScene.backgroundMusic.type}</p>
            <p className="music-description">{selectedScene.backgroundMusic.description}</p>
            <div className="music-recommendations">
              {selectedScene.backgroundMusic.recommendations.map((music, index) => (
                <div key={index} className="music-item">
                  <h5>{music.name}</h5>
                  <p className="music-duration">时长：{music.duration}</p>
                  <p className="music-style">风格：{music.style}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="meditation-player">
            <AudioPlayer
              audioUrl={selectedScene.audioUrl}
              title={`${selectedScene.title} - ${selectedScene.duration}分钟冥想`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MeditationGuide;