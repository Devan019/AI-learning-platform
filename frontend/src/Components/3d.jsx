import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudent } from '../store/StudentSlice/getStudentSlice';
import { fetchUser } from '../store/UserStore/setUserSlice';

// Enhanced AICore component with darker aesthetics
const AICore = ({ activeSector }) => {
  const meshRef = useRef();
  const particlesRef = useRef();

  // More particles for a richer visual effect
  const particleCount = 1500;
  const particles = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const radius = Math.random() * 3.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;

    particles[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    particles[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    particles[i * 3 + 2] = radius * Math.cos(phi);

    // Darker color palette with occasional bright particles
    const brightness = Math.random() < 0.2 ? 0.7 + Math.random() * 0.3 : 0.1 + Math.random() * 0.3;
    colors[i * 3] = brightness * 0.8;
    colors[i * 3 + 1] = brightness;
    colors[i * 3 + 2] = brightness * 1.2;
  }

  useFrame(({ clock }) => {
    // More subtle pulsing animation
    const scale = 1 + Math.sin(clock.getElapsedTime() * 0.8) * 0.05;
    meshRef.current.scale.set(scale, scale, scale);

    // Smoother rotation for particles
    if (particlesRef.current) {
      particlesRef.current.rotation.x += 0.0005;
      particlesRef.current.rotation.y += 0.0008;
    }
  });

  return (
    <group>
      {/* Darker central sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.8, 64, 64]} />
        <meshPhongMaterial
          color={0x111111}
          emissive={activeSector?.color || 0x222233}
          emissiveIntensity={0.4}
          specular={0x111111}
          shininess={90}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Particle cloud around sphere */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={particles}
            itemSize={3}
            count={particleCount}
          />
          <bufferAttribute
            attach="attributes-color"
            array={colors}
            itemSize={3}
            count={particleCount}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation={true}
        />
      </points>
    </group>
  );
};

// Improved sector node visuals
const ImpactNode = ({ position, color, name, isActive, onClick }) => {
  const meshRef = useRef();
  const glowRef = useRef();
  const groupRef = useRef();

  useFrame(({ clock }) => {
    // More subtle pulse for active nodes
    const pulse = isActive
      ? 1.1 + Math.sin(clock.getElapsedTime() * 2.5) * 0.15
      : 1 + Math.sin(clock.getElapsedTime() * 2) * 0.08;

    meshRef.current.scale.set(pulse, pulse, pulse);

    // Add glow pulsing effect
    if (glowRef.current) {
      const glowPulse = isActive
        ? 1.2 + Math.sin(clock.getElapsedTime() * 3) * 0.2
        : 1.1 + Math.sin(clock.getElapsedTime() * 2) * 0.1;
      glowRef.current.scale.set(glowPulse, glowPulse, glowPulse);
    }

    // Subtle orbital movement
    if (groupRef.current) {
      groupRef.current.rotation.y += isActive ? 0.001 : 0.0005;
    }
  });

  // Convert hex color to values for customization
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 0, g: 0, b: 0 };
  };

  const rgb = hexToRgb(color);

  return (
    <group ref={groupRef} position={position} onClick={onClick}>
      {/* Dark core sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshPhongMaterial
          color={0x111111}
          emissive={color}
          emissiveIntensity={isActive ? 0.6 : 0.3}
          shininess={90}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Outer glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshPhongMaterial
          color={color}
          transparent
          opacity={0.1}
          shininess={0}
        />
      </mesh>

      {/* Connection line with fading effect */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([0, 0, 0, ...position.clone().normalize().multiplyScalar(position.length() * 0.2).toArray()])}
            itemSize={3}
            count={2}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={isActive ? 0.8 : 0.4}
          linewidth={2}
        />
      </line>

      {/* Improved text label - removed custom font that was causing the error */}
      <Text
        position={position.clone().normalize().multiplyScalar(position.length() * 1.3)}
        color="white"
        fontSize={isActive ? 0.6 : 0.5}
        anchorX="center"
        anchorY="middle"
        outlineColor={color}
        outlineWidth={0.02}
        outlineOpacity={0.7}
      >
        {name}
      </Text>
    </group>
  );
};

// Enhanced lighting for darker aesthetics
const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.2} color={0x222222} />
      <directionalLight
        position={[5, 3, 2]}
        intensity={0.7}
        color={0x404060}
        castShadow
      />
      <pointLight
        position={[0, 0, 0]}
        color={0x2233aa}
        intensity={2}
        distance={20}
        decay={2}
      />
      <pointLight
        position={[0, 5, 3]}
        color={0x2222aa}
        intensity={1}
        distance={15}
        decay={2}
      />
    </>
  );
};

// Improved camera controls with zoom limitations
const CustomOrbitControls = ({ autoRotateSpeed = 0.3 }) => {
  const controlsRef = useRef();
  const [userInteracting, setUserInteracting] = useState(false);
  const [lastInteractionTime, setLastInteractionTime] = useState(0);

  useFrame(() => {
    if (controlsRef.current) {
      const now = Date.now();

      // Resume auto-rotation after 6 seconds of inactivity
      if (!userInteracting && now - lastInteractionTime > 6000) {
        controlsRef.current.autoRotate = true;
        controlsRef.current.autoRotateSpeed = autoRotateSpeed;
      } else {
        controlsRef.current.autoRotate = false;
      }

      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.07}
      maxDistance={18} // Limit zoom out
      minDistance={8}  // Limit zoom in
      maxPolarAngle={Math.PI * 0.8} // Limit vertical rotation
      minPolarAngle={Math.PI * 0.2}
      enableZoom={false} // Disable zoom as requested
      rotateSpeed={0.5} // Slower rotation for better control
      onStart={() => {
        setUserInteracting(true);
        setLastInteractionTime(Date.now());
      }}
      onEnd={() => {
        setUserInteracting(false);
      }}
    />
  );
};

// Updated sector description component
const SectorDescription = ({ sector, isActive }) => {
  return (
    <motion.div
      className="absolute left-0 right-0 mx-auto w-full max-w-2xl px-6 bottom-12"
      initial={{ opacity: 0, y: 30 }}
      animate={{
        opacity: isActive ? 1 : 0,
        y: isActive ? 0 : 30
      }}
      transition={{ duration: 0.5 }}
      style={{
        pointerEvents: isActive ? 'auto' : 'none'
      }}
    >
      <div className="bg-black/80 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-lg">
        <h2
          className="text-2xl font-bold mb-3"
          style={{ color: sector.color }}
        >
          {sector.name}
        </h2>
        <p className="text-base text-white/70 mb-3 leading-relaxed">
          {sector.description}
        </p>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-white/80">Key Technologies:</h3>
          <div className="flex flex-wrap gap-2">
            {sector.technologies.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: `${sector.color}15`,
                  color: sector.color,
                  border: `1px solid ${sector.color}40`
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main component
const TechSectorSphere = () => {
  const containerRef = useRef();
  const [activeSector, setActiveSector] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const dispatch = useDispatch();

  useEffect(()=>{
    if(localStorage.getItem("HomeRefresh")){
      localStorage.removeItem("HomeRefresh")
      location.reload();
    }

    dispatch(fetchUser())
    
  },[])



  // Modified sectors with darker colors and sexy visual appeal
  const sectors = [
    {
      name: "AI-Generated Trusted Courses",
      position: [6, 3, 0],
      color: "#ff3344",
      description: "Our AI curates high-quality, trusted courses tailored to your learning needs. With AI-driven content selection, you get the best learning materials without the hassle of searching through countless resources.",
      technologies: ["AI Curation", "Personalized Learning", "Course Recommendations", "Adaptive AI", "Smart Syllabi"]
    },
    {
      name: "AI Chatbot for Query Resolution",
      position: [-5, 4, -4],
      color: "#22cc66",
      description: "Get instant solutions to your doubts with our intelligent chatbot. Whether it's a coding issue or a theoretical concept, AI-powered assistance ensures you're never stuck while learning.",
      technologies: ["NLP", "Conversational AI", "Chatbots", "AI Tutors", "Instant Query Resolution"]
    },
    {
      name: "Create and Manage Your Profile",
      position: [0, -6, 5],
      color: "#3388ff",
      description: "Keep track of your learning journey by creating a personalized profile. Monitor your progress, save courses, and build a portfolio of your achievements with AI-driven insights.",
      technologies: ["User Profiles", "Progress Tracking", "Portfolio Management", "Gamification", "AI Analytics"]
    },
    {
      name: "AI-Generated Roadmaps",
      position: [-4, -3, -6],
      color: "#ddcc22",
      description: "AI designs dynamic learning paths based on your skills, goals, and progress. Get step-by-step guidance with adaptive roadmaps that evolve as you learn.",
      technologies: ["AI Roadmaps", "Skill Graphs", "Personalized Learning Paths", "Goal-Oriented Learning", "Adaptive AI"]
    },
    {
      name: "AI-Driven Quizzes with Reinforcement Learning",
      position: [5, -4, -3],
      color: "#cc44cc",
      description: "Challenge yourself with dynamically adjusting quizzes. If you answer correctly, the next question becomes harder. If you answer incorrectly, the next question adapts to reinforce your learning.",
      technologies: ["Reinforcement Learning", "AI Adaptive Testing", "Dynamic Difficulty", "Smart Assessments", "Gamified Learning"]
    },
    // { 
    //   name: "Track Your Learning Journey", 
    //   position: [-3, 6, 4], 
    //   color: "#00aa88",
    //   description: "Monitor your progress with AI-powered tracking. Visualize milestones, achievements, and skill growth over time, ensuring you stay on the right path.",
    //   technologies: ["Learning Analytics", "Milestone Tracking", "AI Insights", "User Dashboard", "Performance Metrics"]
    // }
  ];


  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      setScrollProgress(progress);

      // Determine active sector based on scroll progress
      const sectorIndex = Math.floor(progress * sectors.length);
      if (sectorIndex < sectors.length) {
        setActiveSector(sectors[sectorIndex]);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  const canvasOpacity = useTransform(
    scrollYProgress,
    [0, 0.95, 1],
    [1, 1, 0]
  );

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full h-[500vh] bg-black overflow-hidden"
    >
      {/* Fixed canvas with full-screen dark background */}
      <motion.div
        className="fixed top-0 left-0 w-full h-screen"
        style={{ opacity: canvasOpacity }}
      >
        <Canvas
          camera={{ position: [0, 0, 16], fov: 60 }}
          className="absolute inset-0"
          gl={{ antialias: true, alpha: false }}
          linear
        >
          {/* Enhanced starfield */}
          <Stars
            radius={100}
            depth={70}
            count={7000}
            factor={5}
            saturation={0}
            fade
            speed={0.3}
          />

          <CustomOrbitControls />
          <Lights />
          <AICore activeSector={activeSector} />

          {sectors.map((sector, index) => (
            <ImpactNode
              key={index}
              position={new THREE.Vector3(...sector.position)}
              color={sector.color}
              name={sector.name.split(" ")[0]}
              isActive={activeSector?.name === sector.name}
              onClick={() => setActiveSector(sector)}
            />
          ))}
        </Canvas>

        {/* Improved title overlay */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: activeSector ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          className="absolute top-30 left-0 right-0 text-center"
        >
          <h1 className="text-5xl font-bold text-white/95 tracking-tight">
            AI-Powered Learning Hub
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg text-white/75 mt-3"
          >
            Unlock knowledge with AI-driven courses, adaptive quizzes, and smart roadmaps.
          </motion.p>

        </motion.div>

        {/* Active sector info */}
        {activeSector && (
          <SectorDescription
            sector={activeSector}
            isActive={true}
          />
        )}
      </motion.div>

      {/* Scrollable content for navigation only */}
      <div className="absolute top-[100vh] w-full">
        {sectors.map((sector, index) => (
          <section
            key={index}
            className="h-screen w-full"
          />
        ))}
      </div>

      {/* Improved scroll indicator */}
      <motion.div
        className="fixed bottom-8 left-0 right-0 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: activeSector ? 0 : 0.8 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-white/80 flex flex-col items-center">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 5v14M19 12l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
          <span className="mt-2 text-sm font-medium">Scroll to explore</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TechSectorSphere;