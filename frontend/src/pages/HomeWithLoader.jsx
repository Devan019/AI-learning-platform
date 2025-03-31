import { useState, useEffect } from 'react';
import AILoader from "../Components/AILoader"
import Home from './Home';
import AI3D from './HomeUse3d';

const AppLoader = () => {
  const [showLoader, setShowLoader] = useState(true);

  // Optional: Load for minimum time even if animation finishes early
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 10000); // Matches loader duration (9 languages × 600ms + buffer)

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showLoader ? (
        <AILoader />
      ) : (
        < AI3D/>
      )}
    </>
  );
};

export default AppLoader;