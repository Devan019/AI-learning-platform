import React, { useEffect, useState } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import axios from 'axios';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Insights = () => {
  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getanalysis() {
  
      const response = await axios.get(`${import.meta.env.VITE_API}/insights`,{withCredentials: 'include'} );
      
      let data = response.data;
      data.forEach((course) => {
        course.quizzes.forEach((quiz) => {
          quiz.createdByAI = true; // Mark quizzes as AI-generated
          quiz.score = (quiz.score/5) * 100; // Convert score to percentage
        });
      });
      setCourses(data);
      setQuizzes(data.flatMap(course => course.quizzes));
      // Process the data as needed
   
  }

  useEffect(() => {
    // Simulate API calls to fetch data
    const fetchData = async () => {
      try {
        // Mock data - all courses are AI-generated
        const mockCourses = [
          {
            id: '1',
            title: 'Introduction to AI',
            description: 'Learn the basics of Artificial Intelligence',
            level: 'Beginner',
            createdByAI: true,
            contents: [],
            quizzes: [
              { id: 'q1', title: 'AI Basics Quiz', score: 85, userLevel: 'Beginner' },
              { id: 'q2', title: 'AI Concepts Quiz', score: 78, userLevel: 'Beginner' }
            ]
          },
          {
            id: '2',
            title: 'Machine Learning Fundamentals',
            description: 'Core concepts of Machine Learning',
            level: 'Intermediate',
            createdByAI: true,
            contents: [],
            quizzes: [
              { id: 'q3', title: 'ML Basics Quiz', score: 92, userLevel: 'Intermediate' },
              { id: 'q4', title: 'Algorithms Quiz', score: 88, userLevel: 'Intermediate' }
            ]
          },
          {
            id: '3',
            title: 'Advanced Deep Learning',
            description: 'Deep dive into neural networks',
            level: 'Advanced',
            createdByAI: true,
            contents: [],
            quizzes: [
              { id: 'q5', title: 'NN Fundamentals Quiz', score: 76, userLevel: 'Advanced' },
              { id: 'q6', title: 'CNN Quiz', score: 82, userLevel: 'Advanced' }
            ]
          },
          {
            id: '4',
            title: 'Natural Language Processing',
            description: 'Understanding human language with AI',
            level: 'Intermediate',
            createdByAI: true,
            contents: [],
            quizzes: [
              { id: 'q7', title: 'NLP Basics Quiz', score: 89, userLevel: 'Intermediate' },
              { id: 'q8', title: 'Transformers Quiz', score: 84, userLevel: 'Intermediate' }
            ]
          },
          {
            id: '5',
            title: 'Computer Vision',
            description: 'AI for image recognition',
            level: 'Advanced',
            createdByAI: true,
            contents: [],
            quizzes: [
              { id: 'q9', title: 'CV Basics Quiz', score: 81, userLevel: 'Advanced' },
              { id: 'q10', title: 'Object Detection Quiz', score: 79, userLevel: 'Advanced' }
            ]
          }
        ];

        const mockQuizzes = mockCourses.flatMap(course => course.quizzes);

        setCourses(mockCourses);
        setQuizzes(mockQuizzes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    getanalysis();

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-gray-300">Loading dashboard data...</div>;
  }

  // Calculate statistics
  const totalCourses = courses.length;
  const totalQuizzes = quizzes.length;
  const averageQuizScore = quizzes.reduce((sum, quiz) => sum + quiz.score, 0) / totalQuizzes;
  const aiGeneratedCourses = courses.filter(course => course.createdByAI).length;

  // Group quizzes by course
  const quizzesByCourse = courses.map(course => ({
    courseTitle: course.title,
    quizCount: course.quizzes.length,
    averageScore: course.quizzes.reduce((sum, quiz) => sum + quiz.score, 0) / course.quizzes.length
  }));

  // Group quizzes by level
  const quizzesByLevel = {};
  quizzes.forEach(quiz => {
    if (!quizzesByLevel[quiz.userLevel]) {
      quizzesByLevel[quiz.userLevel] = { count: 0, totalScore: 0 };
    }
    quizzesByLevel[quiz.userLevel].count++;
    quizzesByLevel[quiz.userLevel].totalScore += quiz.score;
  });

  const levelData = Object.keys(quizzesByLevel).map(level => ({
    level,
    count: quizzesByLevel[level].count,
    averageScore: quizzesByLevel[level].totalScore / quizzesByLevel[level].count
  }));

  // Score distribution data
  const scoreRanges = [
    { range: '90-100%', min: 90, max: 100, color: 'rgba(34, 197, 94, 0.7)' },
    { range: '80-89%', min: 80, max: 89, color: 'rgba(59, 130, 246, 0.7)' },
    { range: '70-79%', min: 70, max: 79, color: 'rgba(245, 158, 11, 0.7)' },
    { range: '60-69%', min: 60, max: 69, color: 'rgba(239, 68, 68, 0.7)' }
  ];

  const scoreDistribution = scoreRanges.map(range => ({
    ...range,
    count: quizzes.filter(quiz => quiz.score >= range.min && quiz.score <= range.max).length
  }));

  // Chart options for dark mode
  const chartOptions = {
    // responsive: true,
    // maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#E5E7EB'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#E5E7EB'
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.1)'
        },
        title: {
          display: true,
          text: 'Courses/Quizzes',
          color: '#E5E7EB'
        },
        stacked: true,
        

      },
      y: {
        ticks: {
          color: '#E5E7EB'
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.1)'
        }
      }
    }
  };

  // Chart data configurations with dark mode colors
  const scoreDistributionData = {
    labels: scoreDistribution.map(item => item.range),
    datasets: [
      {
        label: 'Number of Quizzes',
        data: scoreDistribution.map(item => item.count),
        backgroundColor: scoreDistribution.map(item => item.color),
        borderColor: scoreDistribution.map(item => item.color.replace('0.7', '1')),
        borderWidth: 2
      }
    ]
  };

  const quizzesPerCourseData = {
    labels: quizzesByCourse.map(item => item.courseTitle),
    datasets: [
      {
        label: 'Number of Quizzes',
        data: quizzesByCourse.map(item => item.quizCount),
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1
      }
    ]
  };

  const averageScoresData = {
    labels: quizzesByCourse.map(item => item.courseTitle),
    datasets: [
      {
        label: 'Average Quiz Score',
        data: quizzesByCourse.map(item => item.averageScore),
        backgroundColor: 'rgba(139, 92, 246, 0.7)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1
      }
    ]
  };

  const levelPerformanceData = {
    labels: levelData.map(item => item.level),
    datasets: [
      {
        label: 'Average Score by Level',
        data: levelData.map(item => item.averageScore),
        backgroundColor: 'rgba(245, 158, 11, 0.7)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 1,
        tension: 0.1
      }
    ]
  };

  return (
    <div className="min-h-screen w-full bg-transparent text-gray-100 container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-400">AI Learning Platform Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-300">Total Courses</h3>
          <p className="text-3xl font-bold text-blue-400">{totalCourses}</p>
          <p className="text-sm text-gray-400 mt-1">All AI-generated</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-300">Total Quizzes</h3>
          <p className="text-3xl font-bold text-green-400">{totalQuizzes}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-300">Average Quiz Score</h3>
          <p className="text-3xl font-bold text-purple-400">{averageQuizScore.toFixed(1)}%</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-gray-200">Quiz Score Distribution</h3>
          <div className="h-64">
            <Doughnut 
              data={scoreDistributionData} 
              options={{
                ...chartOptions,
                scales: undefined,
                plugins: {
                  legend: {
                    labels: {
                      color: '#E5E7EB'
                    },
                    position: 'bottom'
                  }
                }
              }} 
            />
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-gray-200">Quizzes per Course</h3>
          <div className="h-64">
            <Bar data={quizzesPerCourseData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-gray-200">Average Quiz Scores by Course</h3>
          <div className="h-64">
            <Bar data={averageScoresData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-gray-200">Performance by Difficulty Level</h3>
          <div className="h-64">
            <Line data={levelPerformanceData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Courses Table */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-200">AI-Generated Courses</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Quizzes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Avg Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {courses.map(course => {
                const avgScore = course.quizzes.reduce((sum, quiz) => sum + quiz.score, 0) / course.quizzes.length;
                return (
                  <tr key={course.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-300">{course.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{course.level}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{course.quizzes.length}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{(avgScore ?? 0).toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Performing Quizzes */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-gray-200">Top Performing Quizzes</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {[...quizzes]
                .sort((a, b) => b.score - a.score)
                .slice(0, 5)
                .map(quiz => {
                  const course = courses.find(c => c.quizzes.some(q => q.id === quiz.id));
                  return (
                    <tr key={quiz.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-300">{quiz.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{course?.title || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{quiz.userLevel}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{quiz.score}%</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Insights;