import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '@fontsource/orbitron/400.css';
import '@fontsource/orbitron/700.css';

const AILoader = ({ onComplete }) => {
  const [currentLanguage, setCurrentLanguage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showFinalText, setShowFinalText] = useState(false);

  const languages = [
    { text: "कृत्रिम बुद्धिमत्ता", lang: "Hindi" },
    { text: "કૃત્રિમ બુદ્ધિ", lang: "Gujarati" },
    { text: "ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ", lang: "Kannada" },
    { text: "செயற்கை நுண்ணறிவு", lang: "Tamil" },
    { text: "Intelligence Artificielle", lang: "French" },
    { text: "人工知能", lang: "Japanese" },
    { text: "Künstliche Intelligenz", lang: "German" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLanguage((prev) => (prev + 1) % languages.length);
    }, 800);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setIsLoading(false);
      setShowFinalText(true);
      setTimeout(() => onComplete?.(), 3500);
    }, languages.length * 800 + 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0a0a12] z-50 overflow-hidden">
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border-b border-r border-pink-900/30"
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Floating Glow Dots */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-400"
            style={{
              width: `${Math.random() * 10 + 2}px`,
              height: `${Math.random() * 10 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(1px)'
            }}
            animate={{
              y: [0, -100],
              x: [0, (Math.random() - 0.5) * 50],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-md px-4">
        {/* Futuristic AI Core */}
        <motion.div 
          className="relative w-44 h-44 mx-auto mb-12"
          initial={{ scale: 0.8 }}
          animate={{ 
            scale: isLoading ? [0.9, 1.1, 0.9] : 1.2,
          }}
          transition={{
            duration: isLoading ? 6 : 2,
            repeat: isLoading ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          {/* Glowing Rings */}
          <motion.div
            className="absolute inset-0 rounded-full border border-cyan-400/30"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.8, 0.4],
              rotate: 360
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Pulsing Core */}
          <div className="absolute inset-8 flex items-center justify-center">
            <motion.div
              className="h-full w-full rounded-full flex items-center justify-center"
              animate={{
                background: [
                  'radial-gradient(circle, rgba(236,72,153,0.2) 0%, rgba(8,145,178,0.1) 70%, transparent 100%)',
                  'radial-gradient(circle, rgba(236,72,153,0.4) 0%, rgba(8,145,178,0.3) 70%, transparent 100%)',
                  'radial-gradient(circle, rgba(236,72,153,0.2) 0%, rgba(8,145,178,0.1) 70%, transparent 100%)'
                ],
                boxShadow: [
                  '0 0 30px rgba(236,72,153,0.3), 0 0 60px rgba(8,145,178,0.2)',
                  '0 0 50px rgba(236,72,153,0.5), 0 0 90px rgba(8,145,178,0.3)',
                  '0 0 30px rgba(236,72,153,0.3), 0 0 60px rgba(8,145,178,0.2)'
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Futuristic AI Icon */}
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-24 w-24"
                fill="none"
                animate={{
                  filter: [
                    'drop-shadow(0 0 5px rgba(236,72,153,0.7)) drop-shadow(0 0 10px rgba(8,145,178,0.5))',
                    'drop-shadow(0 0 10px rgba(236,72,153,0.9)) drop-shadow(0 0 20px rgba(8,145,178,0.7))',
                    'drop-shadow(0 0 5px rgba(236,72,153,0.7)) drop-shadow(0 0 10px rgba(8,145,178,0.5))'
                  ],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                  fill="url(#aiGradient)"
                />
                <path
                  d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
                  fill="url(#aiGradient)"
                />
                <path
                  d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                  fill="url(#aiGradient)"
                />
                <defs>
                  <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#0891b2" />
                  </linearGradient>
                </defs>
              </motion.svg>
            </motion.div>
          </div>
        </motion.div>

        {/* Text Content */}
        <div className="h-40 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!showFinalText ? (
              <motion.div
                key={currentLanguage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="space-y-2"
              >
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold"
                  style={{ 
                    fontFamily: "'Orbitron', sans-serif",
                    background: 'linear-gradient(90deg, #ec4899, #0891b2)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    textShadow: '0 0 10px rgba(236,72,153,0.5)'
                  }}
                  animate={{
                    textShadow: [
                      '0 0 10px rgba(236,72,153,0.5)',
                      '0 0 20px rgba(236,72,153,0.7)',
                      '0 0 10px rgba(236,72,153,0.5)'
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {languages[currentLanguage].text}
                </motion.h2>
                <motion.p 
                  className="text-sm uppercase tracking-widest"
                  style={{
                    color: '#a5f3fc',
                    textShadow: '0 0 5px rgba(8,145,178,0.7)'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {languages[currentLanguage].lang}
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "backOut" }}
                className="space-y-4"
              >
                <motion.h2
                  className="text-5xl md:text-6xl font-bold"
                  style={{ 
                    fontFamily: "'Orbitron', sans-serif",
                    background: 'linear-gradient(90deg, #ec4899, #0891b2)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    textShadow: '0 0 20px rgba(236,72,153,0.7)'
                  }}
                  initial={{ letterSpacing: '1em', opacity: 0 }}
                  animate={{ 
                    letterSpacing: '0.2em',
                    opacity: 1,
                    textShadow: [
                      '0 0 20px rgba(236,72,153,0.7)',
                      '0 0 30px rgba(236,72,153,0.9)',
                      '0 0 20px rgba(236,72,153,0.7)'
                    ]
                  }}
                  transition={{ 
                    duration: 2, 
                    ease: "circOut",
                    textShadow: {
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                >
                  ARTIFICIAL INTELLIGENCE
                </motion.h2>
                <motion.div
                  className="w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 1.5 }}
                />
                <motion.p
                  className="text-lg uppercase tracking-widest mt-6"
                  style={{
                    color: '#a5f3fc',
                    textShadow: '0 0 10px rgba(8,145,178,0.7)'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    textShadow: [
                      '0 0 10px rgba(8,145,178,0.7)',
                      '0 0 15px rgba(8,145,178,0.9)',
                      '0 0 10px rgba(8,145,178,0.7)'
                    ]
                  }}
                  transition={{ 
                    delay: 1, 
                    duration: 1,
                    textShadow: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                >
                  Intelligence Activated
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Final Glow Effect */}
        {showFinalText && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)'
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 3, ease: "easeOut" }}
          />
        )}
      </div>
    </div>
  );
};

export default AILoader;