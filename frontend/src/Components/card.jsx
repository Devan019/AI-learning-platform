import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Trophy, ChevronRight, BookOpen, Target, Clock, CheckCircle, XCircle, Zap } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";

const FloatingParticles = () => {
  return (
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
};

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

export function QuizApp() {
  const { courseid } = useParams()
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quiz, setQuiz] = useState({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const [submit, setSubmit] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(1);
  const [userLevel, setUserLevel] = useState("Intermediate");
  const [levelMessage, setLevelMessage] = useState('Good Job! You are at an Intermediate Level.');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [course, setcourse] = useState({})
  const [course_id, setcourse_id] = useState(null)
  const [title, settitle] = useState("")
  const titleRef = useRef("")

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timeLeft > 0 && !showResults && !submit) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
      // Auto submit when time runs out
      // if (selectedOption) {
        handleNext();
        setSubmit(true)
      // }
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, showResults, submit, selectedOption]);

  async function getContent() {
    console.log(courseid)
    const api = await axios.get(`${import.meta.env.VITE_API}/courses/${courseid}`, { withCredentials: true })

    const courses = api.data;
    return courses;
  }

  async function fetchQuiz(difficultyLevel) {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/gemini/question/${titleRef.current}/${difficultyLevel}`, { withCredentials: true }
      );
      const quizdata = response.data;
      const jsondata = JSON.parse(quizdata.replace(/```json|```/g, "").trim());
      // console.log("Quiz data fetched:", jsondata);
      setQuiz(jsondata);
      setCurrentQuestion(0);
      setSelectedOption(null);
      setShowResults(false);
      setDifficulty(jsondata.difficulty)
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    }
  }

  useEffect(() => {
    async function main() {
      setIsLoading(true);
      const course = await getContent()
      const level = course.level;
      setDifficulty(level);

      setcourse(course)
      if (!course?.title) return;
      titleRef.current = course?.title;
      settitle(course.title)
      setIsLoading(true);
      setcourse_id(course.id);
      await fetchQuiz(level);
    }
    main();
  }, [])



  const handleAnswer = (option, index) => {
    if (submit) return;

    setSelectedOption({ option, index });
    const correct = option === quiz.answer;
    setIsCorrect(correct);
    // setIsTimerActive(false);
  };

  

  const sendReport = async (obj) => {
    const api = await axios.post(`${import.meta.env.VITE_API}/quizzes/${course_id}`, obj, { withCredentials: true });
    console.log(api.data)
    return api.data;
  }

  const handleNext = async () => {
  if (submit) {
    setTotalQuestions((prev) => prev + 1);

    if (totalQuestions >= 5) {
      setIsLoading(true);
      const sendObj = {
        title: title,
        course: course,
        score: score,
        userLevel: userLevel
      };
      await sendReport(sendObj);
      setShowResults(true);
      setIsLoading(false);
      return;
    }

    // Calculate new difficulty based on correctness
    let newDifficulty = difficulty;
    if (isCorrect) {
      // Increase difficulty
      if (difficulty === "easy" || difficulty === "Beginner") {
        newDifficulty = "medium";
      } else if (difficulty === "medium") {
        newDifficulty = "hard";
      }
      // If already hard, stay at hard
    } else {
      // Decrease difficulty
      if (difficulty === "hard") {
        newDifficulty = "medium";
      } else if (difficulty === "medium") {
        newDifficulty = "Beginner";
      }
      // If already easy, stay at easy
    }

    // Update difficulty state and fetch new question
    setDifficulty(newDifficulty);
    setIsLoading(true);
    await fetchQuiz(newDifficulty); // Use the newDifficulty directly

    // Reset for next question
    setSelectedOption(null);
    setSubmit(false);
    setTimeLeft(30);
    setIsLoading(false);
    setIsTimerActive(true);
  } else {
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setSubmit(true);
  }
};

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setShowResults(false);
    setSubmit(false);
    setTotalQuestions(1);
    setTimeLeft(30);
    setIsTimerActive(true);
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'easy': return 'from-green-400 to-emerald-500';
      case 'medium': return 'from-yellow-400 to-orange-500';
      case 'hard': return 'from-red-400 to-pink-500';
      default: return 'from-blue-400 to-purple-500';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'Beginner': return <BookOpen className="w-6 h-6" />;
      case 'Intermediate': return <Target className="w-6 h-6" />;
      case 'Advanced': return <Trophy className="w-6 h-6" />;
      default: return <Star className="w-6 h-6" />;
    }
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <FloatingParticles />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative max-w-lg w-full bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl text-white p-8 rounded-2xl shadow-2xl border border-gray-700/50"
        >
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
              <ProgressRing progress={(score / 5) * 100} size={120} />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <p className="text-2xl font-semibold">
                Your Score: <span className="text-yellow-400">{score}</span> / <span className="text-gray-400">5</span>
              </p>

              <div className="flex items-center justify-center space-x-2 text-lg">
                {getLevelIcon(userLevel)}
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
                onClick={handleRestart}
                className="group px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center space-x-2"
              >
                <span>Start New Quiz</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <FloatingParticles />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-2xl w-full bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl text-white p-8 rounded-2xl shadow-2xl border border-gray-700/50"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                {title} Quiz
              </h1>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getDifficultyColor(difficulty)}`}>
              {difficulty?.charAt(0)?.toUpperCase() + difficulty?.slice(1)}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Question</p>
              <p className="font-bold">{totalQuestions} / 5</p>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              <div className="text-right">
                <p className="text-sm text-gray-400">Time</p>
                <p className={`font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
                  {timeLeft}s
                </p>
              </div>
            </div>
          </div>
        </div>

        {!isLoading ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 p-6 rounded-xl border border-gray-600/50">
                <h2 className="text-xl font-semibold leading-relaxed">
                  {quiz.question}
                </h2>
              </div>

              <div className="grid gap-3">
                {quiz.options?.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(option, index)}
                    disabled={submit}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={!submit ? { scale: 1.02, x: 8 } : {}}
                    whileTap={!submit ? { scale: 0.98 } : {}}
                    className={`group relative p-4 text-left rounded-xl border-2 transition-all duration-300 ${selectedOption?.index === index
                      ? submit
                        ? isCorrect
                          ? 'border-green-500 bg-green-500/20 text-green-100'
                          : 'border-red-500 bg-red-500/20 text-red-100'
                        : 'border-yellow-500 bg-yellow-500/20 text-yellow-100'
                      : submit && option === quiz.answer
                        ? 'border-green-500 bg-green-500/20 text-green-100'
                        : 'border-gray-600 hover:border-gray-500 bg-gray-800/50 hover:bg-gray-700/50'
                      } ${submit ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${selectedOption?.index === index
                        ? submit
                          ? isCorrect
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                          : 'bg-yellow-500 text-white'
                        : submit && option === quiz.answer
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-700 text-gray-300 group-hover:bg-gray-600'
                        }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="flex-1 font-medium">{option}</span>
                      {submit && (
                        <div className="ml-auto">
                          {(selectedOption?.index === index && isCorrect) || option === quiz.answer ? (
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          ) : selectedOption?.index === index && !isCorrect ? (
                            <XCircle className="w-6 h-6 text-red-400" />
                          ) : null}
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {submit && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-6 rounded-xl border border-blue-500/30"
                >
                  <h3 className="font-bold text-blue-300 mb-2 flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Explanation</span>
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{quiz.explanation}</p>
                </motion.div>
              )}

              <div className="flex justify-end pt-4">
                <motion.button
                  onClick={handleNext}
                  disabled={!selectedOption}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-purple-500/25"
                >
                  <span>{submit ? "Next Question" : "Submit Answer"}</span>
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        )}
      </motion.div>
    </div>
  );
}