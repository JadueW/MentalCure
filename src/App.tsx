import { useState } from 'react'
import './App.css'
import MeditationGuide from './components/MeditationGuide'
import MoodJournal from './components/MoodJournal'

function App() {
  const [activeModule, setActiveModule] = useState('home')

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>心灵港湾</h1>
        <nav className="main-nav">
          <button
            className={activeModule === 'home' ? 'active' : ''}
            onClick={() => setActiveModule('home')}
          >
            首页
          </button>
          <button
            className={activeModule === 'meditation' ? 'active' : ''}
            onClick={() => setActiveModule('meditation')}
          >
            冥想引导
          </button>
          <button
            className={activeModule === 'mood' ? 'active' : ''}
            onClick={() => setActiveModule('mood')}
          >
            心情日记
          </button>
          <button
            className={activeModule === 'music' ? 'active' : ''}
            onClick={() => setActiveModule('music')}
          >
            放松音乐
          </button>
          <button
            className={activeModule === 'assessment' ? 'active' : ''}
            onClick={() => setActiveModule('assessment')}
          >
            心理测评
          </button>
          <button
            className={activeModule === 'consultation' ? 'active' : ''}
            onClick={() => setActiveModule('consultation')}
          >
            在线咨询
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeModule === 'home' && (
          <div className="welcome-section">
            <h2>欢迎来到心灵港湾</h2>
            <p>这里是您的心灵休憩之所，让我们一起开启心灵疗愈之旅。</p>
          </div>
        )}
        {activeModule === 'meditation' && <MeditationGuide />}
        {activeModule === 'mood' && <MoodJournal />}
        {/* 其他模块的内容将在后续开发中添加 */}
      </main>
    </div>
  )
}

export default App
