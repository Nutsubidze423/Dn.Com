import { motion } from "framer-motion";
import bgVideo from "../assets/bgvideo.mp4";

const HeroIntro = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden" id="home">
      {/* Background Video - FULL SCREEN */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Film grain texture (optional but premium) */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none z-10"
        style={{
          backgroundImage: "url(https://grainy-gradients.vercel.app/noise.svg)",
        }}
      />

      {/* Vignette effect */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* Content Layer */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center px-8">
        {/* Main Hero Text - MASSIVE */}
        <motion.h1
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-[120px] md:text-[200px] lg:text-[250px] font-black text-white leading-[0.85] tracking-[-0.02em]"
          style={{
            fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
            textShadow: "0 10px 60px rgba(0,0,0,0.8)",
          }}
        >
          D&nbsp;&nbsp;&nbsp;N
        </motion.h1>

        {/* Georgian subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-xl md:text-2xl text-gray-400 font-light mt-8"
        >
          ﹁ დ ე მ ე ტ რ ე ﹂
        </motion.p>

        {/* Scroll indicator - Animated */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute bottom-12 text-sm text-gray-500 uppercase tracking-[0.2em]"
        >
          SCROLL DOWN ↓
        </motion.div>
      </div>
    </section>
  );
};

export default HeroIntro;
