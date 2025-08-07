# Interactive Video Lesson Player

An advanced, interactive video lesson player component built in 5 hours for an AI-Training project with React, TypeScript, Tailwind CSS, and Framer Motion in SINGLE .tsx file. It offers seamless touch and keyboard controls, integrated transcript, and customizable UI animations.

## Technologies

- React (Next.js App Router, using "use client" directive)

- TypeScript with strict type checking

- Tailwind CSS for responsive styling

- Framer Motion for animations

- React Icons & custom SVG components

- Vite or Next.js build pipeline

# Key Features

- Player Controls: Play/Pause, 10s rewind/forward, volume & brightness adjustment via drag or touch gestures, fullscreen & Picture-in-Picture

- Touch & Gesture Support: Swipe to navigate lessons, pinch-to-zoom whiteboard notes, vertical drag on fullscreen edges for brightness/volume

-  Keyboard Shortcuts: Space, ←/→, M (mute), F (fullscreen), 0–9 (seek), Shift+N/P (next/prev), K (show shortcuts)

- Transcript Panel: Clickable transcript lines synchronized with video playback

- Whiteboard Integration: Zoomable and pannable whiteboard images with skeleton loading

- Completion Animations: Particle effects and celebration modal on lesson completion

- Dynamic UI: Glassmorphism cards, gradient text, smooth transitions, responsive layout

# Installation

- Clone the repository:
  ```bash
  git clone https://github.com/yourusername/interactive-video-player.git
  cd interactive-video-player
- Install dependencies:
  ```bash
  npm install
  # or
  yarn install
- Run the development server:
  ```bash
  npm run dev
  # or
  yarn dev

# Usage
Import and include the VideoLessonPlayer component in your page or app:
  ```bash
  import VideoLessonPlayer from '@/components/VideoLessonPlayer';
  export default function CoursePage() {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Course Title</h1>
        <VideoLessonPlayer />
      </div>
    );
  }

Customize the mock lesson data or pass your own via props as needed.
