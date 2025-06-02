import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../Components/Nav";
import { useSelector } from "react-redux";


const ProfilePage = () => {
  const navigate = useNavigate();
  const { student } = useSelector((state) => state.getStudent);
  const {id} = useSelector((state) => state.getUser)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    degreeProgram: "",
    mainInterest: "",
    university: "",
    technicalSkills: [],
    domainExpertise: [],
    graduationYear: "",
    gpaScore: "",
    extracurricularActivities: "",
    researchInterests: "",
    careerGoals: "",
    phone: ""
  });

  // Get first letter for avatar

  const avatarLetter = student?.fullName[0].toUpperCase();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 120
      }
    }
  };

  const avatarVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 10
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.3 }
    }
  };


  const handleEditProfile = () => {
    navigate("/interest"); // Redirect to interest page
  };

  useEffect(() => {
    if (id && student) {
      console.log(student)
      setFormData(student)
    }
  }, [id, student])



  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <Navbar />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="h-[90vh] mt-18 flex items-center justify-center p-4"
      >
        <motion.div
          variants={cardVariants}
          className="w-full max-w-6xl h-full bg-zinc-800 rounded-2xl shadow-2xl overflow-hidden border border-zinc-700 flex flex-col md:flex-row"
        >
          {/* Left Side - Profile Content */}
          <motion.div
            variants={containerVariants}
            className="md:w-2/3 p-6 md:p-8 overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-8">
              <motion.div variants={itemVariants}>
                <h1 className="text-3xl font-bold text-white">
                  {formData?.fullName}
                </h1>
                <p className="text-lg text-indigo-400 mt-1">
                  {formData?.degreeProgram} Student
                </p>
              </motion.div>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(99, 102, 241, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEditProfile}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-lg"
              >
                Edit Profile
              </motion.button>
            </div>

            <motion.div
              variants={containerVariants}
              className="space-y-8"
            >
              {/* Basic Info */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Email", value: formData?.email },
                  { label: "Phone", value: formData?.phone },
                  { label: "University", value: formData?.university },
                  { label: "Graduation Year", value: formData?.graduationYear }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5 }}
                  >
                    <h3 className="text-sm font-medium text-zinc-400">{item.label}</h3>
                    <p className="mt-1 text-white">{item.value}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Skills & Expertise */}
              <motion.div variants={itemVariants}>
                <h2 className="text-xl font-semibold text-white mb-4">Skills & Expertise</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData?.technicalSkills.map((skill, index) => (
                    <motion.span
                      key={index}
                      variants={itemVariants}
                      whileHover={{ scale: 1.1, boxShadow: "0 0 10px rgba(79, 70, 229, 0.5)" }}
                      className="px-3 py-1 bg-zinc-700 text-indigo-300 rounded-full text-sm"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData?.domainExpertise.map((expertise, index) => (
                    <motion.span
                      key={index}
                      variants={itemVariants}
                      whileHover={{ scale: 1.1, boxShadow: "0 0 10px rgba(168, 85, 247, 0.5)" }}
                      className="px-3 py-1 bg-zinc-700 text-purple-300 rounded-full text-sm"
                    >
                      {expertise}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Interests & Goals */}
              <motion.div variants={itemVariants}>
                <h2 className="text-xl font-semibold text-white mb-4">Interests & Goals</h2>
                <div className="space-y-4">
                  {[
                    { label: "Main Interest", value: formData?.mainInterest },
                    { label: "Research Interests", value: formData?.researchInterests },
                    { label: "Career Goals", value: formData?.careerGoals }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 5 }}
                    >
                      <h3 className="text-sm font-medium text-zinc-400">{item.label}</h3>
                      <p className="mt-1 text-white">{item.value}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              
            </motion.div>
          </motion.div>

          {/* Right Side - Avatar */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="md:w-1/3 bg-gradient-to-b from-zinc-900 to-zinc-800 flex flex-col items-center justify-center p-8 border-t md:border-t-0 md:border-l border-zinc-700"
          >
            <motion.div
              variants={avatarVariants}
              whileHover="hover"
              className="w-40 h-40 rounded-full bg-zinc-700 flex items-center justify-center shadow-2xl mb-6 border-2 border-indigo-500 relative overflow-hidden"
            >
              <span className="text-6xl font-bold text-indigo-400 z-10">{avatarLetter}</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-2xl font-bold mb-2 text-white text-center"
            >
              {formData?.fullName}
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-zinc-400 mb-8 text-center"
            >
              {formData?.university}
            </motion.p>

            <motion.div
              variants={containerVariants}
              className="w-full space-y-6 px-4"
            >
              <motion.div variants={itemVariants}>
                <h3 className="text-sm font-medium text-zinc-400 mb-2">GPA Score</h3>
                <div className="relative">
                  <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(parseFloat(formData?.gpaScore) / 10.0 * 100)}%` }}
                      transition={{ delay: 0.8, duration: 1, type: "spring" }}
                    />
                  </div>
                  <motion.p
                    className="mt-2 text-xl font-semibold text-white text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    {formData?.gpaScore}/10.0
                  </motion.p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h3 className="text-sm font-medium text-zinc-400 mb-2">Extracurriculars</h3>
                <motion.p
                  className="text-zinc-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {formData?.extracurricularActivities}
                </motion.p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;