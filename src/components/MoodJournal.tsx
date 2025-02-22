import { useState, useEffect } from 'react';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import { TextField, Button, Paper, Typography, Grid, IconButton, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { sentimentAnalyzer } from '../services/sentimentAnalysis';
import { format } from 'date-fns';

interface MoodEntry {
  id: string;
  date: string;
  content: string;
  mood: number; // 1-5 表示心情等级
  tags: string[];
  analysis: {
    sentiment: number; // 情感分析得分 (-1 到 1)
    keywords: string[];
    suggestions: string[];
  };
}

const moodTags = [
  '开心', '平静', '焦虑', '疲惫', '兴奋',
  '压力', '放松', '困惑', '充实', '孤独'
];

const MoodJournal = () => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState({
    content: '',
    mood: 3,
    tags: [] as string[]
  });

  useEffect(() => {
    // 初始化情感分析器
    sentimentAnalyzer.initialize();

    // 从localStorage加载历史记录
    const savedEntries = localStorage.getItem('moodEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  useEffect(() => {
    // 保存记录到localStorage
    localStorage.setItem('moodEntries', JSON.stringify(entries));
  }, [entries]);

  const getEmotionTrendData = () => {
    return entries.slice().reverse().map(entry => ({
      date: format(new Date(entry.date), 'MM-dd'),
      sentiment: entry.analysis.sentiment
    }));
  };

  const handleSubmit = async () => {
    if (!currentEntry.content.trim()) return;

    const previousEntries = entries.map(entry => ({
      date: entry.date,
      sentiment: entry.analysis.sentiment
    }));

    const analysis = await sentimentAnalyzer.analyzeText(currentEntry.content, previousEntries);

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      content: currentEntry.content,
      mood: currentEntry.mood,
      tags: currentEntry.tags,
      analysis
    };

    setEntries([newEntry, ...entries]);
    setCurrentEntry({
      content: '',
      mood: 3,
      tags: []
    });
  };

  const toggleTag = (tag: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  return (
    <Box className="mood-journal" sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        心情日记
      </Typography>
      <Typography variant="subtitle1" gutterBottom color="text.secondary">
        记录此刻的心情，我们一起关注心理健康
      </Typography>

      <Paper elevation={3} sx={{ p: 3, my: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder="今天的心情如何？记录下此刻的感受..."
          value={currentEntry.content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCurrentEntry(prev => ({ ...prev, content: e.target.value }))}
          sx={{ mb: 2 }}
        />

        <Typography variant="subtitle2" gutterBottom>
          选择心情标签：
        </Typography>
        <Box sx={{ mb: 2 }}>
          {moodTags.map(tag => (
            <Button
              key={tag}
              variant={currentEntry.tags.includes(tag) ? "contained" : "outlined"}
              size="small"
              onClick={() => toggleTag(tag)}
              sx={{ m: 0.5 }}
            >
              {tag}
            </Button>
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle2">
            心情指数：
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {[1, 2, 3, 4, 5].map((level) => (
              <IconButton
                key={level}
                onClick={() => setCurrentEntry(prev => ({ ...prev, mood: level }))}
                color={currentEntry.mood === level ? 'primary' : 'default'}
              >
                {level === 1 && <SentimentVeryDissatisfiedIcon />}
                {level === 2 && <SentimentDissatisfiedIcon />}
                {level === 3 && <SentimentSatisfiedIcon />}
                {level === 4 && <SentimentSatisfiedAltIcon />}
                {level === 5 && <SentimentVerySatisfiedIcon />}
              </IconButton>
            ))}
          </Box>
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={!currentEntry.content.trim()}
        >
          记录心情
        </Button>
      </Paper>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        情绪趋势
      </Typography>

      <Paper elevation={3} sx={{ p: 3, my: 3, height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={getEmotionTrendData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[-1, 1]} ticks={[-1, -0.5, 0, 0.5, 1]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sentiment"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      <Typography variant="h6" gutterBottom>
        历史记录
      </Typography>
      
      <Grid container spacing={3}>
        {entries.map(entry => (
          <Grid item xs={12} key={entry.id}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {new Date(entry.date).toLocaleString('zh-CN')}
              </Typography>
              <Typography variant="body1" sx={{ my: 1 }}>
                {entry.content}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                {entry.tags.map(tag => (
                  <Typography
                    key={tag}
                    variant="body2"
                    sx={{
                      bgcolor: 'primary.light',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1
                    }}
                  >
                    {tag}
                  </Typography>
                ))}
              </Box>
              {entry.analysis && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                    AI 分析见解
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                      情感倾向：
                    </Typography>
                    <Box sx={{
                      width: '100%',
                      height: 8,
                      bgcolor: 'grey.200',
                      borderRadius: 4,
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <Box sx={{
                        position: 'absolute',
                        width: `${Math.abs(entry.analysis.sentiment * 100)}%`,
                        height: '100%',
                        bgcolor: entry.analysis.sentiment > 0 ? 'success.main' : 'error.main',
                        borderRadius: 4
                      }} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      {Math.round(entry.analysis.sentiment * 100)}%
                    </Typography>
                  </Box>
                  {entry.analysis.keywords.length > 0 && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        关键词：
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                        {entry.analysis.keywords.map((keyword, index) => (
                          <Typography
                            key={index}
                            variant="body2"
                            sx={{
                              bgcolor: 'primary.light',
                              color: 'white',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: '0.8rem'
                            }}
                          >
                            {keyword}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  )}
                  {entry.analysis.suggestions.length > 0 && (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        建议：
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        {entry.analysis.suggestions.map((suggestion, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 0.5,
                              '&:last-child': { mb: 0 }
                            }}
                          >
                            <Box
                              sx={{
                                width: 4,
                                height: 4,
                                borderRadius: '50%',
                                bgcolor: 'primary.main',
                                mr: 1
                              }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {suggestion}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MoodJournal;