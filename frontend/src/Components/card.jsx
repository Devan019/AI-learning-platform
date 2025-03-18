import React, { useEffect, useState } from "react";
import { Meteors } from "../Components/ui/metro";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export function QuizApp() {
  const {courseid} = useParams()
  // console.log(courseid)
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quiz, setQuiz] = useState([]);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const [submit, setSubmit] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalQuestions, setTotalQuestions] = useState(1);
  const [warning, setWarning] = useState("");
  const [voices, setVoices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuiz(difficulty);
  }, []);

  function difficultyLevel(islevel) {
    if (islevel) {
      if (difficulty == "easy") {
        setDifficulty("medium");
      } else if (difficulty == "medium") {
        setDifficulty("hard");
      }
    } else {
      if (difficulty == "hard") {
        setDifficulty("medium");
      } else if (difficulty == "medium") {
        setDifficulty("easy");
      }
    }
  }

  // useEffect(() => {
  //       const handleVisibilityChange = () => {
  //         if (document.hidden) {
  //           const warningMsg = "⚠ Tab switching is not allowed! Please stay on the quiz page.";
  //           setWarning(warningMsg);
  //           document.title = "⚠ Warning: Stay on the Quiz!";
    
  //           alert(warningMsg);
  //           speakText(warningMsg);
  //         } else {
  //           setWarning("");
  //           document.title = "AI-Proctored Quiz";
  //         }
  //       };
    
  //       document.addEventListener("visibilitychange", handleVisibilityChange);
  //       return () => {
  //         document.removeEventListener("visibilitychange", handleVisibilityChange);
  //       };
  //     }, [voices]);

  async function getContent() {
    console.log(courseid)
    const api = await axios.get(`http://localhost:8090/api/courses/${courseid}`)

    const courses = api.data;
    return courses;
  }
    

  async function fetchQuiz(difficultyLevel) {
    const course = JSON.parse(localStorage.getItem("courses"));
    if (!course?.title) return;
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8090/api/gemini/question/${course.title}/${difficultyLevel}`
      );
      const quizdata = response.data;
      const jsontext = quizdata.candidates[0].content.parts[0].text;
      const jsondata = JSON.parse(jsontext.replace(/```json|```/g, "").trim());
      console.log("Quiz data fetched:", jsondata);
      setQuiz(jsondata);
      setCurrentQuestion(0);
      setSelectedOption(null);
      setShowResults(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    }
  }

  const handleAnswer = (evt, option) => {
    document.querySelectorAll(".options").forEach((el) => {
      el.classList.remove("bg-yellow-600");
    });

    evt.target.classList.add("bg-yellow-600");

    setSelectedOption(option);
    const correct = option == quiz.answer;

    setIsCorrect(correct);

    localStorage.setItem(
      `question_${currentQuestion}`,
      JSON.stringify({
        selected: option,
        correct,
      })
    );
  };

  const handleNext = () => {
    console.log(submit);
    if (submit) {
      setTotalQuestions((prev) => prev + 1);
      if (isCorrect) {
        difficultyLevel(true);
      } else {
        difficultyLevel(false);
      }

      document.querySelectorAll(".options").forEach((el) => {
        el.classList.remove("bg-green-600");
        el.classList.remove("bg-red-600");
      });

      if (totalQuestions == 5) {
        setShowResults(true);
        return;
      }

      fetchQuiz(difficulty);
      setSubmit(false);
    } else {
      document.querySelectorAll(".options").forEach((el) => {
        el.classList.remove("bg-yellow-600");

        if (el.innerText.includes(quiz.answer)) {
          el.classList.add("bg-green-600");
        }

        if (isCorrect && el.innerText.includes(selectedOption)) {
          el.classList.add("bg-green-600");
          setScore((prev) => prev + 1);
        }

        if (!isCorrect && el.innerText.includes(selectedOption)) {
          el.classList.add("bg-red-600");
        }
      });

      setSubmit(true);
    }
  };

  const handleRestart = () => {
    navigate(`/courses`);
  };

  return (
    <div className="z-0 relative max-w-lg mx-auto bg-gray-900 text-white p-8 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
      <Meteors number={20} />
{/* 
      {warning && <p style={{ color: "red" }}>{warning}</p>}
      <WebcamCapture onWarning={setWarning} /> */}

      {!showResults ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="relative z-50"
          >
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text">
              {!isLoading
                ? `${quiz.question} [ ${quiz.difficulty} ]`
                : "Loading..."}
            </h2>

            <div className="flex flex-col gap-3">
              {!isLoading && quiz.options
                ? quiz.options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={(evt) => {
                        handleAnswer(evt, option);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 text-white rounded-lg border-2 border-gray-600 transition-all duration-300 options`}
                    >
                      {String.fromCharCode(65 + index)}. {option}
                    </motion.button>
                  ))
                : "Loading options..."}
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="relative z-50 text-center">
          <h2 className="text-3xl font-bold text-green-400">Quiz Completed!</h2>
          <p className="text-lg mt-2">
            Your Score: {score} / {5}
          </p>
          <p className="text-md mt-2">
            {score >= 4
              ? "Excellent! You are at an Advanced Level."
              : score >= 2
              ? "Good Job! You are at an Intermediate Level."
              : "Keep Practicing! You are at a Beginner Level."}
          </p>

          <motion.button
            onClick={handleRestart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 px-5 py-2 text-white rounded-lg border-2 border-gray-600 transition-all duration-300 hover:border-blue-400 hover:bg-blue-500"
          >
            Go back to Courses
          </motion.button>
        </div>
      )}

      {!showResults && !isLoading && (
        <div className="flex justify-between mt-6 relative z-50">
          {/* <motion.button
            disabled={currentQuestion === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 text-white rounded-lg border-2 border-gray-600 transition-all duration-300 hover:border-teal-400 hover:bg-teal-500 disabled:opacity-50"
          >
            Check Ans
          </motion.button> */}

          <motion.button
            onClick={handleNext}
            disabled={!selectedOption}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 text-white rounded-lg border-2 border-gray-600 transition-all duration-300 hover:border-blue-400 hover:bg-blue-500 disabled:opacity-50"
          >
            {submit ? "Next" : "Submit"}
          </motion.button>
        </div>
      )}

      {!isLoading && !showResults && submit ? (
        <>
          <div className="mt-6">
            <h3 className="text-lg font-bold text-green-400">
              Explanation : - <span>{quiz.explanation}</span>{" "}
            </h3>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}


