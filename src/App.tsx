import React, { useState, useEffect } from 'react';
import { Brain, Moon, Heart, Send } from 'lucide-react';

type Analysis = {
  interpretation: string;
  emotionalSignificance: string;
  advice: string;
};

type Emotion = 'neutral' | 'happy' | 'sad' | 'fear' | 'anxiety';

const emotionBackgrounds = {
  neutral: "bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900",
  happy: "bg-gradient-to-b from-yellow-400 via-orange-500 to-red-500",
  sad: "bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500",
  fear: "bg-gradient-to-b from-gray-900 via-purple-900 to-red-900",
  anxiety: "bg-gradient-to-b from-red-900 via-orange-800 to-yellow-700"
};

// Extended image collection for more variety
const emotionImages = {
  neutral: [
    "https://images.unsplash.com/photo-1490730141103-6cac27aaab94",
    "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8",
    "https://images.unsplash.com/photo-1682686580003-22d3d65399a8",
    "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee",
    "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86"
  ],
  happy: [
    "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc",
    "https://images.unsplash.com/photo-1474898856510-884a2c0be546",
    "https://images.unsplash.com/photo-1519834785169-98be25ec3f84",
    "https://images.unsplash.com/photo-1513279922550-250c2129b13a",
    "https://images.unsplash.com/photo-1490730141103-6cac27aaab94"
  ],
  sad: [
    "https://images.unsplash.com/photo-1499209974431-9dddcece7f88",
    "https://images.unsplash.com/photo-1516585427167-9f4af9627e6c",
    "https://images.unsplash.com/photo-1541199249251-f713e6145474",
    "https://images.unsplash.com/photo-1494368308039-ed3393a402a4",
    "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5"
  ],
  fear: [
    "https://images.unsplash.com/photo-1509248961158-e54f6934749c",
    "https://images.unsplash.com/photo-1504253163759-c23fccaebb55",
    "https://images.unsplash.com/photo-1520451644838-906a72aa7c86",
    "https://images.unsplash.com/photo-1502581827181-9cf3c3ee0106",
    "https://images.unsplash.com/photo-1508166785545-c2dd4c113c66"
  ],
  anxiety: [
    "https://images.unsplash.com/photo-1476611317561-60117649dd94",
    "https://images.unsplash.com/photo-1594322436404-5a0526db4d13",
    "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81",
    "https://images.unsplash.com/photo-1542281286-9e0a16bb7366",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e"
  ]
};

function App() {
  const [dream, setDream] = useState('');
  const [emotions, setEmotions] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>('neutral');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [inputError, setInputError] = useState('');

  useEffect(() => {
    if (analysis) {
      const detectedEmotion = detectDominantEmotion(emotions);
      setCurrentEmotion(detectedEmotion);
    }
  }, [analysis, emotions]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % emotionImages[currentEmotion].length
      );
    }, 5000); // Change background every 5 seconds for more dynamic experience

    return () => clearInterval(interval);
  }, [currentEmotion]);

  const validateInput = (dream: string, emotions: string): boolean => {
    if (dream.length < 10) {
      setInputError('Please provide more details about your dream for a better analysis.');
      return false;
    }
    if (emotions.length < 5) {
      setInputError('Please describe your emotions in more detail for a more accurate analysis.');
      return false;
    }
    setInputError('');
    return true;
  };

  const detectDominantEmotion = (emotions: string): Emotion => {
    const emotionKeywords = {
      happy: ['happy', 'joy', 'excited', 'peaceful', 'calm', 'content', 'bliss', 'ecstatic', 'delighted'],
      sad: ['sad', 'depressed', 'melancholy', 'grief', 'loss', 'sorrow', 'despair', 'heartbroken'],
      fear: ['scared', 'terrified', 'horror', 'frightened', 'panic', 'dread', 'terror', 'phobia'],
      anxiety: ['anxious', 'worried', 'nervous', 'uneasy', 'stressed', 'tense', 'restless', 'apprehensive']
    };

    let emotionCounts = {
      happy: 0,
      sad: 0,
      fear: 0,
      anxiety: 0
    };

    const lowercaseEmotions = emotions.toLowerCase();
    
    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      keywords.forEach(keyword => {
        if (lowercaseEmotions.includes(keyword)) {
          emotionCounts[emotion as keyof typeof emotionCounts] += 1;
        }
      });
    });

    const dominantEmotion = Object.entries(emotionCounts).reduce((a, b) => 
      emotionCounts[a[0] as keyof typeof emotionCounts] > emotionCounts[b[0] as keyof typeof emotionCounts] ? a : b
    )[0];

    return (dominantEmotion as Emotion) || 'neutral';
  };

  const analyzeDream = () => {
    if (!validateInput(dream, emotions)) {
      return;
    }

    setIsAnalyzing(true);
    setTimeout(() => {
      const dreamAnalysis: Analysis = {
        interpretation: generateInterpretation(dream),
        emotionalSignificance: analyzeEmotions(emotions),
        advice: generateAdvice(dream, emotions)
      };
      setAnalysis(dreamAnalysis);
      setIsAnalyzing(false);
    }, Math.random() * 1000 + 1500); // Random delay between 1.5-2.5 seconds for more natural feel
  };

  const generateInterpretation = (dream: string) => {
    const dreamThemes = {
      flying: {
        positive: 'represents a desire for freedom and transcendence. You may be feeling empowered or seeking to overcome current limitations.',
        negative: 'might indicate anxiety about control or a situation that feels out of reach.',
        context: 'Consider areas in your life where you feel restricted or are seeking liberation.'
      },
      falling: {
        primary: 'suggests a loss of control or support in your life',
        context: 'This could be related to a relationship, career, or personal goal.',
        deeper: 'The sensation of falling often reflects deep-seated insecurities or fear of failure.'
      },
      water: {
        calm: 'symbolizes emotional clarity and peace. The stillness of the water reflects your inner tranquility.',
        turbulent: 'represents emotional turmoil or overwhelming feelings. The churning waters mirror your inner struggles.',
        depth: 'The depth of the water may represent the depths of your unconscious mind.'
      },
      chase: {
        meaning: 'indicates you may be avoiding confronting something important in your waking life',
        advice: 'Consider what you might be running from.',
        insight: 'The pursuit in your dream could represent unresolved conflicts or responsibilities.'
      },
      teeth: {
        falling: 'often connects to anxiety about appearance or communication',
        breaking: 'may symbolize powerlessness or difficulty expressing yourself',
        context: 'This dream frequently occurs during periods of significant life changes or stress.'
      },
      house: {
        familiar: 'represents your current state of mind or sense of self',
        unknown: 'suggests unexplored aspects of your personality',
        rooms: 'Different rooms may represent different aspects of your life or personality.'
      },
      darkness: {
        fear: 'represents fear of the unknown or uncertainty in your life',
        exploration: 'suggests a need to explore hidden aspects of yourself',
        guidance: 'The darkness may be calling you to trust your intuition.'
      },
      light: {
        insight: 'symbolizes clarity, understanding, or spiritual awakening',
        guidance: 'represents hope, direction, or divine intervention',
        transformation: 'suggests personal growth and enlightenment.'
      }
    };

    const dreamLower = dream.toLowerCase();
    let interpretation = '';
    let usedThemes = new Set();

    // Analyze multiple themes in the dream
    Object.entries(dreamThemes).forEach(([theme, meanings]) => {
      if (dreamLower.includes(theme) && !usedThemes.has(theme)) {
        usedThemes.add(theme);
        
        if (theme === 'flying') {
          interpretation += `Your experience of ${theme} ${dreamLower.includes('scared') ? meanings.negative : meanings.positive} ${meanings.context} `;
        } else if (theme === 'water') {
          interpretation += `The presence of water in your dream ${dreamLower.includes('calm') ? meanings.calm : meanings.turbulent} ${meanings.depth} `;
        } else if (typeof meanings === 'object' && 'primary' in meanings) {
          interpretation += `The ${theme} in your dream ${meanings.primary}. ${meanings.context} ${meanings.deeper} `;
        }
      }
    });

    // Add emotional context if no specific themes were found
    if (!interpretation) {
      const emotions = ['fear', 'joy', 'anxiety', 'peace', 'confusion', 'anger', 'love'];
      const emotionalContext = emotions.filter(emotion => dreamLower.includes(emotion));
      
      if (emotionalContext.length > 0) {
        interpretation = `Your dream reflects a complex emotional state involving ${emotionalContext.join(' and ')}. `;
        interpretation += 'The interplay of these emotions suggests you may be processing significant life experiences or changes. ';
      } else {
        interpretation = 'Your dream appears to be processing recent experiences and emotions. The specific symbols and events suggest a period of personal growth and introspection. ';
      }
    }

    // Add a personalized conclusion
    interpretation += '\nThis dream is uniquely personal to your current life situation and may be highlighting areas that need your attention or acknowledgment.';

    return interpretation;
  };

  const analyzeEmotions = (emotions: string) => {
    const emotionalPatterns = {
      joy: {
        keywords: ['happy', 'excited', 'peaceful', 'content', 'elated', 'blissful'],
        analysis: 'Your emotional state shows positive energy and fulfillment. This suggests a period of personal growth and satisfaction in your life.',
        deeper: 'This positive emotional state may be revealing your capacity for happiness and personal achievement.'
      },
      fear: {
        keywords: ['scared', 'terrified', 'frightened', 'horror', 'dread'],
        analysis: 'Your emotional response indicates underlying anxieties or fears that may need addressing. This could be related to recent changes or upcoming challenges.',
        deeper: 'These fear-based emotions might be highlighting areas where you feel vulnerable or unprepared.'
      },
      sadness: {
        keywords: ['sad', 'depressed', 'melancholy', 'grief', 'heartbroken'],
        analysis: 'The presence of sadness in your dream suggests unprocessed emotions or a need for emotional healing.',
        deeper: 'This emotional state may be calling for acknowledgment and gentle self-care.'
      },
      anxiety: {
        keywords: ['anxious', 'worried', 'nervous', 'stressed', 'uneasy'],
        analysis: 'Your emotional state reflects inner tension and concern. This might be connected to current life pressures or uncertainty about the future.',
        deeper: 'The anxiety present in your dream could be highlighting areas where you need more support or clarity.'
      },
      confusion: {
        keywords: ['confused', 'uncertain', 'lost', 'unclear', 'bewildered'],
        analysis: 'The emotional confusion in your dream suggests a period of transition or decision-making in your life.',
        deeper: 'This state of uncertainty may be inviting you to trust your intuition more deeply.'
      },
      anger: {
        keywords: ['angry', 'furious', 'rage', 'frustrated', 'irritated'],
        analysis: 'The presence of anger suggests unresolved conflicts or suppressed emotions that need attention.',
        deeper: 'This emotional energy might be signaling a need to assert boundaries or address injustices.'
      }
    };

    const emotionsLower = emotions.toLowerCase();
    let analysis = '';
    let matchedPatterns = 0;
    let emotionalThemes = new Set();

    Object.entries(emotionalPatterns).forEach(([pattern, data]) => {
      if (data.keywords.some(keyword => emotionsLower.includes(keyword))) {
        emotionalThemes.add(pattern);
        analysis += `${data.analysis} ${data.deeper}\n\n`;
        matchedPatterns++;
      }
    });

    if (matchedPatterns > 1) {
      analysis += `The combination of ${Array.from(emotionalThemes).join(', ')} suggests a complex emotional landscape. This mix of emotions indicates that you're processing multiple aspects of your life experience simultaneously.\n\n`;
    }

    if (!analysis) {
      analysis = 'Your emotional response to the dream reveals deep-seated feelings that are seeking expression. Consider journaling about these emotions to gain further insight.\n\n';
    }

    analysis += 'Remember that emotions in dreams often serve as messengers from our subconscious, helping us understand our deeper needs and concerns.';

    return analysis;
  };

  const generateAdvice = (dream: string, emotions: string) => {
    const dreamLower = dream.toLowerCase();
    const emotionsLower = emotions.toLowerCase();
    let advice = 'Based on your unique dream experience and emotional response, here are personalized recommendations:\n\n';
    
    // Dynamic advice based on dream content and emotions
    if (dreamLower.includes('falling')) {
      advice += '1. Practice grounding exercises to enhance your sense of stability and control:\n';
      advice += '   - Try the 5-4-3-2-1 sensory awareness technique\n';
      advice += '   - Engage in regular physical exercise to strengthen your sense of balance\n';
      advice += '2. Explore areas in your life where you feel unsupported and consider building stronger support systems.\n';
    }
    
    if (dreamLower.includes('chase') || dreamLower.includes('running')) {
      advice += '1. Identify what you might be avoiding in your waking life:\n';
      advice += '   - Make a list of current challenges or responsibilities\n';
      advice += '   - Create a step-by-step plan to address each one\n';
      advice += '2. Practice confronting difficult situations through gradual exposure and confidence-building exercises.\n';
    }
    
    if (dreamLower.includes('water')) {
      if (dreamLower.includes('calm')) {
        advice += '1. Maintain your emotional balance through:\n';
        advice += '   - Regular meditation practice\n';
        advice += '   - Mindful breathing exercises\n';
        advice += '2. Document your successful emotional regulation strategies.\n';
      } else {
        advice += '1. Develop emotional regulation techniques:\n';
        advice += '   - Practice deep breathing exercises\n';
        advice += '   - Try progressive muscle relaxation\n';
        advice += '2. Consider working with a counselor to navigate emotional turbulence.\n';
      }
    }
    
    if (dreamLower.includes('flying')) {
      advice += '1. Channel your aspirations into actionable goals:\n';
      advice += '   - Create a vision board\n';
      advice += '   - Set SMART objectives for your dreams\n';
      advice += '2. Explore activities that promote personal freedom and growth.\n';
    }
    
    if (emotionsLower.includes('anxiety') || emotionsLower.includes('stress')) {
      advice += '1. Establish a calming bedtime routine:\n';
      advice += '   - Practice gentle yoga or stretching\n';
      advice += '   - Try aromatherapy with lavender or chamomile\n';
      advice += '2. Maintain an anxiety journal to track triggers and patterns.\n';
      advice += '3. Consider mindfulness meditation or guided relaxation techniques.\n';
    }
    
    if (emotionsLower.includes('sad') || emotionsLower.includes('grief')) {
      advice += '1. Create space for emotional processing:\n';
      advice += '   - Set aside quiet time for reflection\n';
      advice += '   - Practice self-compassion exercises\n';
      advice += '2. Explore grief counseling or support groups.\n';
      advice += '3. Engage in expressive arts or journaling.\n';
    }
    
    if (dreamLower.includes('teeth') || dreamLower.includes('appearance')) {
      advice += '1. Enhance self-expression through:\n';
      advice += '   - Public speaking practice\n';
      advice += '   - Writing exercises\n';
      advice += '2. Work with a therapist on communication skills.\n';
      advice += '3. Practice positive self-image affirmations.\n';
    }
    
    if (dreamLower.includes('house') || dreamLower.includes('home')) {
      advice += '1. Evaluate your personal boundaries and living space:\n';
      advice += '   - Declutter and organize your environment\n';
      advice += '   - Create a dedicated space for relaxation\n';
      advice += '2. Reflect on your sense of security and belonging.\n';
      advice += '3. Consider feng shui principles for harmony in your living space.\n';
    }
    
    // Add specific recommendations if none of the above were triggered
    if (!advice.includes('1.')) {
      advice += '1. Maintain a detailed dream journal:\n';
      advice += '   - Record dreams immediately upon waking\n';
      advice += '   - Note recurring themes and symbols\n';
      advice += '2. Practice mindfulness meditation daily.\n';
      advice += '3. Schedule regular self-reflection time.\n';
    }
    
    advice += '\nPersonal Growth Suggestions:\n';
    advice += '• Consider working with a dream therapist or counselor\n';
    advice += '• Join a dream interpretation group or workshop\n';
    advice += '• Read books on dream psychology and symbolism\n';
    
    advice += '\nRemember: Your dreams are unique messages from your subconscious. Regular reflection and professional guidance can help you better understand their significance in your life journey.';
    
    return advice;
  };

  return (
    <div 
      className={`min-h-screen transition-all duration-1000 ${emotionBackgrounds[currentEmotion]} text-white`}
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${emotionImages[currentEmotion][currentImageIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlend: 'overlay',
        transition: 'background-image 2s ease-in-out'
      }}>
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Moon className="w-12 h-12 text-yellow-300 animate-pulse" />
            <h1 className="text-4xl font-bold">Dream Analyzer</h1>
          </div>
          <p className="text-lg text-gray-300">Unlock the mysteries of your subconscious mind</p>
        </header>

        <div className="max-w-2xl mx-auto backdrop-blur-lg bg-black/30 rounded-lg p-8 shadow-xl border border-white/10">
          <div className="space-y-6">
            <div>
              <label htmlFor="dream" className="block text-lg font-medium mb-2">
                Describe your dream
              </label>
              <textarea
                id="dream"
                value={dream}
                onChange={(e) => setDream(e.target.value)}
                className="w-full h-32 px-4 py-2 rounded-lg bg-white/10 border border-white/30 focus:border-white/50 focus:ring focus:ring-white/20 focus:outline-none text-white"
                placeholder="What happened in your dream? Include as many details as you can remember..."
              />
            </div>

            <div>
              <label htmlFor="emotions" className="block text-lg font-medium mb-2">
                How did you feel?
              </label>
              <textarea
                id="emotions"
                value={emotions}
                onChange={(e) => setEmotions(e.target.value)}
                className="w-full h-24 px-4 py-2 rounded-lg bg-white/10 border border-white/30 focus:border-white/50 focus:ring focus:ring-white/20 focus:outline-none text-white"
                placeholder="Describe the emotions you experienced during and after the dream..."
              />
            </div>

            {inputError && (
              <div className="text-red-400 text-sm mt-2">
                {inputError}
              </div>
            )}

            <button
              onClick={analyzeDream}
              disabled={!dream || !emotions || isAnalyzing}
              className="w-full py-3 px-6 bg-white/20 backdrop-blur-sm rounded-lg font-medium text-white shadow-lg hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-white/30"
            >
              {isAnalyzing ? (
                <>
                  <Brain className="w-5 h-5 animate-pulse" />
                  Analyzing Dream Pattern...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Analyze Dream
                </>
              )}
            </button>
          </div>

          {analysis && (
            <div className="mt-8 space-y-6 bg-white/10 p-6 rounded-lg border border-white/20">
              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-400" />
                  Dream Interpretation
                </h3>
                <p className="text-gray-300 whitespace-pre-line">{analysis.interpretation}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-pink-400" />
                  Emotional Analysis
                </h3>
                <p className="text-gray-300 whitespace-pre-line">{analysis.emotionalSignificance}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <Moon className="w-6 h-6 text-yellow-300" />
                  Professional Recommendations
                </h3>
                <p className="text-gray-300 whitespace-pre-line">{analysis.advice}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;