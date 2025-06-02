import { useState, useRef } from "react";
import roadmaps from "../data/roadmap.data.json";
import { Navbar } from "../Components/Nav";
import { motion, AnimatePresence } from "framer-motion";
import { forwardRef } from "react";
import { TracingBeam } from "../Components/ui/trace";


const Roadmap = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const roadmapRefs = useRef([]);

  const handleToggle = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);

      setTimeout(() => {
        const element = roadmapRefs.current[index];

        if (element) {
          const rect = element.getBoundingClientRect()
          console.log(element.offsetTop, rect.x, rect.y, rect.height, rect.top, rect.bottom);

          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          setTimeout(() => {
            console.log("Scrolling Back ⬆️");
            window.scrollBy({
              top: -element.offsetTop - rect.height, // Adjust this value as needed
              behavior: "smooth",
            });
          }, 100);
        } else {
          console.log("❌ Element Not Found: ", index, roadmapRefs.current);
        }
      }, 150);
    }
  };

  return (
    <div className="bg-black min-h-screen text-gray-200">
      <Navbar />
      <div className="mt-16 max-w-5xl mx-auto p-8">
        <h1 className="text-5xl font-extrabold mb-8 text-center text-white">
          🚀 IT Roadmaps
        </h1>
        <motion.div className="space-y-6">
          {roadmaps.roadmaps.map((roadmap, index) => (
            <RoadmapItem
              key={index}
              roadmap={roadmap}
              isOpen={openIndex === index}
              setOpen={() => handleToggle(index)}
              ref={(el) => {
                if (el) {
                  roadmapRefs.current[index] = el;
                  // Debugging
                }
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const RoadmapItem = forwardRef(({ roadmap, isOpen, setOpen }, ref) => {
  const [showImage, setShowImage] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    console.log(e.clientX , e.clientY)
    setMousePos({
      x: e.clientX - window.innerWidth/2 + 250 ,
      y: -50,
    });
  };


  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="relative border border-gray-700 rounded-lg shadow-lg  hover:shadow-2xl"
    >
      {/* Toggle Button */}
      <button
        onClick={setOpen}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setShowImage(true)}
        onMouseLeave={() => setShowImage(false)}
        className="w-full p-5 text-left flex justify-between items-center bg-gradient-to-r font-semibold text-gray-100 transition-all duration-300 relative"
      >
        <span className="text-lg relative">{roadmap.title}</span>

        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-xl"
        >
          ▼
        </motion.span>
      </button>

      {/* Hover Image */}
      <AnimatePresence>
        {showImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              left: mousePos.x,
              top: mousePos.y,
              zIndex: 50, // Ensure it appears above other elements
              pointerEvents: "none",
            }}
            className="w-52 h-36 bg-gray-700 shadow-lg rounded-lg overflow-hidden"
          >
            <img
              src={roadmap.image}
              alt={roadmap.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expandable Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="p-5 bg-gray-800"
          >
            <p className="text-gray-400 mb-3">{roadmap.description}</p>
            <h3 className="font-semibold text-gray-200 mb-2">📌 Modules:</h3>
            <ul className="list-disc list-inside space-y-10">
              <TracingBeam>
                {roadmap.steps.map((step, idx) => (
                  <li key={idx} className="flex flex-col space-y-4">
                    <div className="max-w-2xl mx-auto antialiased pt-4 relative">
                      <div className="flex items-start space-x-3">
                        <div>
                          <strong className="text-gray-100 text-lg">
                            {step.name}
                          </strong>
                          <p className="text-sm text-gray-400 mt-1">
                            {step.details}
                          </p>
                          <p className="text-gray-300 text-sm mt-2">
                            Topics: {step.topics.join(", ")}
                          </p>
                        </div>
                      </div>
                      {step.substeps.length > 0 && (
                        <ul className="list-disc list-inside pl-10 space-y-2 text-gray-400">
                          {step.substeps.map((substep, subIdx) => (
                            <li key={subIdx} className="text-sm">{substep}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                ))}
              </TracingBeam>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default Roadmap;