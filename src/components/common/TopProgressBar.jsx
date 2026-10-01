import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

// Global Event Emitter for Instant YouTube-style Progress Bar
const listeners = new Set();

export const startNavigationProgress = () => {
  listeners.forEach((fn) => fn('start'));
};

export const finishNavigationProgress = () => {
  listeners.forEach((fn) => fn('finish'));
};

/**
 * YouTube / GitHub style top progress bar that animates from left to right
 * on route transitions and settles smoothly with a glowing neon trailing edge.
 */
export const TopProgressBar = () => {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const timeoutsRef = useRef([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  const startProgress = () => {
    clearAllTimeouts();
    setVisible(true);
    setOpacity(1);
    setProgress(28);

    const t1 = setTimeout(() => {
      setProgress(58);
    }, 80);

    const t2 = setTimeout(() => {
      setProgress(84);
    }, 180);

    timeoutsRef.current = [t1, t2];
  };

  const completeProgress = () => {
    clearAllTimeouts();
    setVisible(true);
    setOpacity(1);
    setProgress(100);

    const t1 = setTimeout(() => {
      setOpacity(0);
    }, 280);

    const t2 = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 480);

    timeoutsRef.current = [t1, t2];
  };

  // Listen to manual triggers (e.g. on sidebar click before React commit)
  useEffect(() => {
    const handler = (type) => {
      if (type === 'start') {
        startProgress();
      } else if (type === 'finish') {
        completeProgress();
      }
    };

    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  // On location path/query change, complete progress smoothly
  useEffect(() => {
    completeProgress();
  }, [location.pathname, location.search]);

  if (!visible) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        zIndex: 999999,
        pointerEvents: 'none',
        opacity: opacity,
        transition: 'opacity 0.2s ease-out',
      }}
    >
      {/* Dynamic Animated Bar */}
      <Box
        sx={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #1d4ed8 0%, #2563eb 50%, #60a5fa 100%)',
          boxShadow: '0 0 12px rgba(37, 99, 235, 0.9), 0 0 5px #2563eb',
          borderRadius: '0 2px 2px 0',
          transition: progress === 0
            ? 'none'
            : progress === 100
            ? 'width 0.15s ease-out'
            : 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
        }}
      >
        {/* Leading glowing peg (like YouTube / GitHub) */}
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            height: '100%',
            width: 90,
            boxShadow: '0 0 16px #3b82f6, 0 0 8px #60a5fa',
            opacity: 1,
            transform: 'rotate(2deg) translate(0px, -2px)',
          }}
        />
      </Box>
    </Box>
  );
};

export default TopProgressBar;
