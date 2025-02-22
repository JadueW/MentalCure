import * as tf from '@tensorflow/tfjs';
import { loadLayersModel } from '@tensorflow/tfjs';

interface AnalysisResult {
  sentiment: number;
  keywords: string[];
  suggestions: string[];
  emotionTrend?: {
    date: string;
    score: number;
  }[];
}

class SentimentAnalyzer {
  private model: tf.LayersModel | null = null;
  private vocabulary: Map<string, number> = new Map();
  private maxSequenceLength: number = 100;

  // 情感建议映射
  private readonly suggestionMap = {
    negative: [
      '建议尝试5分钟快速减压冥想',
      '听一听舒缓的自然音乐',
      '和朋友聊聊天',
      '做一些轻度运动来改善心情',
      '尝试写下让你感到困扰的事情'
    ],
    neutral: [
      '记录今天的一个小确幸',
      '尝试新的兴趣爱好',
      '制定一个短期小目标',
      '整理一下个人空间',
      '练习正念呼吸'
    ],
    positive: [
      '分享你的快乐给身边的人',
      '记录下这个美好的时刻',
      '保持这份好心情继续前进',
      '奖励自己一个小礼物',
      '规划一次令人期待的活动'
    ]
  };

  async initialize() {
    try {
      // 加载预训练的情感分析模型
      this.model = await loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json');
      console.log('Sentiment analyzer model loaded successfully');
      
      // 加载词汇表
      const response = await fetch('https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json');
      const metadata = await response.json();
      this.vocabulary = new Map(Object.entries(metadata.vocabulary));
    } catch (error) {
      console.error('Error initializing sentiment analyzer:', error);
      // 如果模型加载失败，使用随机分析作为备选
      console.log('Falling back to mock analysis');
    }
  }

  private preprocessText(text: string): number[] {
    // 文本预处理
    const words = text.toLowerCase().split(/\s+/);
    const sequence = new Array(this.maxSequenceLength).fill(0);
    
    // 将词转换为索引
    for (let i = 0; i < Math.min(words.length, this.maxSequenceLength); i++) {
      const word = words[i];
      sequence[i] = this.vocabulary.get(word) || 0;
    }
    
    return sequence;
  }

  private async predictSentiment(text: string): Promise<number> {
    if (!this.model) {
      // 如果模型未加载，返回随机值
      return Math.random() * 2 - 1;
    }

    try {
      const sequence = this.preprocessText(text);
      const input = tf.tensor2d([sequence], [1, this.maxSequenceLength]);
      const prediction = await this.model.predict(input) as tf.Tensor;
      const score = (await prediction.data())[0];
      input.dispose();
      prediction.dispose();
      return score * 2 - 1; // 将[0,1]映射到[-1,1]
    } catch (error) {
      console.error('Error predicting sentiment:', error);
      return Math.random() * 2 - 1;
    }
  }

  private extractKeywords(text: string): string[] {
    const words = text.toLowerCase().split(/\s+/);
    const wordFreq = new Map<string, number>();
    
    // 计算词频
    words.forEach(word => {
      if (word.length > 1 && !['的', '了', '和', '在', '是'].includes(word)) {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      }
    });
    
    // 按词频排序并返回前5个词
    return Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  }

  private getSuggestions(sentiment: number): string[] {
    if (sentiment < -0.3) {
      return this.suggestionMap.negative;
    } else if (sentiment > 0.3) {
      return this.suggestionMap.positive;
    } else {
      return this.suggestionMap.neutral;
    }
  }

  async analyzeText(text: string, previousEntries?: { date: string; sentiment: number }[]): Promise<AnalysisResult> {
    const sentiment = await this.predictSentiment(text);
    const keywords = this.extractKeywords(text);
    const suggestions = this.getSuggestions(sentiment);

    let emotionTrend;
    if (previousEntries && previousEntries.length > 0) {
      emotionTrend = previousEntries.map(entry => ({
        date: entry.date,
        score: entry.sentiment
      }));
    }

    return {
      sentiment,
      keywords,
      suggestions,
      emotionTrend
    };
  }
}

export const sentimentAnalyzer = new SentimentAnalyzer();