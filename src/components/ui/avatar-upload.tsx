"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type AvatarUploadProps = {
  currentAvatar?: string | null;
  userName: string;
  onUpload: (file: File, croppedDataUrl: string) => Promise<void>;
  size?: "sm" | "md" | "lg";
};

export function AvatarUpload({ 
  currentAvatar, 
  userName, 
  onUpload,
  size = "md" 
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizes = {
    sm: "w-16 h-16 text-xl",
    md: "w-24 h-24 text-3xl",
    lg: "w-32 h-32 text-4xl",
  };

  // Get initials for fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate color from name
  const getColorFromName = (name: string) => {
    const colors = [
      "from-emerald-400 to-emerald-600",
      "from-blue-400 to-blue-600",
      "from-purple-400 to-purple-600",
      "from-amber-400 to-amber-600",
      "from-rose-400 to-rose-600",
      "from-cyan-400 to-cyan-600",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Crop image to circle
  const cropToCircle = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const size = Math.min(img.width, img.height);
          canvas.width = 300;
          canvas.height = 300;
          
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Canvas context not available"));
            return;
          }

          // Draw circular clip
          ctx.beginPath();
          ctx.arc(150, 150, 150, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();

          // Draw image centered
          const offsetX = (img.width - size) / 2;
          const offsetY = (img.height - size) / 2;
          ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, 300, 300);

          resolve(canvas.toDataURL("image/jpeg", 0.8));
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner une image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 5MB");
      return;
    }

    try {
      setIsUploading(true);
      const croppedDataUrl = await cropToCircle(file);
      setPreview(croppedDataUrl);
      await onUpload(file, croppedDataUrl);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Erreur lors du traitement de l'image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const displayAvatar = preview || currentAvatar;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar Display */}
      <motion.div
        className={`relative ${sizes[size]} rounded-full overflow-hidden ${
          isDragging ? "ring-4 ring-emerald-500" : "ring-2 ring-white/10"
        } transition-all`}
        whileHover={{ scale: 1.05 }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {displayAvatar ? (
          <Image
            src={displayAvatar}
            alt={userName}
            fill
            className="object-cover"
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getColorFromName(
              userName
            )} text-white font-bold`}
          >
            {getInitials(userName)}
          </div>
        )}

        {/* Upload overlay */}
        <div
          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-center text-white">
            <p className="text-xs font-semibold">
              {isUploading ? "⏳" : "📸"}
            </p>
            <p className="text-xs mt-1">
              {isUploading ? "Upload..." : "Changer"}
            </p>
          </div>
        </div>

        {isUploading && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </motion.div>

      {/* File input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
      />

      {/* Upload button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {currentAvatar ? "Modifier la photo" : "Ajouter une photo"}
      </button>

      <p className="text-xs text-slate-500 text-center max-w-xs">
        Formats acceptés: JPG, PNG, WebP (max 5MB)
      </p>
    </div>
  );
}
