/**
 * =============================================================================
 *  Interactive Video Lesson Player
 * =============================================================================
 *
 *  • Description:
 *    A fully-featured, interactive video lesson player component with touch
 *    and keyboard controls—ideal for e-learning platforms and online course UIs.
 *
 *  • Technologies:
 *    - React (Next.js App Router, "use client")
 *    - Framer Motion (animations)
 *    - Tailwind CSS (responsive, modern styling)
 *    - React Icons & custom SVGs
 *
 *  • Key Features:
 *    - Play / Pause, 10s rewind / forward  
 *    - Fullscreen & Picture-in-Picture modes  
 *    - Brightness & volume control via drag & touch gestures  
 *    - Touch gestures: swipe navigation, pinch-to-zoom whiteboard  
 *    - Keyboard shortcuts (Space, ←/→, M, F, 0–9, Shift+N/P, K)  
 *    - Transcript panel & integrated whiteboard notes  
 *    - Completion animations with particle effects  
 *    - UI flourishes: glassmorphism cards, gradient text, smooth transitions
 *
 *  • Usage:
 *    import VideoLessonPlayer from './VideoLessonPlayer';
 *    …
 *    <VideoLessonPlayer />
 *
 * =============================================================================
 */

"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FaAdjust,
  FaArrowsAlt,
  FaBookOpen,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaCog,
  FaCompress,
  FaExpand,
  FaFileAlt,
  FaGraduationCap,
  FaImage,
  FaKeyboard,
  FaLightbulb,
  FaMagic,
  FaMusic,
  FaPause,
  FaPlay,
  FaSpinner,
  FaStepBackward,
  FaStepForward,
  FaSun,
  FaTimes,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";
import { MdPictureInPictureAlt } from "react-icons/md";

// --- Global CSS Styles ---
const globalStyles = `
  @import url('https://cdn.jsdelivr.net/npm/tailwindcss@3.3.0/dist/tailwind.min.css');

  #root, .App, .video-container {
    width: 100%;
    box-sizing: border-box;
  }

  /* Custom font families */
  .font-plus-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
  .font-inter { font-family: 'Inter', sans-serif; }

  /* High contrast mode */
  .high-contrast {
    filter: contrast(1.2);
  }

  :fullscreen {
    max-width: none !important;
    width: 100% !important;
    height: 100% !important;
  }

  .high-contrast * {
    border-color: currentColor !important;
  }

  /* Mobile-optimized scrollbar */
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }

  /* Mobile-specific optimizations */
  @media (max-width: 768px) {
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    
    .custom-scrollbar {
      -webkit-overflow-scrolling: touch;
      scroll-behavior: auto;
    }
  }

  /* Enhanced Video progress bar and volume slider */
  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
    outline: none;
  }

  input[type="range"]::-webkit-slider-track {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    cursor: pointer;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  input[type="range"]::-moz-range-track {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    border: none;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%);
    cursor: pointer;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(255, 255, 255, 0.9);
    margin-top: -2px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 2px solid rgba(255, 255, 255, 0.8);
  }

  input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.3);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), 0 0 0 3px rgba(255, 255, 255, 0.9), 0 0 30px rgba(20, 184, 166, 0.6);
    background: linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%);
  }

  input[type="range"]::-webkit-slider-thumb:active {
    transform: scale(1.1);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.5), 0 0 0 3px rgba(255, 255, 255, 0.9);
  }

  input[type="range"]::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%);
    cursor: pointer;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(255, 255, 255, 0.9);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  input[type="range"]::-moz-range-thumb:hover {
    transform: scale(1.3);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), 0 0 0 3px rgba(255, 255, 255, 0.9), 0 0 30px rgba(20, 184, 166, 0.6);
    background: linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%);
  }

  input[type="range"]::-moz-range-thumb:active {
    transform: scale(1.1);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.5), 0 0 0 3px rgba(255, 255, 255, 0.9);
  }

  /* Modern Volume slider with high contrast */
  .volume-slider {
    position: relative;
    background: linear-gradient(to right, 
      rgba(255, 255, 255, 0.95) 0%, 
      rgba(255, 255, 255, 0.95) var(--volume-percent, 50%), 
      rgba(255, 255, 255, 0.15) var(--volume-percent, 50%), 
      rgba(255, 255, 255, 0.15) 100%);
    border-radius: 8px;
    box-shadow: 
      inset 0 2px 4px rgba(0, 0, 0, 0.3),
      0 1px 3px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .volume-slider::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 255, 255, 0.2) 50%, 
      transparent 100%);
    border-radius: 8px;
    pointer-events: none;
  }

  .volume-slider::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, 
      rgba(255, 255, 255, 0.1) 0%, 
      transparent 50%, 
      rgba(0, 0, 0, 0.1) 100%);
    border-radius: 8px;
    pointer-events: none;
  }

  /* Modern volume thumb with high contrast */
  .volume-slider::-webkit-slider-thumb {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important;
    border: 2px solid rgba(255, 255, 255, 0.9) !important;
    box-shadow: 
      0 4px 12px rgba(0, 0, 0, 0.4),
      0 2px 4px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(0, 0, 0, 0.1),
      inset 0 1px 2px rgba(255, 255, 255, 0.8) !important;
  }

  .volume-slider::-webkit-slider-thumb:hover {
    background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%) !important;
    box-shadow: 
      0 6px 20px rgba(0, 0, 0, 0.5),
      0 3px 8px rgba(0, 0, 0, 0.3),
      0 0 0 2px rgba(255, 255, 255, 0.9),
      inset 0 1px 3px rgba(255, 255, 255, 0.9) !important;
    transform: scale(1.4) !important;
  }

  .volume-slider::-moz-range-thumb {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important;
    border: 2px solid rgba(255, 255, 255, 0.9) !important;
    box-shadow: 
      0 4px 12px rgba(0, 0, 0, 0.4),
      0 2px 4px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(0, 0, 0, 0.1),
      inset 0 1px 2px rgba(255, 255, 255, 0.8) !important;
  }

  .volume-slider::-moz-range-thumb:hover {
    background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%) !important;
    box-shadow: 
      0 6px 20px rgba(0, 0, 0, 0.5),
      0 3px 8px rgba(0, 0, 0, 0.3),
      0 0 0 2px rgba(255, 255, 255, 0.9),
      inset 0 1px 3px rgba(255, 255, 255, 0.9) !important;
    transform: scale(1.4) !important;
  }

  /* Caption text shadow */
  .caption-text {
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.8), 0 0 8px rgba(0, 0, 0, 0.6);
  }

  /* Glassmorphism */
  .glass-effect {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .glass-dark {
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  /* Modern card styles */
  .modern-card {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 
                0 2px 8px rgba(0, 0, 0, 0.04),
                inset 0 0 0 1px rgba(255, 255, 255, 0.5);
  }

  .modern-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.12), 
                0 4px 12px rgba(0, 0, 0, 0.06),
                inset 0 0 0 1px rgba(255, 255, 255, 0.7);
  }

  /* Smooth transitions */
  .smooth-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Mobile performance optimizations */
  @media (max-width: 768px) {
    .smooth-transition {
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Reduce motion for better performance on mobile */
    .reduce-motion {
      transition: none !important;
      animation: none !important;
    }
    
    /* Optimize touch targets */
    .touch-target {
      min-height: 44px;
      min-width: 44px;
    }
  }

  /* Gradient text */
  .gradient-text {
    background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Animated gradient background */
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .animated-gradient {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #667eea 100%);
    background-size: 400% 400%;
    animation: gradient-shift 15s ease infinite;
  }

  /* Pulse animation */
  @keyframes pulse-ring {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }

  .pulse-ring {
    animation: pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  /* Swipe indicator */
  @keyframes swipe-hint {
    0%, 100% { transform: translateX(0); opacity: 0.5; }
    50% { transform: translateX(20px); opacity: 1; }
  }

  .swipe-hint {
    animation: swipe-hint 2s ease-in-out infinite;
  }

  /* Enhanced shadows */
  .shadow-glow {
    box-shadow: 0 0 40px rgba(20, 184, 166, 0.15),
                0 0 80px rgba(20, 184, 166, 0.1);
  }

  .shadow-glow-hover:hover {
    box-shadow: 0 0 60px rgba(20, 184, 166, 0.25),
                0 0 100px rgba(20, 184, 166, 0.15);
  }
`;

// --- SVG Icon Components ---
const GraduationCapIcon = ({
  className = "w-6 h-6",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L1 7l11 5 11-5-11-5zM1 7v10c0 5.55 3.84 10 11 10s11-4.45 11-10V7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StarIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const CelebrationIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5.85 2.72a.75.75 0 011.06 0l.707.707a.75.75 0 01-1.06 1.06l-.707-.707a.75.75 0 010-1.06zm12.3 0a.75.75 0 010 1.06l-.707.707a.75.75 0 01-1.06-1.06l.707-.707a.75.75 0 011.06 0zM8.35 8.35a.75.75 0 011.06 0l.707.707a.75.75 0 01-1.06 1.06l-.707-.707a.75.75 0 010-1.06zm7.3 0a.75.75 0 010 1.06l-.707.707a.75.75 0 01-1.06-1.06l.707-.707a.75.75 0 011.06 0zM3 12a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1A.75.75 0 013 12zm16.25-.75a.75.75 0 000 1.5h1a.75.75 0 000-1.5h-1zM8.35 15.65a.75.75 0 011.06 0l.707.707a.75.75 0 01-1.06 1.06l-.707-.707a.75.75 0 010-1.06zm7.3 0a.75.75 0 010 1.06l-.707.707a.75.75 0 01-1.06-1.06l.707-.707a.75.75 0 011.06 0zM5.85 21.28a.75.75 0 010-1.06l.707-.707a.75.75 0 111.06 1.06l-.707.707a.75.75 0 01-1.06 0zm12.3 0a.75.75 0 01-1.06 0l-.707-.707a.75.75 0 111.06-1.06l.707.707a.75.75 0 010 1.06z" />
  </svg>
);

// --- Font Preloading ---
const fontLinks = (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
      rel="preconnect"
      href="https://fonts.gstatic.com"
      crossOrigin="anonymous"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
      as="style"
    />
  </>
);

// --- Custom SVG Background Pattern ---
const BackgroundPattern = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-10 sm:opacity-5 md:opacity-[0.03]"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <pattern
        id="pattern"
        x="0"
        y="0"
        width="100"
        height="100"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="50" cy="50" r="1" fill="currentColor" />
        <circle
          cx="50"
          cy="50"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.5"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.3"
          opacity="0.3"
        />
        <path
          d="M50 30 L70 50 L50 70 L30 50 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.4"
        />
        <path
          d="M50 10 L90 50 L50 90 L10 50 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.3"
          opacity="0.2"
        />
      </pattern>
      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.1" />
        <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.05" />
        <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    <rect
      width="100%"
      height="100%"
      fill="url(#pattern)"
      className="text-teal-600"
    />
    <rect width="100%" height="100%" fill="url(#bgGradient)" />
  </svg>
);

interface PinchTarget extends EventTarget {
  _initialPinchData?: {
    distance: number;
    zoom: number;
  };
}

// --- Ripple Effect Component ---
interface RippleProps {
  x: number;
  y: number;
  onComplete: () => void;
  buttonId: string;
}

const Ripple: React.FC<RippleProps> = ({ x, y, onComplete }) => {
  return (
    <motion.span
      className="absolute bg-white/30 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
      style={{ left: x, top: y }}
      initial={{ width: 0, height: 0, opacity: 0.5 }}
      animate={{ width: 60, height: 60, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onAnimationComplete={onComplete}
    >
      <motion.span
        className="hidden sm:block absolute bg-white/30 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{ left: 0, top: 0 }}
        initial={{ width: 0, height: 0, opacity: 0.5 }}
        animate={{ width: 100, height: 100, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </motion.span>
  );
};

// --- Animated Counter Component ---
interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  decimals = 0,
  suffix = "",
  className = "",
}) => {
  const spring = useSpring(value, { stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => {
    return `${current.toFixed(decimals)}${suffix}`;
  });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span className={className}>{display}</motion.span>;
};

// --- Particle Effect Component ---
interface ParticleProps {
  x: number;
  y: number;
  color: string;
}

const Particle: React.FC<ParticleProps> = ({ x, y, color }) => {
  const randomX = (Math.random() - 0.5) * 150; // Reduced from 200
  const randomY = Math.random() * -150 - 50; // Reduced from -200
  const randomRotate = Math.random() * 360;
  const randomScale = Math.random() * 0.5 + 0.5;

  return (
    <motion.div
      className="absolute w-2 h-2 pointer-events-none rounded-full"
      style={{
        left: x,
        top: y,
        backgroundColor: color,
        willChange: "transform",
      }}
      initial={{ opacity: 1, scale: 0 }}
      animate={{
        x: window.innerWidth < 640 ? randomX * 0.6 : randomX,
        y: window.innerWidth < 640 ? randomY * 0.6 : randomY,
        rotate: randomRotate,
        scale: window.innerWidth < 640 ? [0, randomScale * 0.7, 0] : [0, randomScale, 0],
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: 1.2,
        ease: "easeOut",
      }}
    />
  );
};

// --- Gesture Trail Component ---
interface TrailPoint {
  x: number;
  y: number;
  id: number;
}

const GestureTrail: React.FC<{ points: TrailPoint[] }> = ({ points }) => {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-50">
      <defs>
        <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(20, 184, 166, 0)" />
          <stop offset="100%" stopColor="rgba(20, 184, 166, 0.6)" />
        </linearGradient>
      </defs>
      {points.length > 1 && (
        <motion.path
          d={`M ${points.map((p) => `${p.x},${p.y}`).join(" L ")}`}
          fill="none"
          stroke="url(#trailGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </svg>
  );
};

// --- Skeleton Loader Component ---
const SkeletonLoader = ({ className = "" }) => (
  <div className={`animate-pulse ${className}`}>
    <div
      className="
        bg-gradient-to-r 
        from-gray-200/50 via-gray-300/50 to-gray-200/50 
        rounded-lg 
        h-4 sm:h-6 md:h-8 lg:h-10
      "
    />
  </div>
);

// --- Tooltip Component ---
interface TooltipProps {
  content: string;
  shortcut?: string;
  children: React.ReactElement;
  position?: "top" | "bottom" | "left" | "right";
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  shortcut,
  children,
  position = "top",
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return <>{children}</>;
  }

  const pos = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15 }}
          className={`absolute z-50 pointer-events-none max-w-xs ${pos[position]}`}
        >
          <div className="bg-gray-900 text-white text-xs rounded-md px-2 py-1 shadow-md whitespace-nowrap">
            <div>{content}</div>
            {shortcut && (
              <div className="text-gray-400 text-[10px] font-mono mt-1">
                {shortcut}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

// --- Interface Definitions ---
interface TranscriptItem {
  id: number;
  start: number;
  end: number;
  text: string;
}

interface Chapter {
  id: number;
  title: string;
  start: number;
  end: number;
}

interface Lesson {
  id: number;
  title: string;
  videoUrl: string;
  transcript: TranscriptItem[];
  chapters?: Chapter[];
  whiteboardNotes?: string;
  completed: boolean;
  thumbnailUrl?: string;
  captions?: { [key: string]: string };
}

const courseTitle = "The Ultimate React Masterclass";

// Mock lesson data with appropriate programming content
const mockLessons: Lesson[] = [
  {
    id: 1,
    title: "Advanced State Management with Redux & Context API",
    videoUrl:
      "https://archive.org/download/public-domain-archive/Space%20Shuttle%20Full%20Launch%20_%20Free%20Public%20Domain%20Video(1080P_HD).mp4",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    chapters: [
      { id: 1, title: "Pre-Launch Sequence", start: 0, end: 10 },
      { id: 2, title: "Liftoff and Ascent", start: 10, end: 25 },
      { id: 3, title: "Entering Orbit", start: 25, end: 30 },
    ],
    transcript: [
      {
        id: 1,
        start: 0,
        end: 5,
        text: "Welcome to the launch sequence. All systems are go.",
      },
      { id: 2, start: 5, end: 10, text: "T-minus 5, 4, 3, 2, 1..." },
      {
        id: 3,
        start: 10,
        end: 15,
        text: "We have liftoff! The shuttle is clearing the tower.",
      },
      {
        id: 4,
        start: 15,
        end: 20,
        text: "Continuing a steady ascent into the upper atmosphere.",
      },
      {
        id: 5,
        start: 20,
        end: 25,
        text: "The shuttle is performing perfectly.",
      },
      {
        id: 6,
        start: 25,
        end: 29,
        text: "We have now reached a stable orbit. Mission control, over.",
      },
    ],
    whiteboardNotes:
      "https://images.unsplash.com/photo-1616628188540-925618b98318?w=800&q=80",
    completed: false,
    captions: {
      en: "/captions/lesson1-en.vtt",
      es: "/captions/lesson1-es.vtt",
    },
  },
  {
    id: 2,
    title: "React Hooks Deep Dive: useState, useEffect & Custom Hooks",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    chapters: [
      { id: 1, title: "Beginning", start: 0, end: 2 },
      { id: 2, title: "End", start: 2, end: 5 },
    ],
    transcript: [
      { id: 1, start: 0, end: 2, text: "Let's begin this lesson." },
      { id: 2, start: 2, end: 5, text: "And now we are at the end." },
    ],
    whiteboardNotes:
      "https://images.unsplash.com/photo-1619410283995-43d9134e7656?w=800&q=80",
    completed: false,
  },
  {
    id: 3,
    title: "React Performance Optimization: Memoization & Code Splitting",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/bubbles.mp4",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&q=80",
    chapters: [
      { id: 1, title: "Chapter 1", start: 0, end: 4 },
      { id: 2, title: "Chapter 2", start: 4, end: 8 },
      { id: 3, title: "Chapter 3", start: 8, end: 12 },
    ],
    transcript: [
      { id: 1, start: 0, end: 4, text: "Welcome to this demonstration." },
      {
        id: 2,
        start: 4,
        end: 8,
        text: "The video is now playing the middle section.",
      },
      {
        id: 3,
        start: 8,
        end: 12,
        text: "This is the final part of the video.",
      },
    ],
    completed: false,
  },
];

// Keyboard shortcuts configuration
const keyboardShortcuts = [
  { key: "Space", action: "Play/Pause", keyCode: " " },
  { key: "←/→", action: "Seek -/+ 10s", keyCode: ["ArrowLeft", "ArrowRight"] },
  { key: "M", action: "Mute/Unmute", keyCode: "m" },
  { key: "F", action: "Fullscreen", keyCode: "f" },
  {
    key: "0-9",
    action: "Jump to 0-90%",
    keyCode: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  },
  { key: "Shift+N/P", action: "Next/Previous", keyCode: ["N", "P"] },
  { key: "K", action: "Keyboard Guide", keyCode: "k" },
];

export default function VideoLessonPlayer() {
  // --- State Variables ---
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showVolumeIndicator, setShowVolumeIndicator] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [whiteboardZoom, setWhiteboardZoom] = useState(1);
  const [brightness, setBrightness] = useState(1);
  const [lessons, setLessons] = useState(mockLessons);
  const [isWhiteboardPinching, setIsWhiteboardPinching] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragStartValues, setDragStartValues] = useState({
    brightness: 1,
    volume: 1,
  });
  const [isPotentialDrag, setIsPotentialDrag] = useState(false);
  const [showDragIndicator, setShowDragIndicator] = useState<
    "volume" | "brightness" | null
  >(null);

  // Enhanced UI states
  const [whiteboardPan, setWhiteboardPan] = useState({ x: 0, y: 0 });
  const [isWhiteboardPanning, setIsWhiteboardPanning] = useState(false);
  const [panStartPoint, setPanStartPoint] = useState({ x: 0, y: 0 });
  const [panStartValues, setPanStartValues] = useState({ x: 0, y: 0 });

  const [isWhiteboardLoading, setIsWhiteboardLoading] = useState(false);

  // Premium feature states
  const [showKeyboardGuide, setShowKeyboardGuide] = useState(false);
  const [showThumbnailPreview, setShowThumbnailPreview] = useState(false);
  const [thumbnailPosition, setThumbnailPosition] = useState({ x: 0, y: 0 });
  const [showGestureTutorial, setShowGestureTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [showCaptions] = useState(false);
  const [captionLanguage] = useState("en");
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [ripples, setRipples] = useState<
    { id: number; x: number; y: number; buttonId: string }[]
  >([]);
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; color: string }[]
  >([]);
  const [gestureTrailPoints, setGestureTrailPoints] = useState<TrailPoint[]>(
    []
  );
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
  const [hoveredTime, setHoveredTime] = useState<number | null>(null);

  // Panel transition state
  const [panelMode, setPanelMode] = useState<
    "transcript" | "whiteboard" | "none"
  >("transcript");

  // Music state
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.3);

  // Animated gradient background
  const gradientX = useMotionValue(0);
  const gradientY = useMotionValue(0);

  // --- Refs ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const whiteboardRef = useRef<HTMLDivElement>(null);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const activeTranscriptRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const lastRippleId = useRef(0);
  const lastParticleId = useRef(0);
  const trailIdCounter = useRef(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // --- Derived State ---
  const currentLesson = lessons[currentLessonIndex];
  const currentChapter = useMemo(() => {
    if (!currentLesson.chapters) return null;
    return currentLesson.chapters.find(
      (chapter) => currentTime >= chapter.start && currentTime < chapter.end
    );
  }, [currentLesson.chapters, currentTime]);

  const activeTranscriptItem = useMemo(() => {
    return currentLesson.transcript?.find(
      (item) => currentTime >= item.start && currentTime < item.end
    );
  }, [currentTime, currentLesson.transcript]);

  // --- Effects --- //
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("hasSeenGestureTutorial");
    if (!hasSeenTutorial) {
      setShowGestureTutorial(true);
    }

    const interval = setInterval(() => {
      if (!isPlaying || isFullscreen) return;

      gradientX.set(Math.sin(Date.now() * 0.0001) * 50);
      gradientY.set(Math.cos(Date.now() * 0.0001) * 50);
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, isFullscreen, gradientX, gradientY]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleFullscreenError = (e: Event) => {
      console.error("Fullscreen error:", e);
      setIsFullscreen(false);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("fullscreenerror", handleFullscreenError);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("fullscreenerror", handleFullscreenError);
    };
  }, []);

  useEffect(() => {
    if (duration > 0) {
      setLessons((prevLessons) => {
        const updatedLessons = [...prevLessons];
        const lessonToUpdate = { ...updatedLessons[currentLessonIndex] };
        const transcript = lessonToUpdate.transcript;

        if (transcript) {
          const endMarkerIndex = transcript.findIndex(
            (item) => item.text === "video end"
          );

          if (endMarkerIndex === -1) {
            lessonToUpdate.transcript = [
              ...transcript,
              {
                id: transcript.length + 1,
                start: duration,
                end: duration,
                text: "video end",
              },
            ];
            updatedLessons[currentLessonIndex] = lessonToUpdate;
            return updatedLessons;
          } else {
            if (transcript[endMarkerIndex].start !== duration) {
              const newTranscript = [...transcript];
              newTranscript[endMarkerIndex] = {
                ...newTranscript[endMarkerIndex],
                start: duration,
                end: duration,
              };
              lessonToUpdate.transcript = newTranscript;
              updatedLessons[currentLessonIndex] = lessonToUpdate;
              return updatedLessons;
            }
          }
        }
        return prevLessons;
      });
    }
  }, [duration, currentLessonIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMusicPlaying) {
      audio.play().catch((e) => console.error("Audio play error:", e));
    } else {
      audio.pause();
    }
  }, [isMusicPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = musicVolume;
    }
  }, [musicVolume]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => {
      setDuration(video.duration);
    };

    const handleCanPlay = () => {
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (currentLessonIndex < lessons.length - 1) {
        setTimeout(() => navigateLesson("next"), 2000);
      }
    };

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("ended", handleEnded);

    video.playbackRate = 1;

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("ended", handleEnded);
    };
  }, [currentLesson, currentLessonIndex, lessons.length]);

  useEffect(() => {
    if (!showControls || !isPlaying || showSettingsMenu) return;

    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, isPlaying, showSettingsMenu]);

  // Optimized continuous transcript scrolling for mobile
  useEffect(() => {
    if (
      panelMode !== "transcript" ||
      !activeTranscriptItem ||
      !transcriptContainerRef.current ||
      !activeTranscriptRef.current
    ) {
      return;
    }

    const scrollToActiveItem = () => {
      const container = transcriptContainerRef.current;
      const activeElement = activeTranscriptRef.current;

      if (!container || !activeElement) return;

      const elementTop = activeElement.offsetTop;

      const isMobile = window.innerWidth < 768;
      const offset = isMobile ? 15 : 20;
      const targetScrollTop = Math.max(0, elementTop - offset);

      if (isMobile) {
        container.scrollTop = targetScrollTop;
      } else {
        container.scrollTo({
          top: targetScrollTop,
          behavior: "smooth",
        });
      }
    };

    const scrollTimeout = setTimeout(scrollToActiveItem, isPlaying ? 100 : 50);

    return () => {
      clearTimeout(scrollTimeout);
    };
  }, [panelMode, activeTranscriptItem?.id, currentTime, isPlaying]);

  const togglePlayPause = useCallback(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const seekTo = useCallback(
    (time: number) => {
      if (!videoRef.current) return;
      const clampedTime = Math.max(0, Math.min(time, duration));
      videoRef.current.currentTime = clampedTime;
      setCurrentTime(clampedTime);
    },
    [duration]
  );

  const hideVolumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = Number.parseFloat(e.target.value);
      setVolume(newVolume);

      if (videoRef.current) {
        videoRef.current.volume = newVolume;
      }
      setIsMuted(newVolume === 0);

      setShowVolumeIndicator(true);

      if (hideVolumeTimeout.current) {
        clearTimeout(hideVolumeTimeout.current);
      }

      hideVolumeTimeout.current = setTimeout(() => {
        setShowVolumeIndicator(false);
      }, 2000);
    },
    []
  );


  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    videoRef.current.muted = newMuted;
    if (!newMuted && volume === 0) {
      setVolume(1);
      videoRef.current.volume = 1;
    }
  }, [isMuted, volume]);

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen toggle error:", error);
      setIsFullscreen(!!document.fullscreenElement);
    }
  }, []);

  const navigateLesson = useCallback(
    (direction: "prev" | "next") => {
      const newIndex =
        direction === "prev"
          ? Math.max(0, currentLessonIndex - 1)
          : Math.min(lessons.length - 1, currentLessonIndex + 1);

      if (newIndex !== currentLessonIndex) {
        setCurrentLessonIndex(newIndex);
        setCurrentTime(0);
        setPanelMode("transcript");
        setWhiteboardZoom(1);
        setWhiteboardPan({ x: 0, y: 0 });
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
        }

        addParticles(window.innerWidth / 2, window.innerHeight / 2, "#14b8a6");
      }
    },
    [currentLessonIndex, lessons.length]
  );

  const markComplete = useCallback(() => {
    const updatedLessons = [...lessons];
    updatedLessons[currentLessonIndex].completed = true;
    setLessons(updatedLessons);

    setShowCompletionAnimation(true);
    setTimeout(() => setShowCompletionAnimation(false), 3500);

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    setTimeout(() => {
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const distance = 120;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        addParticles(x, y, "#14b8a6");
      }
    }, 100);

    setTimeout(() => {
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
        const distance = 80;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        addParticles(x, y, "#06b6d4");
      }
    }, 300);

    setTimeout(() => {
      for (let i = 0; i < 4; i++) {
        const x = centerX + (Math.random() - 0.5) * 200;
        const y = centerY + (Math.random() - 0.5) * 200;
        addParticles(x, y, "#f59e0b");
      }
    }, 500);
  }, [lessons, currentLessonIndex]);

  const togglePiP = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (error) {
      console.error("PiP error:", error);
    }
  }, []);

  const completeTutorial = useCallback(() => {
    localStorage.setItem("hasSeenGestureTutorial", "true");
    setShowGestureTutorial(false);
  }, []);

  const addRipple = useCallback(
    (e: React.MouseEvent | React.TouchEvent, buttonId: string) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x =
        "touches" in e
          ? e.touches[0].clientX - rect.left
          : e.clientX - rect.left;
      const y =
        "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

      const newRipple = {
        id: lastRippleId.current++,
        x,
        y,
        buttonId,
      };

      setRipples((prev) => [...prev, newRipple]);
    },
    []
  );

  const removeRipple = useCallback((id: number) => {
    setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
  }, []);

  const addParticles = useCallback((x: number, y: number, color: string) => {
    const newParticles = Array.from({ length: 5 }, () => ({
      // Reduced from 8 to 5
      id: lastParticleId.current++,
      x,
      y,
      color,
    }));

    setParticles((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.find((np) => np.id === p.id))
      );
    }, 1500);
  }, []);

  const handleUniversalTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };

        if (isFullscreen) {
          const screenWidth = window.innerWidth;
          const touchX = touch.clientX;

          if (touchX < screenWidth * 0.33 || touchX > screenWidth * 0.67) {
            setIsPotentialDrag(true);
            setDragStart({ x: touch.clientX, y: touch.clientY });
            setDragStartValues({ brightness, volume });
          }
        }
      }
    },
    [isFullscreen, brightness, volume]
  );

  const handleUniversalTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length === 1 && !isFullscreen) {
        const touch = e.touches[0];
        setGestureTrailPoints((prev) =>
          [
            ...prev,
            {
              x: touch.clientX,
              y: touch.clientY,
              id: trailIdCounter.current++,
            },
          ].slice(-20)
        );
      }

      if (isFullscreen && isPotentialDrag && e.touches.length === 1) {
        const touch = e.touches[0];
        const deltaY = dragStart.y - touch.clientY;

        if (Math.abs(deltaY) > 10 && !isDragging) {
          setIsDragging(true);
          const screenWidth = window.innerWidth;
          const side =
            touch.clientX < screenWidth * 0.5 ? "brightness" : "volume";
          setShowDragIndicator(side);
        }

        if (isDragging) {
          const sensitivity = 0.005;
          const screenWidth = window.innerWidth;

          if (touch.clientX < screenWidth * 0.5) {
            const newBrightness = Math.max(
              0.2,
              Math.min(1.5, dragStartValues.brightness + deltaY * sensitivity)
            );
            setBrightness(newBrightness);
          } else {
            const newVolume = Math.max(
              0,
              Math.min(1, dragStartValues.volume + deltaY * sensitivity)
            );
            setVolume(newVolume);
            if (videoRef.current) {
              videoRef.current.volume = newVolume;
            }
            setIsMuted(newVolume === 0);
          }
        }
      }
    },
    [isFullscreen, isPotentialDrag, isDragging, dragStart, dragStartValues]
  );

  const handleUniversalTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      setGestureTrailPoints([]);

      if (isFullscreen && (isDragging || isPotentialDrag)) {
        setIsDragging(false);
        setIsPotentialDrag(false);
        setShowDragIndicator(null);
        return;
      }

      if (!isFullscreen && e.changedTouches.length > 0) {
        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
          if (deltaX > 0) {
            navigateLesson("prev");
          } else {
            navigateLesson("next");
          }
        }
      }
    },
    [isFullscreen, isDragging, isPotentialDrag, navigateLesson]
  );

  const handleWhiteboardTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        e.stopPropagation();
        setIsWhiteboardPinching(true);

        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        const initialPinchData = { distance, zoom: whiteboardZoom };
        const target = e.currentTarget as PinchTarget;
        target._initialPinchData = initialPinchData;
      } else if (e.touches.length === 1 && whiteboardZoom > 1) {
        const touch = e.touches[0];
        setPanStartPoint({ x: touch.clientX, y: touch.clientY });
        setPanStartValues({ x: whiteboardPan.x, y: whiteboardPan.y });
        setIsWhiteboardPanning(true);
      }
    },
    [whiteboardZoom, whiteboardPan]
  );

  const handleWhiteboardTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (isWhiteboardPinching && e.touches.length === 2) {
        e.preventDefault();
        e.stopPropagation();

        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const initialPinchData = (e.currentTarget as any)._initialPinchData;
        if (initialPinchData) {
          const scale = distance / initialPinchData.distance;
          const newZoom = Math.max(
            0.5,
            Math.min(3, initialPinchData.zoom * scale)
          );
          setWhiteboardZoom(newZoom);

          if (newZoom <= 1) {
            setWhiteboardPan({ x: 0, y: 0 });
          }
        }
      } else if (
        isWhiteboardPanning &&
        e.touches.length === 1 &&
        whiteboardZoom > 1
      ) {
        e.preventDefault();
        const touch = e.touches[0];
        const deltaX = touch.clientX - panStartPoint.x;
        const deltaY = touch.clientY - panStartPoint.y;

        const maxPan = (whiteboardZoom - 1) * 50;

        setWhiteboardPan({
          x: Math.max(-maxPan, Math.min(maxPan, panStartValues.x + deltaX)),
          y: Math.max(-maxPan, Math.min(maxPan, panStartValues.y + deltaY)),
        });
      }
    },
    [
      isWhiteboardPinching,
      isWhiteboardPanning,
      whiteboardZoom,
      panStartPoint,
      panStartValues,
    ]
  );

  const handleWhiteboardTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (isWhiteboardPinching && e.touches.length < 2) {
        setIsWhiteboardPinching(false);
      }
      if (isWhiteboardPanning && e.touches.length === 0) {
        setIsWhiteboardPanning(false);
      }
    },
    [isWhiteboardPinching, isWhiteboardPanning]
  );

  const handleWhiteboardMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (whiteboardZoom > 1) {
        e.preventDefault();
        setPanStartPoint({ x: e.clientX, y: e.clientY });
        setPanStartValues({ x: whiteboardPan.x, y: whiteboardPan.y });
        setIsWhiteboardPanning(true);
      }
    },
    [whiteboardZoom, whiteboardPan]
  );

  const handleWhiteboardMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isWhiteboardPanning && whiteboardZoom > 1) {
        e.preventDefault();
        const deltaX = e.clientX - panStartPoint.x;
        const deltaY = e.clientY - panStartPoint.y;

        const maxPan = (whiteboardZoom - 1) * 50;

        setWhiteboardPan({
          x: Math.max(-maxPan, Math.min(maxPan, panStartValues.x + deltaX)),
          y: Math.max(-maxPan, Math.min(maxPan, panStartValues.y + deltaY)),
        });
      }
    },
    [isWhiteboardPanning, whiteboardZoom, panStartPoint, panStartValues]
  );

  const handleWhiteboardMouseUp = useCallback(() => {
    setIsWhiteboardPanning(false);
  }, []);

  const handleWhiteboardWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.5, Math.min(3, whiteboardZoom * zoomFactor));
      setWhiteboardZoom(newZoom);

      if (newZoom <= 1) {
        setWhiteboardPan({ x: 0, y: 0 });
      }
    },
    [whiteboardZoom]
  );

  const handleVideoAreaMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isFullscreen) {
        const screenWidth = window.innerWidth;
        const mouseX = e.clientX;

        if (mouseX < screenWidth * 0.33 || mouseX > screenWidth * 0.67) {
          setIsPotentialDrag(true);
          setDragStart({ x: e.clientX, y: e.clientY });
          setDragStartValues({ brightness, volume });
        }
      }
    },
    [isFullscreen, brightness, volume]
  );

  const handleVideoAreaMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isFullscreen && isPotentialDrag) {
        const deltaY = dragStart.y - e.clientY;

        if (Math.abs(deltaY) > 10 && !isDragging) {
          setIsDragging(true);
          const screenWidth = window.innerWidth;
          const side = e.clientX < screenWidth * 0.5 ? "brightness" : "volume";
          setShowDragIndicator(side);
        }

        if (isDragging) {
          const sensitivity = 0.005;
          const screenWidth = window.innerWidth;

          if (e.clientX < screenWidth * 0.5) {
            const newBrightness = Math.max(
              0.2,
              Math.min(1.5, dragStartValues.brightness + deltaY * sensitivity)
            );
            setBrightness(newBrightness);
          } else {
            const newVolume = Math.max(
              0,
              Math.min(1, dragStartValues.volume + deltaY * sensitivity)
            );
            setVolume(newVolume);
            if (videoRef.current) {
              videoRef.current.volume = newVolume;
            }
            setIsMuted(newVolume === 0);
          }
        }
      }
    },
    [isFullscreen, isPotentialDrag, isDragging, dragStart, dragStartValues]
  );

  const handleVideoAreaMouseUp = useCallback(() => {
    if (isFullscreen && (isDragging || isPotentialDrag)) {
      setIsDragging(false);
      setIsPotentialDrag(false);
      setShowDragIndicator(null);
    }
  }, [isFullscreen, isDragging, isPotentialDrag]);

  const handleVideoAreaClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".video-controls")) return;

      togglePlayPause();
    },
    [togglePlayPause]
  );

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isPlaying && !showSettingsMenu) {
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isPlaying, showSettingsMenu]);

  const handleProgressHover = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const time = duration * percentage;

      setHoveredTime(time);
      setShowThumbnailPreview(true);
      setThumbnailPosition({ x: e.clientX, y: rect.top - 120 });
    },
    [duration]
  );

  const handleProgressLeave = useCallback(() => {
    setHoveredTime(null);
    setShowThumbnailPreview(false);
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          togglePlayPause();
          break;
        case "arrowleft":
          e.preventDefault();
          seekTo(currentTime - 10);
          break;
        case "arrowright":
          e.preventDefault();
          seekTo(currentTime + 10);
          break;
        case "m":
          toggleMute();
          break;
        case "f":
          toggleFullscreen();
          break;
        case "k":
          setShowKeyboardGuide(true);
          break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9": {
          const percent = Number.parseInt(e.key) * 10;
          seekTo((duration * percent) / 100);
          break;
        }
        case "n":
          if (e.shiftKey) navigateLesson("next");
          break;
        case "p":
          if (e.shiftKey) navigateLesson("prev");
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [
    currentTime,
    duration,
    togglePlayPause,
    seekTo,
    toggleMute,
    toggleFullscreen,
    navigateLesson,
  ]);

  return (
    <>
      {/* Global CSS Styles and Font Loading */}
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      {fontLinks}

      <audio
        ref={audioRef}
        src="https://assets.mixkit.co/music/preview/mixkit-slow-trail-710.mp3"
        loop
        preload="auto"
      />

      <div
        ref={containerRef}
        className={`
          box-border
          relative w-full max-w-full md:max-w-[90vw] lg:max-w-full
          px-2 sm:px-4 lg:px-6 overflow-x-hidden
          min-h-screen flex flex-col items-center
          ${isFullscreen ? "h-screen bg-black" : "animated-gradient"}
          smooth-transition
        `}
        onTouchStart={handleUniversalTouchStart}
        onTouchMove={handleUniversalTouchMove}
        onTouchEnd={handleUniversalTouchEnd}
        onMouseDown={handleVideoAreaMouseDown}
        onMouseMove={handleVideoAreaMouseMove}
        onMouseUp={handleVideoAreaMouseUp}
        role="main"
        aria-label="Video lesson player"
      >
        {/* Animated Background Pattern */}
        {!isFullscreen && (
          <motion.div
            className="absolute pointer-events-none"
            style={{ x: gradientX, y: gradientY, width: '100vw', height: '100vh' }}
          >
            <BackgroundPattern />
          </motion.div>
        )}

        {/* Gesture Tutorial Overlay */}
        <AnimatePresence>
          {showGestureTutorial && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-8"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="modern-card rounded-3xl p-6 sm:p-8 w-full max-w-[90vw] sm:max-w-lg shadow-2xl"
              >
                <h2 className="text-2xl font-bold mb-4 flex items-center gradient-text">
                  <FaLightbulb className="mr-3 text-yellow-500" />
                  Welcome to Premium Video Player
                </h2>

                <div className="space-y-4 mb-6">
                  {tutorialStep === 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-3"
                    >
                      <p className="text-gray-700">
                        Discover powerful gestures:
                      </p>
                      <ul className="space-y-3 text-sm text-gray-600">
                        <motion.li
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                          className="flex items-start bg-gray-50 p-3 rounded-lg"
                        >
                          <FaMagic className="mr-3 text-teal-500 mt-0.5 flex-shrink-0" />
                          <span>
                            Swipe horizontally to navigate between lessons
                          </span>
                        </motion.li>
                        <motion.li
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="flex items-start bg-gray-50 p-3 rounded-lg"
                        >
                          <FaMagic className="mr-3 text-teal-500 mt-0.5 flex-shrink-0" />
                          <span>Pinch to zoom on whiteboard notes</span>
                        </motion.li>
                        <motion.li
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          className="flex items-start bg-gray-50 p-3 rounded-lg"
                        >
                          <FaMagic className="mr-3 text-teal-500 mt-0.5 flex-shrink-0" />
                          <span>
                            In fullscreen: Drag vertically on left side for
                            brightness
                          </span>
                        </motion.li>
                        <motion.li
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                          className="flex items-start bg-gray-50 p-3 rounded-lg"
                        >
                          <FaMagic className="mr-3 text-teal-500 mt-0.5 flex-shrink-0" />
                          <span>
                            In fullscreen: Drag vertically on right side for
                            volume
                          </span>
                        </motion.li>
                      </ul>
                    </motion.div>
                  )}

                  {tutorialStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-3"
                    >
                      <p className="text-gray-700">
                        Keyboard shortcuts available:
                      </p>
                      <ul className="space-y-3 text-sm text-gray-600">
                        <motion.li
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                          className="flex items-start bg-gray-50 p-3 rounded-lg"
                        >
                          <FaKeyboard className="mr-3 text-teal-500 mt-0.5 flex-shrink-0" />
                          <span>
                            Press{" "}
                            <kbd className="px-2 py-1 bg-white rounded shadow-sm border border-gray-300">
                              K
                            </kbd>{" "}
                            anytime to see all shortcuts
                          </span>
                        </motion.li>
                        <motion.li
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="flex items-start bg-gray-50 p-3 rounded-lg"
                        >
                          <FaKeyboard className="mr-3 text-teal-500 mt-0.5 flex-shrink-0" />
                          <span>Space to play/pause, arrows to seek</span>
                        </motion.li>
                        <motion.li
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          className="flex items-start bg-gray-50 p-3 rounded-lg"
                        >
                          <FaKeyboard className="mr-3 text-teal-500 mt-0.5 flex-shrink-0" />
                          <span>Number keys jump to video positions</span>
                        </motion.li>
                      </ul>
                    </motion.div>
                  )}
                </div>

                <div className="flex justify-between">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setTutorialStep((prev) => Math.max(0, prev - 1))
                    }
                    className={`px-4 py-2 rounded-lg font-medium smooth-transition ${tutorialStep === 0
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    disabled={tutorialStep === 0}
                  >
                    Previous
                  </motion.button>

                  {tutorialStep < 1 ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setTutorialStep((prev) => prev + 1)}
                      className="px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-medium hover:from-teal-600 hover:to-cyan-600 smooth-transition shadow-lg"
                    >
                      Next
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={completeTutorial}
                      className="px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-medium hover:from-teal-600 hover:to-cyan-600 smooth-transition shadow-lg"
                    >
                      Get Started
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keyboard Guide Overlay */}
        <AnimatePresence>
          {showKeyboardGuide && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-8"
              onClick={() => setShowKeyboardGuide(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-white rounded-xl shadow-xl p-6 sm:p-8 max-w-xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gradient-text">
                  <FaKeyboard className="mr-3 text-teal-500" />
                  Keyboard Shortcuts
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {keyboardShortcuts.map((shortcut, index) => (
                    <motion.div
                      key={shortcut.key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md smooth-transition"
                    >
                      <span className="text-gray-700 font-medium">
                        {shortcut.action}
                      </span>
                      <kbd className="px-3 py-1 bg-white border border-gray-300 rounded-md font-mono text-xs shadow-sm">
                        {shortcut.key}
                      </kbd>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowKeyboardGuide(false)}
                  className="mt-6 w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-medium hover:from-teal-600 hover:to-cyan-600 smooth-transition shadow-lg"
                >
                  Close
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>


        {/* Enhanced Completion Animation Overlay */}
        <AnimatePresence>
          {showCompletionAnimation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center p-2 sm:p-4"
            >
              {/* Animated background overlay */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full"
                style={{
                  maxWidth: "600px",
                  maxHeight: "600px",
                  willChange: "transform, opacity",
                }}
              />

              {/* Main completion card */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0, y: 50, rotateY: -15 }}
                animate={{ scale: 1, opacity: 1, y: 0, rotateY: 0 }}
                exit={{ scale: 0.5, opacity: 0, y: 50, rotateY: 15 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 25,
                  duration: 0.6,
                }}
                className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl flex flex-col items-center w-full max-w-[90vw] sm:max-w-md lg:max-w-lg mx-4 border border-white/30"
                style={{ willChange: "transform, opacity" }}
              >
                {/* Floating celebration elements */}
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  }}
                  className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg"
                >
                  <CelebrationIcon className="w-4 h-4 text-white" />
                </motion.div>

                <motion.div
                  animate={{
                    rotate: [0, -360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                    scale: {
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    },
                  }}
                  className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg"
                >
                  <StarIcon className="w-3 h-3 text-white" />
                </motion.div>

                {/* Main icon with enhanced animation */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  className="relative mb-6"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center shadow-xl"
                  >
                    <FaGraduationCap className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                  </motion.div>

                  {/* Pulsing ring effect */}
                  <motion.div
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 0, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                    className="absolute inset-0 border-4 border-teal-400 rounded-full"
                  />
                </motion.div>

                {/* Title with staggered text animation */}
                <motion.div className="text-center mb-4">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
                    className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2"
                  >
                    Lesson Completed!
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
                    className="text-gray-600 text-sm sm:text-base font-medium"
                  >
                    Great job! You've mastered this lesson.
                  </motion.p>
                </motion.div>

                {/* Progress indicator */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.4, ease: "easeOut" }}
                  className="w-full bg-gray-200 rounded-full h-2 mb-4"
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full"
                  />
                </motion.div>

                {/* Celebration message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.4, ease: "easeOut" }}
                  className="text-center"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: [0, 2, -2, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.5,
                    }}
                    className="text-2xl mb-2"
                  >
                    <GraduationCapIcon className="w-8 h-8 text-teal-600" />
                  </motion.div>
                  <p className="text-gray-500 text-xs font-medium">
                    Ready for the next challenge!
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Navigation */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className={`w-full modern-card shadow-glow shadow-glow-hover smooth-transition z-20 flex-shrink-0 ${isFullscreen ? "hidden" : "block"} max-w-[95vw] sm:max-w-xl md:max-w-3xl lg:max-w-4xl rounded-2xl mb-4 sm:mb-6 mx-auto overflow-visible`}
        >
          <div className="p-2 sm:p-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-center text-white rounded-t-2xl">
            <h1 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold tracking-wide truncate px-1 sm:px-2 drop-shadow-lg">
              {courseTitle}
            </h1>
          </div>
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-6 gap-3">
              <Tooltip content="Previous lesson" shortcut="Shift+P">
                <motion.button
                  whileHover={{ scale: 1.05, x: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    addRipple(e, "prev-lesson");
                    navigateLesson("prev");
                  }}
                  disabled={currentLessonIndex === 0}
                  className="relative overflow-visible z-30 flex items-center space-x-2 px-3 sm:px-5 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-teal-600 hover:to-cyan-600 smooth-transition shadow-lg text-sm font-medium group"
                  aria-label="Previous lesson"
                >
                  <FaChevronLeft className="w-4 h-4 group-hover:-translate-x-1 smooth-transition" />
                  <span className="hidden sm:inline">Previous</span>
                  {ripples
                    .filter((ripple) => ripple.buttonId === "prev-lesson")
                    .map((ripple) => (
                      <Ripple
                        key={ripple.id}
                        {...ripple}
                        onComplete={() => removeRipple(ripple.id)}
                        buttonId={ripple.buttonId}
                      />
                    ))}
                </motion.button>
              </Tooltip>

              <div className="flex-1 mx-3 text-center min-w-0">
                <h2 className="text-base sm:text-lg font-bold gradient-text leading-tight truncate">
                  {currentLesson.title}
                </h2>
                <div className="text-xs sm:text-sm font-medium text-slate-600 mt-2 flex items-center justify-center space-x-3">
                  <span className="whitespace-nowrap">
                    Lesson {currentLessonIndex + 1} of {lessons.length}
                  </span>
                  <span className="text-slate-400 hidden sm:inline">•</span>
                  <div className="items-center space-x-1 hidden sm:flex">
                    <FaClock className="w-3 h-3 text-teal-600" />
                    <span>{duration > 0 ? formatTime(duration) : "..."}</span>
                  </div>
                </div>
              </div>

              <Tooltip content="Next lesson" shortcut="Shift+N">
                <motion.button
                  whileHover={{ scale: 1.05, x: 2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    addRipple(e, "next-lesson");
                    navigateLesson("next");
                  }}
                  disabled={currentLessonIndex === lessons.length - 1}
                  className="relative overflow-visible flex items-center space-x-2 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-teal-600 hover:to-cyan-600 smooth-transition shadow-lg text-sm font-medium group z-30"
                  aria-label="Next lesson"
                >
                  <span className="hidden sm:inline">Next</span>
                  <FaChevronRight className="w-4 h-4 group-hover:translate-x-1 smooth-transition" />
                  {ripples
                    .filter((ripple) => ripple.buttonId === "next-lesson")
                    .map((ripple) => (
                      <Ripple
                        key={ripple.id}
                        {...ripple}
                        onComplete={() => removeRipple(ripple.id)}
                        buttonId={ripple.buttonId}
                      />
                    ))}
                </motion.button>
              </Tooltip>
            </div>
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  addRipple(e, "mark-complete");
                  markComplete();
                }}
                disabled={currentLesson.completed}
                className={`relative overflow-visible w-full sm:w-auto px-5 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold smooth-transition shadow-lg text-sm flex items-center justify-center space-x-2 z-30 ${currentLesson.completed
                  ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-default"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-glow-hover"
                  }`}
                aria-label={
                  currentLesson.completed
                    ? "Lesson completed"
                    : "Mark lesson as complete"
                }
              >
                {currentLesson.completed ? (
                  <>
                    <FaCheck className="w-4 h-4" />
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <span>Mark as Complete</span>
                    <div className="absolute -right-1 -top-1 w-3 h-3 bg-white rounded-full pulse-ring opacity-60" />
                  </>
                )}
                {ripples
                  .filter((ripple) => ripple.buttonId === "mark-complete")
                  .map((ripple) => (
                    <Ripple
                      key={ripple.id}
                      {...ripple}
                      onComplete={() => removeRipple(ripple.id)}
                      buttonId={ripple.buttonId}
                    />
                  ))}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Video Player Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className={`video-container relative ${isFullscreen
            ? "w-full h-screen flex items-center justify-center"
            : "w-full max-w-full lg:max-w-[90vw] xl:max-w-[80vw] aspect-video rounded-2xl overflow-visible shadow-glow"
            } bg-black mx-auto smooth-transition`}
          style={isFullscreen ? { touchAction: "none" } : {}}
          onClick={handleVideoAreaClick}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={handleMouseLeave}
          role="region"
          aria-label="Video player"
        >
          <div className="video-click-area absolute inset-0 z-0" />

          {/* Swipe Hint Indicator */}
          {!isFullscreen && !isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1 }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 pointer-events-none"
            >
              <div className="flex items-center space-x-2 text-white/60">
                <FaChevronLeft className="w-4 h-4 swipe-hint" />
                <span className="text-xs">Swipe</span>
              </div>
            </motion.div>
          )}

          {/* Gesture Trail Visualization */}
          <AnimatePresence>
            {gestureTrailPoints.length > 0 && (
              <GestureTrail points={gestureTrailPoints} />
            )}
          </AnimatePresence>

          {/* Particles Container */}
          <div className="absolute inset-0 pointer-events-none z-50">
            {particles.map((particle) => (
              <Particle key={particle.id} {...particle} />
            ))}
          </div>

          <video
            ref={videoRef}
            className={`${isFullscreen
              ? "max-w-full max-h-full w-auto h-auto"
              : "w-full h-full object-cover"
              }`}
            style={{ filter: `brightness(${brightness})` }}
            playsInline
            controls={false}
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            aria-label="Video content"
          >
            <source src={currentLesson.videoUrl} type="video/mp4" />
            {showCaptions && currentLesson.captions?.[captionLanguage] && (
              <track
                kind="subtitles"
                src={currentLesson.captions[captionLanguage]}
                srcLang={captionLanguage}
                default
              />
            )}
            Your browser does not support the video tag.
          </video>

          {/* Drag Indicators - Full-screen brightness/volume controls */}
          {isFullscreen && showDragIndicator && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
            >
              <div className="glass-dark text-white p-8 rounded-2xl flex items-center justify-center flex-col min-w-[140px] shadow-2xl border border-white/20">
                {showDragIndicator === "brightness" ? (
                  <>
                    <FaSun className="w-10 h-10 text-yellow-400" />
                    <span className="text-3xl mt-3 font-semibold">
                      <AnimatedCounter value={brightness * 100} suffix="%" />
                    </span>
                  </>
                ) : (
                  <>
                    {volume === 0 || isMuted ? (
                      <FaVolumeMute className="w-10 h-10 sm:w-6 sm:h-6 md:w-8 md:h-8 text-gray-400" />
                    ) : (
                      <FaVolumeUp className="w-10 h-10 sm:w-6 sm:h-6 md:w-8 md:h-8 text-teal-400" />
                    )}
                    <span className="text-3xl mt-3 font-semibold">
                      <AnimatedCounter value={volume * 100} suffix="%" />
                    </span>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* Thumbnail Preview */}
          <AnimatePresence>
            {showThumbnailPreview && hoveredTime !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute z-40 pointer-events-none"
                style={{
                  left: thumbnailPosition.x,
                  top: thumbnailPosition.y,
                  transform: "translateX(-50%)",
                }}
              >
                <div className="bg-gray-900 rounded-lg p-2 shadow-xl">
                  <img
                    src={currentLesson.thumbnailUrl || "/placeholder.svg"}
                    alt="Video preview"
                    className="w-32 h-20 object-cover rounded"
                  />
                  <div className="text-white text-xs text-center mt-1 font-mono">
                    {formatTime(hoveredTime)}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video Controls Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showControls ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className={`video-controls absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"
              } flex flex-col justify-between z-10`}
          >
            {/* Top Controls Bar */}
            <div className="flex justify-between items-start p-4">
              {currentChapter && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="glass-dark rounded-lg px-4 py-2 border border-white/20"
                >
                  <p className="text-white text-sm font-medium">
                    {currentChapter.title}
                  </p>
                </motion.div>
              )}

              <div className="flex gap-2 ml-auto">
                {!isFullscreen && (
                  <>
                    <Tooltip content="Picture in Picture" position="bottom">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePiP();
                        }}
                        className="p-3 glass-dark border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300 shadow-xl"
                        aria-label="Toggle picture in picture"
                      >
                        <MdPictureInPictureAlt className="w-5 h-5" />
                      </motion.button>
                    </Tooltip>

                    <Tooltip content="Fullscreen" shortcut="F" position="bottom">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFullscreen();
                        }}
                        className="p-2 sm:p-2.5 md:p-3 rounded-full glass-dark text-white hover:bg-white/20 transition-all duration-300 shadow-xl"
                        aria-label="Toggle fullscreen"
                      >
                        <FaExpand className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                      </motion.button>
                    </Tooltip>
                  </>
                )}

                <Tooltip content="Settings" position="bottom">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSettingsMenu(!showSettingsMenu);
                    }}
                    className="p-2 sm:p-2.5 md:p-3 rounded-full glass-dark text-white hover:bg-white/20 transition-all duration-300 shadow-xl"
                    aria-label="Settings"
                  >
                    <FaCog className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </motion.button>
                </Tooltip>
              </div>
            </div>

            {/* Settings Menu */}
            <AnimatePresence>
              {showSettingsMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  className="absolute top-16 right-4 bg-gray-900 rounded-lg shadow-xl p-4 min-w-[200px] z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="space-y-3">
                    <button
                      onClick={() => setHighContrastMode(!highContrastMode)}
                      className="w-full flex items-center justify-between p-2 hover:bg-gray-800 rounded"
                    >
                      <span className="text-white text-sm flex items-center">
                        <FaAdjust className="mr-2" />
                        High Contrast
                      </span>
                      <div
                        className={`w-10 h-6 rounded-full ${highContrastMode ? "bg-teal-500" : "bg-gray-600"
                          } relative transition-colors`}
                      >
                        <motion.div
                          className="absolute w-4 h-4 bg-white rounded-full top-1"
                          animate={{ x: highContrastMode ? 20 : 2 }}
                        />
                      </div>
                    </button>

                    <button
                      onClick={() => setShowKeyboardGuide(true)}
                      className="w-full flex items-center p-2 hover:bg-gray-800 rounded text-white text-sm"
                    >
                      <FaKeyboard className="mr-2" />
                      Keyboard Shortcuts
                    </button>

                    <button
                      onClick={() => setShowGestureTutorial(true)}
                      className="w-full flex items-center p-2 hover:bg-gray-800 rounded text-white text-sm"
                    >
                      <FaLightbulb className="mr-2" />
                      Gesture Tutorial
                    </button>

                    {/* New Music Controls Start */}
                    <div className="pt-2">
                      <p className="text-white text-sm flex items-center mb-2">
                        <FaMusic className="mr-2" /> Background Music
                      </p>
                      <div className="flex items-center justify-between p-2 hover:bg-gray-800 rounded">
                        <span className="text-white text-sm">Play</span>
                        <button
                          onClick={() => setIsMusicPlaying(!isMusicPlaying)}
                        >
                          <div
                            className={`w-8 h-5 sm:w-10 sm:h-6 rounded-full ${isMusicPlaying ? "bg-teal-500" : "bg-gray-600"
                              } relative transition-colors`}
                          >
                            <motion.div
                              className="absolute w-4 h-4 bg-white rounded-full top-1"
                              animate={{ x: isMusicPlaying ? 20 : 2 }}
                            />
                          </div>
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-gray-800 rounded">
                        <span className="text-white text-sm">Volume</span>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={musicVolume}
                          onChange={(e) =>
                            setMusicVolume(parseFloat(e.target.value))
                          }
                          className="w-24 h-1 bg-gray-600 rounded-full cursor-pointer"
                        />
                      </div>
                    </div>
                    {/* New Music Controls End */}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Center Play Controls */}
            <div className="flex-1 flex items-center justify-center gap-x-8 sm:gap-x-16 z-10">
              <Tooltip content="Rewind 10s" shortcut="←">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    addRipple(e, "rewind");
                    seekTo(currentTime - 10);
                  }}
                  className="relative p-2 sm:p-3 md:p-4 rounded-full glass-dark text-white hover:bg-white/10 transition-all duration-300 shadow-xl touch-target"
                  aria-label="Rewind 10 seconds"
                >
                  <FaStepBackward className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  {ripples
                    .filter((ripple) => ripple.buttonId === "rewind")
                    .map((ripple) => (
                      <Ripple
                        key={ripple.id}
                        {...ripple}
                        onComplete={() => removeRipple(ripple.id)}
                        buttonId={ripple.buttonId}
                      />
                    ))}
                </motion.button>
              </Tooltip>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  addRipple(e, "play-pause");
                  togglePlayPause();
                }}
                className="relative p-2.5 sm:p-4 md:p-6 rounded-full bg-white/20 backdrop-blur-xl text-white hover:bg-white/30 transition-all duration-300 shadow-2xl touch-target"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <FaPause className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                ) : (
                  <FaPlay className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 ml-1" />
                )}
                {ripples
                  .filter((ripple) => ripple.buttonId === "play-pause")
                  .map((ripple) => (
                    <Ripple
                      key={ripple.id}
                      {...ripple}
                      onComplete={() => removeRipple(ripple.id)}
                      buttonId={ripple.buttonId}
                    />
                  ))}
              </motion.button>

              <Tooltip content="Forward 10s" shortcut="→">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    addRipple(e, "forward");
                    seekTo(currentTime + 10);
                  }}
                  className="relative p-2 sm:p-3 md:p-4 rounded-full glass-dark text-white hover:bg-white/10 transition-all duration-300 shadow-xl touch-target"
                  aria-label="Forward 10 seconds"
                >
                  <FaStepForward className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  {ripples
                    .filter((ripple) => ripple.buttonId === "forward")
                    .map((ripple) => (
                      <Ripple
                        key={ripple.id}
                        {...ripple}
                        onComplete={() => removeRipple(ripple.id)}
                        buttonId={ripple.buttonId}
                      />
                    ))}
                </motion.button>
              </Tooltip>
            </div>

            {/* Bottom Controls Bar */}
            <div className="p-2 sm:p-4 space-y-2">
              {/* Progress Bar */}
              <div
                ref={progressBarRef}
                className="relative h-2 bg-white/30 rounded-full cursor-pointer group"
                onMouseMove={handleProgressHover}
                onMouseLeave={handleProgressLeave}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const percentage = x / rect.width;
                  seekTo(duration * percentage);
                }}
              >
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>

              {/* Mobile-first responsive controls */}
              <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between text-white text-xs sm:text-sm">
                {/* First row on mobile: Time and Volume */}
                <div className="flex items-center justify-between sm:justify-start sm:gap-4">
                  <span className="font-mono text-xs sm:text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>

                  {/* Modern Volume Controls with High Contrast */}
                  <div className="flex items-center gap-3 group">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                      }}
                      className="p-2 sm:p-2.5 md:p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-200"
                      aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted || volume === 0 ? (
                        <FaVolumeMute className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white/70" />
                      ) : (
                        <FaVolumeUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                      )}
                    </motion.button>

                    <div className="relative flex items-center">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="volume-slider w-24 sm:w-28 h-2 cursor-pointer appearance-none bg-gray-300 rounded-full"
                        style={{
                          WebkitAppearance: "none",
                          appearance: "none",
                          height: "8px",
                          borderRadius: "9999px",
                          background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${(isMuted ? 0 : volume) * 100}%, #d1d5db ${(isMuted ? 0 : volume) * 100}%, #d1d5db 100%)`,
                        }}
                        aria-label="Volume"
                      />
                      {/* Modern Volume level indicator */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 5 }}
                        animate={{
                          opacity: showVolumeIndicator && volume > 0 && !isMuted ? 1 : 0,
                          scale: showVolumeIndicator && volume > 0 && !isMuted ? 1 : 0.8,
                          y: showVolumeIndicator && volume > 0 && !isMuted ? 0 : 5,
                        }}
                        className="absolute -top-14 sm:-top-10 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-xl text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap border border-white/30 shadow-xl z-30"
                        style={{ pointerEvents: "none" }}
                      >
                        {Math.round((isMuted ? 0 : volume) * 100)}%
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Second row on mobile: Captions only */}
                <div className="flex items-center justify-between sm:justify-end sm:gap-4">
                  {/* Right side controls */}
                  {isFullscreen && (
                    <Tooltip content="Exit fullscreen" shortcut="F">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFullscreen();
                        }}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        aria-label="Exit fullscreen"
                      >
                        <FaCompress className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Transcript and Whiteboard Toggle */}
        {!isFullscreen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto mt-6 px-2 sm:px-0"
          >
            <div className="flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 rounded-full p-1 shadow-inner gap-1 sm:gap-2">

              {/* Transcript */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPanelMode("transcript")}
                className={`flex-1 px-4 py-2.5 !rounded-3xl font-medium text-sm text-center smooth-transition ${panelMode === "transcript"
                  ? "bg-white text-teal-600 shadow-md"
                  : "!bg-transparent text-gray-600 hover:text-gray-800"
                  }`}
              >
                <FaFileAlt className="w-4 h-4 inline mr-2" />
                Transcript
              </motion.button>

              {/* Whiteboard */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPanelMode("whiteboard")}
                className={`flex-1 px-4 py-2.5 !rounded-3xl font-medium text-sm text-center smooth-transition ${panelMode === "whiteboard"
                  ? "bg-white text-teal-600 shadow-md"
                  : "!bg-transparent text-gray-600 hover:text-gray-800"
                  }`}
              >
                <FaBookOpen className="w-4 h-4 inline mr-2" />
                Whiteboard
              </motion.button>

              {/* Close */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPanelMode("none")}
                className={`px-4 py-2.5 !rounded-3xl font-medium text-sm text-center smooth-transition ${panelMode === "none"
                  ? "bg-white text-teal-600 shadow-md"
                  : "!bg-transparent text-gray-600 hover:text-gray-800"
                  }`}
              >
                <FaTimes className="w-4 h-4 inline" />
              </motion.button>
            </div>

          </motion.div>
        )}

        {/* Content Panel - Transcript or Whiteboard */}
        {!isFullscreen && panelMode !== "none" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="w-full max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-4xl mx-auto mt-6 mb-8 px-4 sm:px-0 min-h-0 flex-shrink-0"
          >
            <AnimatePresence mode="wait">
              {/* Transcript Display */}
              {panelMode === "transcript" && (
                <motion.div
                  key="transcript"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="modern-card rounded-2xl shadow-glow p-6"
                >
                  <h3 className="text-lg font-bold gradient-text mb-4 flex items-center">
                    <FaFileAlt className="mr-2 text-teal-600" />
                    Transcript
                  </h3>
                  <div
                    ref={transcriptContainerRef}
                    className="transcript-container relative h-[calc(30vh)] sm:h-[calc(35vh)] min-h-0 overflow-y-auto pr-2 sm:pr-4 space-y-2 sm:space-y-3 custom-scrollbar"
                    role="region"
                    aria-label="Video transcript"
                    aria-live="polite"
                    style={{
                      willChange: "scroll-position",
                      transform: "translateZ(0)",
                    }}
                  >
                    {currentLesson.transcript.map((item) => {
                      const isActive =
                        activeTranscriptItem &&
                        item.id === activeTranscriptItem.id;
                      return (
                        <motion.div
                          key={item.id}
                          ref={isActive ? activeTranscriptRef : null}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: item.id * 0.05 }}
                          className={`p-3 sm:p-4 rounded-xl cursor-pointer smooth-transition overflow-hidden ${isActive
                            ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg transform scale-[1.02] border border-white/20"
                            : "bg-gray-50 hover:bg-gray-100 text-gray-700 hover:shadow-md border border-gray-200/50 hover:border-gray-300/50"
                            }`}
                          onClick={() => seekTo(item.start)}
                          role="button"
                          tabIndex={0}
                          aria-label={`Jump to ${formatTime(item.start)}`}
                          style={{
                            willChange: isActive
                              ? "transform, opacity"
                              : "auto",
                            transform: "translateZ(0)",
                          }}
                        >
                          <div className="flex items-start">
                            <span
                              className={`text-xs font-mono mr-2 sm:mr-3 flex-shrink-0 ${isActive ? "text-white/90" : "text-gray-500"
                                }`}
                            >
                              {formatTime(item.start)}
                            </span>
                            <p
                              className={`flex-1 text-sm sm:text-base ${isActive ? "font-medium" : ""
                                } leading-relaxed`}
                            >
                              {item.text}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Whiteboard Display */}
              {panelMode === "whiteboard" && (
                <motion.div
                  key="whiteboard"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="modern-card rounded-2xl shadow-glow p-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold gradient-text flex items-center">
                      <FaBookOpen className="mr-2 text-teal-600" />
                      Whiteboard Notes
                      {isWhiteboardLoading && (
                        <FaSpinner className="ml-3 w-4 h-4 animate-spin text-gray-500" />
                      )}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          setWhiteboardZoom(Math.max(0.5, whiteboardZoom - 0.1))
                        }
                        className="p-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-lg smooth-transition shadow-sm"
                        aria-label="Zoom out"
                      >
                        <FaTimes className="w-4 h-4 text-gray-700" />
                      </motion.button>
                      <span className="text-sm font-medium gradient-text min-w-[60px] text-center">
                        <AnimatedCounter
                          value={whiteboardZoom * 100}
                          suffix="%"
                        />
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          setWhiteboardZoom(Math.min(3, whiteboardZoom + 0.1))
                        }
                        className="p-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-lg smooth-transition shadow-sm"
                        aria-label="Zoom in"
                      >
                        <FaArrowsAlt className="w-4 h-4 text-gray-700" />
                      </motion.button>
                    </div>
                  </div>
                  <div
                    ref={whiteboardRef}
                    className="relative h-[calc(40vh)] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-visible shadow-inner cursor-move border border-gray-200"
                    onTouchStart={handleWhiteboardTouchStart}
                    onTouchMove={handleWhiteboardTouchMove}
                    onTouchEnd={handleWhiteboardTouchEnd}
                    onMouseDown={handleWhiteboardMouseDown}
                    onMouseMove={handleWhiteboardMouseMove}
                    onMouseUp={handleWhiteboardMouseUp}
                    onMouseLeave={handleWhiteboardMouseUp}
                    onWheel={handleWhiteboardWheel}
                    style={{
                      cursor:
                        whiteboardZoom > 1
                          ? isWhiteboardPanning
                            ? "grabbing"
                            : "grab"
                          : "default",
                    }}
                    role="img"
                    aria-label="Whiteboard notes"
                  >
                    {currentLesson.whiteboardNotes ? (
                      <>
                        {isWhiteboardLoading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                            <SkeletonLoader className="w-full h-full" />
                          </div>
                        )}
                        <motion.img
                          src={currentLesson.whiteboardNotes}
                          alt="Whiteboard notes"
                          className="w-full h-full object-contain select-none"
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: isWhiteboardLoading ? 0 : 1,
                            scale: whiteboardZoom,
                            x: whiteboardPan.x,
                            y: whiteboardPan.y,
                          }}
                          transition={{
                            opacity: { duration: 0.3 },
                            scale: {
                              type: "spring",
                              stiffness: 300,
                              damping: 30,
                            },
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            y: { type: "spring", stiffness: 300, damping: 30 },
                          }}
                          onLoad={() => setIsWhiteboardLoading(false)}
                          draggable={false}
                        />
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center p-8"
                        >
                          <FaImage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 font-medium">
                            No whiteboard notes available for this lesson
                          </p>
                          <p className="text-gray-400 text-sm mt-2">
                            Check back later or continue with the video
                          </p>
                        </motion.div>
                      </div>
                    )}
                  </div>
                  {currentLesson.whiteboardNotes && whiteboardZoom > 1 && (
                    <p className="text-xs text-gray-500 mt-3 text-center flex items-center justify-center space-x-2">
                      <FaArrowsAlt className="w-3 h-3" />
                      <span>
                        Use mouse drag or touch to pan • Scroll or pinch to zoom
                      </span>
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </>
  );
}