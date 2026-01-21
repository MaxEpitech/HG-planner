"use client";

import { motion } from "framer-motion";

type ShareButtonProps = {
  title: string;
  text: string;
  url?: string;
  platform?: "twitter" | "facebook" | "linkedin" | "native" | "all";
  certificateId?: string;
};

export function ShareButton({ title, text, url, platform = "native", certificateId }: ShareButtonProps) {
  const handleShare = async (targetPlatform: string) => {
    const shareData = {
      title,
      text: certificateId 
        ? `${text}\n\nVérifier: https://highlandgameseurope.com/verify/${certificateId}` 
        : text,
      url: url || window.location.href,
    };

    if (targetPlatform === "native" && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      const shareUrl = getShareUrl(targetPlatform, shareData);
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  const getShareUrl = (
    platform: string,
    data: { title: string; text: string; url: string }
  ) => {
    const encodedText = encodeURIComponent(data.text);
    const encodedUrl = encodeURIComponent(data.url);
    
    switch (platform) {
      case "twitter":
        return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
      case "facebook":
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      case "linkedin":
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
      default:
        return "#";
    }
  };

  const icons = {
    twitter: "🐦",
    facebook: "📘",
    linkedin: "💼",
    native: "📤",
    all: "📤",
  };

  if (platform === "all") {
    return (
      <div className="flex gap-2">
        {["twitter", "facebook", "linkedin"].map((p) => (
          <motion.button
            key={p}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleShare(p)}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            title={`Partager sur ${p}`}
          >
            <span>{icons[p as keyof typeof icons]}</span>
          </motion.button>
        ))}
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => handleShare(platform)}
      className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
    >
      <span>{icons[platform]}</span>
      <span>Partager</span>
    </motion.button>
  );
}

type BadgeUnlockAnimationProps = {
  show: boolean;
  badgeName: string;
  badgeIcon: string;
  onComplete?: () => void;
};

export function BadgeUnlockAnimation({
  show,
  badgeName,
  badgeIcon,
  onComplete,
}: BadgeUnlockAnimationProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onComplete}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="relative"
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 blur-3xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />

        {/* Badge container */}
        <div className="relative rounded-3xl border-4 border-amber-400 bg-gradient-to-br from-amber-500 to-amber-600 p-12 shadow-2xl">
          <div className="text-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-8xl mb-4"
            >
              {badgeIcon}
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-sm uppercase tracking-widest text-amber-100 mb-2">
                Badge Débloqué !
              </p>
              <h2 className="text-3xl font-bold text-white">{badgeName}</h2>
            </motion.div>
          </div>
        </div>

        {/* Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-amber-400"
            style={{
              top: "50%",
              left: "50%",
            }}
            animate={{
              x: (Math.random() - 0.5) * 300,
              y: (Math.random() - 0.5) * 300,
              opacity: [1, 0],
              scale: [1, 0],
            }}
            transition={{
              duration: 1.5,
              delay: 0.8 + Math.random() * 0.3,
            }}
          />
        ))}

        <p className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-sm text-slate-400 whitespace-nowrap">
          Cliquez n'importe où pour continuer
        </p>
      </motion.div>
    </motion.div>
  );
}
