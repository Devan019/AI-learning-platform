import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Trophy, ChevronRight, BookOpen, Target, Clock, CheckCircle, XCircle, Zap } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getUserLevel } from "../helper/math/userLevelByQuiz";

// Constants
const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];
const MAX_QUESTIONS = 5;
const INITIAL_TIME = 30;
const WARNING_TIME = 10;

// Sub-components
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30"
        animate={{
          x: [0, Math.random() * 100 - 50],
          y: [0, Math.random() * 100 - 50],
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{
          duration: Math.random() * 4 + 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`
        }}
      />
    ))}
  </div>
);

const ProgressRing = ({ progress, size = 60 }) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(75, 85, 99, 0.3)"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-white">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

const DifficultyIndicator = ({ difficulty }) => {
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'Beginner': return 'from-green-400 to-emerald-500';
      case 'Intermediate': return 'from-yellow-400 to-orange-500';
      case 'Advanced': return 'from-red-400 to-pink-500';
      case 'Expert': return 'from-purple-500 to-pink-600';
      default: return 'from-blue-400 to-purple-500';
    }
  };

  return (
    <div className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getDifficultyColor()}`}>
      {difficulty}
    </div>
  );
};

const LevelIcon = ({ level }) => {
  switch (level) {
    case 'Beginner': return <BookOpen className="w-6 h-6" />;
    case 'Intermediate': return <Target className="w-6 h-6" />;
    case 'Advanced': return <Trophy className="w-6 h-6" />;
    default: return <Star className="w-6 h-6" />;
  }
};

const QuizResults = ({ score, userLevel, levelMessage, onRestart }) => (
  <div className="text-center space-y-6">
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="flex justify-center"
    >
      <div className="p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
        <Trophy className="w-12 h-12 text-white" />
      </div>
    </motion.div>

    <motion.h2
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text"
    >
      Quiz Completed!
    </motion.h2>

    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.4, type: "spring" }}
      className="flex justify-center"
    >
      <ProgressRing progress={(score / MAX_QUESTIONS) * 100} size={120} />
    </motion.div>

    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="space-y-3"
    >
      <p className="text-2xl font-semibold">
        Your Score: <span className="text-yellow-400">{score}</span> / <span className="text-gray-400">{MAX_QUESTIONS}</span>
      </p>

      <div className="flex items-center justify-center space-x-2 text-lg">
        <LevelIcon level={userLevel} />
        <span className="font-medium">{levelMessage}</span>
      </div>
    </motion.div>

    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="pt-4"
    >
      <button
        onClick={onRestart}
        className="group px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center space-x-2"
      >
        <span>Start New Quiz</span>
        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  </div>
);

export function QuizApp() {
  const { courseid } = useParams();
  const [quizState, setQuizState] = useState({
    currentQuestion: 0,
    selectedOption: null,
    quiz: {},
    score: 0,
    showResults: false,
    difficulty: "Intermediate",
    isSubmitted: false,
    isCorrect: false,
    totalQuestions: 1,
    userLevel: "Intermediate",
    levelMessage: 'Good Job! You are at an Intermediate Level.',
    timeLeft: INITIAL_TIME,
    isTimerActive: true,
    course: {},
    userQuiz: [],
    isCorrectArray: [],
    error: null,
    isLoading: true
  });

  const titleRef = useRef("");
  const timerRef = useRef(null);

  // Helper functions
  const updateQuizState = (updates) => {
    setQuizState(prev => ({ ...prev, ...updates }));
  };

  const getNewDifficulty = (currentDifficulty, isCorrect) => {
    const currentIndex = DIFFICULTY_LEVELS.indexOf(currentDifficulty);
    const newIndex = isCorrect 
      ? Math.min(currentIndex + 1, DIFFICULTY_LEVELS.length - 1)
      : Math.max(currentIndex - 1, 0);
    return DIFFICULTY_LEVELS[newIndex];
  };

  // API functions
  const getContent = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/courses/${courseid}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching course content:", error);
      updateQuizState({ error: "Failed to load course content", isLoading: false });
      return null;
    }
  };

  const fetchQuiz = async (difficultyLevel) => {
    updateQuizState({ isLoading: true, error: null });
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/gemini/question/${titleRef.current}/${difficultyLevel}`,
        { withCredentials: true }
      );
      
      const quizData = response.data;
      const jsonData = JSON.parse(quizData.replace(/```json|```/g, "").trim());
      
      updateQuizState({
        quiz: jsonData,
        selectedOption: null,
        isSubmitted: false,
        timeLeft: INITIAL_TIME,
        isTimerActive: true,
        isLoading: false
      });
    } catch (error) {
      console.error("Error fetching quiz data:", error);
      updateQuizState({ 
        error: "Failed to load quiz questions", 
        isLoading: false 
      });
    }
  };

  const sendReport = async (reportData) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API}/quizzes/${quizState.course.id}`,
        reportData,
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error saving quiz results:", error);
      // We'll still continue even if report fails
    }
  };

  // Timer effect
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Start new timer if conditions are met
    if (quizState.isTimerActive && quizState.timeLeft > 0 && !quizState.showResults && !quizState.isSubmitted) {
      timerRef.current = setInterval(() => {
        setQuizState(prev => {
          if (prev.timeLeft <= 1) {
            clearInterval(timerRef.current);
            return { ...prev, timeLeft: 0 };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    } else if (quizState.timeLeft === 0 && !quizState.isSubmitted) {
      handleAnswerSubmit();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quizState.isTimerActive, quizState.timeLeft, quizState.showResults, quizState.isSubmitted]);


  // Initialization effect
  useEffect(() => {
    const initializeQuiz = async () => {
      const course = await getContent();
      if (!course) return;

      titleRef.current = course.title;
      
      updateQuizState({
        course,
        difficulty: course.level || "Intermediate",
        isLoading: true
      });

      await fetchQuiz(course.level || "Intermediate");
    };

    initializeQuiz();
  }, [courseid]);

  // Event handlers
  const handleAnswerSelect = (option, index) => {
    if (quizState.isSubmitted) return;

    const isCorrect = option === quizState.quiz.answer;
    updateQuizState({ 
      selectedOption: { option, index },
      isCorrect 
    });
  };

  const handleAnswerSubmit = async () => {
    if (quizState.isSubmitted) {
      // Proceed to next question
      const nextQuestionNumber = quizState.totalQuestions + 1;
      
      if (nextQuestionNumber > MAX_QUESTIONS) {
        const finalUserLevel = getUserLevel(quizState.userQuiz);
        const reportData = {
          title: titleRef.current,
          course: quizState.course,
          score: quizState.score,
          userLevel: finalUserLevel
        };

        await sendReport(reportData);
        
        updateQuizState({
          showResults: true,
          userLevel: finalUserLevel,
          levelMessage: `Good Job! You are at ${finalUserLevel} Level.`,
          isLoading: false
        });
        return;
      }

      const newDifficulty = getNewDifficulty(quizState.difficulty, quizState.isCorrect);
      updateQuizState({ 
        difficulty: newDifficulty,
        totalQuestions: nextQuestionNumber // Fixed: Update question number here
      });
      await fetchQuiz(newDifficulty);
    } else {
      // Submit current answer
      const updatedUserQuiz = [
        ...quizState.userQuiz,
        { level: quizState.difficulty, isCorrect: quizState.isCorrect }
      ];

      const updatedIsCorrectArray = [
        ...quizState.isCorrectArray,
        quizState.isCorrect
      ];

      updateQuizState({
        isSubmitted: true,
        userQuiz: updatedUserQuiz,
        isCorrectArray: updatedIsCorrectArray,
        score: quizState.isCorrect ? quizState.score + 1 : quizState.score,
        isTimerActive: false
      });
    }
  };

  const handleRestart = () => {
    updateQuizState({
      currentQuestion: 0,
      selectedOption: null,
      score: 0,
      showResults: false,
      isSubmitted: false,
      totalQuestions: 1,
      timeLeft: INITIAL_TIME,
      isTimerActive: true,
      userQuiz: [],
      isCorrectArray: [],
      error: null
    });

    fetchQuiz(quizState.course.level || "Intermediate");
  };

  // Render functions
  const renderQuizContent = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key={quizState.currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 p-6 rounded-xl border border-gray-600/50">
          <h2 className="text-xl font-semibold leading-relaxed">
            {quizState.quiz.question}
          </h2>
        </div>

        <div className="grid gap-3">
          {quizState.quiz.options?.map((option, index) => {
            const isSelected = quizState.selectedOption?.index === index;
            const isCorrectAnswer = option === quizState.quiz.answer;
            const showCorrect = quizState.isSubmitted && isCorrectAnswer;
            const showIncorrect = quizState.isSubmitted && isSelected && !quizState.isCorrect;

            return (
              <motion.button
                key={index}
                onClick={() => handleAnswerSelect(option, index)}
                disabled={quizState.isSubmitted}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={!quizState.isSubmitted ? { scale: 1.02, x: 8 } : {}}
                whileTap={!quizState.isSubmitted ? { scale: 0.98 } : {}}
                className={`group relative p-4 text-left rounded-xl border-2 transition-all duration-300 ${
                  isSelected
                    ? quizState.isSubmitted
                      ? quizState.isCorrect
                        ? 'border-green-500 bg-green-500/20 text-green-100'
                        : 'border-red-500 bg-red-500/20 text-red-100'
                      : 'border-yellow-500 bg-yellow-500/20 text-yellow-100'
                    : showCorrect
                      ? 'border-green-500 bg-green-500/20 text-green-100'
                      : 'border-gray-600 hover:border-gray-500 bg-gray-800/50 hover:bg-gray-700/50'
                } ${quizState.isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                    isSelected
                      ? quizState.isSubmitted
                        ? quizState.isCorrect
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-yellow-500 text-white'
                      : showCorrect
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-700 text-gray-300 group-hover:bg-gray-600'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-1 font-medium">{option}</span>
                  {quizState.isSubmitted && (
                    <div className="ml-auto">
                      {showCorrect && <CheckCircle className="w-6 h-6 text-green-400" />}
                      {showIncorrect && <XCircle className="w-6 h-6 text-red-400" />}
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {quizState.isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-6 rounded-xl border border-blue-500/30"
          >
            <h3 className="font-bold text-blue-300 mb-2 flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Explanation</span>
            </h3>
            <p className="text-gray-300 leading-relaxed">{quizState.quiz.explanation}</p>
          </motion.div>
        )}

        <div className="flex justify-end pt-4">
          <motion.button
            onClick={handleAnswerSubmit}
            disabled={!quizState.selectedOption && !quizState.isSubmitted}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-purple-500/25"
          >
            <span>{quizState.isSubmitted ? "Next Question" : "Submit Answer"}</span>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Zap className="w-6 h-6 text-yellow-400" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
            {titleRef.current} Quiz
          </h1>
        </div>
        <DifficultyIndicator difficulty={quizState.difficulty} />
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm text-gray-400">Question</p>
          <p className="font-bold">{quizState.totalQuestions} / {MAX_QUESTIONS}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-yellow-400" />
          <div className="text-right">
            <p className="text-sm text-gray-400">Time</p>
            <p className={`font-bold ${
              quizState.timeLeft <= WARNING_TIME ? 'text-red-400 animate-pulse' : 'text-white'
            }`}>
              {quizState.timeLeft}s
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <FloatingParticles />

      {quizState.error ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative max-w-2xl w-full bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl text-white p-8 rounded-2xl shadow-2xl border border-gray-700/50 text-center"
        >
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Quiz</h2>
          <p className="mb-6">{quizState.error}</p>
          <button
            onClick={handleRestart}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg"
          >
            Try Again
          </button>
        </motion.div>
      ) : quizState.showResults ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative max-w-lg w-full bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl text-white p-8 rounded-2xl shadow-2xl border border-gray-700/50"
        >
          <QuizResults 
            score={quizState.score} 
            userLevel={quizState.userLevel} 
            levelMessage={quizState.levelMessage}
            onRestart={handleRestart}
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-2xl w-full bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl text-white p-8 rounded-2xl shadow-2xl border border-gray-700/50"
        >
          {renderHeader()}
          
          {quizState.isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : (
            renderQuizContent()
          )}
        </motion.div>
      )}
    </div>
  );
}