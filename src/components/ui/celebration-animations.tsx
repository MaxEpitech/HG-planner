"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type ConfettiProps = {
  trigger?: boolean;
  onComplete?: () => void;
};

export function Confetti({ trigger = false, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; rotation: number }>>([]);

  useEffect(() => {
    if (!trigger) return;

    const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6"];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100 - 50,
      y: Math.random() * -100 - 50,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [trigger, onComplete]);

  if (!particles.length) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: particle.color,
            left: "50%",
            top: "20%",
          }}
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            x: particle.x * 3,
            y: particle.y * 8,
            opacity: 0,
            rotate: particle.rotation,
          }}
          transition={{
            duration: 2.5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

type TrophyAnimationProps = {
  trigger?: boolean;
  size?: "sm" | "md" | "lg";
};

export function TrophyAnimation({ trigger = false, size = "md" }: TrophyAnimationProps) {
  if (!trigger) return null;

  const sizeClasses = {
    sm: "text-4xl",
    md: "text-6xl",
    lg: "text-8xl",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <motion.div
        className={`${sizeClasses[size]} select-none`}
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0, rotate: 180, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
      >
        🏆
        <motion.div
          className="absolute inset-0 rounded-full bg-yellow-400/30 blur-xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: 2,
          }}
        />
      </motion.div>
    </div>
  );
}
