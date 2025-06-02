import React, { useState, useEffect } from 'react';

export default function Alert({ message, type, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  const alertClasses = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
  };

  const animationClasses = isVisible
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 -translate-y-4';

  return (
    <div
      className={`transition-opacity duration-300 ease-in-out transform ${animationClasses} ${
        alertClasses[type] || alertClasses.info
      } border rounded-md p-4 mb-4 absolute top-0 left-0 w-screen z-[99]`}
      role="alert"
    >
      <strong className="font-bold">{type.toUpperCase()}:</strong>
      <span className="ml-2">{message}</span>
    </div>
  );
}