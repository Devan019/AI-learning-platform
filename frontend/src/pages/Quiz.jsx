import { Navbar } from "../Components/Nav";
import { QuizApp } from "../Components/card";
import React from "react";

const Quiz = () => {
  return (
    <div className="dark:bg-zinc-900 bg-gray-100 min-h-screen flex flex-col items-center py-10">
      <Navbar />
      <div className="mt-26">
        <QuizApp />
      </div>
    </div>
  );
};

export default Quiz;
