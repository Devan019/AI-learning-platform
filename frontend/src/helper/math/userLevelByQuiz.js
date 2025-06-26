/**
 * Calculates user's skill level based on their quiz performance
 * @param {Array} levels - Array of objects containing { level, isCorrect }
 * @returns {string} - Final calculated user level
 */
export function getUserLevel(levels) {
  // Level definitions with weights and thresholds
  const LEVELS = {
    Beginner: {
      weight: 1,
      threshold: 1,    // Need at least 1 correct at this level
      nextThreshold: 3 // Need this many correct to consider next level
    },
    Intermediate: {
      weight: 2,
      threshold: 2,
      nextThreshold: 3
    },
    Advanced: {
      weight: 3,
      threshold: 2,
      nextThreshold: 2
    },
    Expert: {
      weight: 4,
      threshold: 1,
      nextThreshold: 0 // No higher level beyond expert
    }
  };

  // Normalize level names (fix casing/spelling)
  const normalizeLevel = (level) => {
    const lowerLevel = level.toLowerCase();
    for (const validLevel in LEVELS) {
      if (validLevel.toLowerCase() === lowerLevel) {
        return validLevel;
      }
    }
    return level; // Return original if no match
  };

  // Count correct answers by level
  const levelStats = {};
  for (const validLevel in LEVELS) {
    levelStats[validLevel] = {
      correct: 0,
      total: 0
    };
  }

  // Process each answer
  levels.forEach(({ level, isCorrect }) => {
    const normalized = normalizeLevel(level);
    if (LEVELS[normalized]) {
      levelStats[normalized].total++;
      if (isCorrect) {
        levelStats[normalized].correct++;
      }
    }
  });

  // Calculate weighted scores and mastery
  let weightedScore = 0;
  let totalPossible = 0;
  const mastery = {};

  for (const level in LEVELS) {
    const { weight } = LEVELS[level];
    const correct = levelStats[level].correct;
    
    // Add to weighted score
    weightedScore += correct * weight;
    totalPossible += levelStats[level].total * weight;
    
    // Calculate mastery percentage
    mastery[level] = levelStats[level].total > 0 
      ? (levelStats[level].correct / levelStats[level].total) * 100 
      : 0;
  }

  // Determine level based on multiple factors
  let finalLevel = 'Beginner'; // Default
  
  // Check from highest to lowest level
  const levelOrder = ['Expert', 'Advanced', 'Intermediate', 'Beginner'];
  for (const level of levelOrder) {
    const stats = levelStats[level];
    const levelDef = LEVELS[level];
    
    // Check if user meets threshold for this level
    if (stats.correct >= levelDef.threshold) {
      // Check if mastery is sufficient (at least 50% correct)
      if (mastery[level] >= 50) {
        finalLevel = level;
        
        // Check if user qualifies for higher level
        if (levelDef.nextThreshold > 0 && stats.correct >= levelDef.nextThreshold) {
          // See if there's a higher level they might qualify for
          const higherLevels = levelOrder.slice(0, levelOrder.indexOf(level));
          for (const higherLevel of higherLevels) {
            if (levelStats[higherLevel].correct >= LEVELS[higherLevel].threshold) {
              finalLevel = higherLevel;
              break;
            }
          }
        }
        break;
      }
    }
  }

  // Special case: If user got all answers correct at their level
  // and some at higher levels, bump them up
  if (mastery[finalLevel] === 100) {
    const higherLevels = levelOrder.slice(0, levelOrder.indexOf(finalLevel));
    for (const higherLevel of higherLevels) {
      if (levelStats[higherLevel].correct > 0) {
        finalLevel = higherLevel;
        break;
      }
    }
  }

  // Calculate overall accuracy percentage
  const totalCorrect = Object.values(levelStats).reduce((sum, { correct }) => sum + correct, 0);
  const totalQuestions = levels.length;
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  return finalLevel;
}