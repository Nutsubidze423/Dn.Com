import { motion } from "framer-motion";

const HeroIntro = () => {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/src/assets/bgvideo.mp4" />
      </video>

      {/* Film grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: "url(https://grainy-gradients.vercel.app/noise.svg)",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Color grade overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

      {/* Content on top */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-[200px] leading-[0.85] font-black tracking-[-0.02em]"
          style={{
            fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
            fontWeight: 900,
            WebkitTextStroke: "2px rgba(255,255,255,0.1)",
            textShadow: "0 2px 40px rgba(255,255,255,0.1)",
          }}
        >
          D&nbsp;&nbsp;&nbsp;N
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-2xl text-gray-400 font-light mt-8"
        >
          ﹁ დ ე მ ე ტ რ ე ﹂
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-10 text-sm text-gray-500 uppercase tracking-wider"
        >
          SCROLL DOWN ↓
        </motion.div>
      </div>
    </section>
  );
};

export default HeroIntro;
