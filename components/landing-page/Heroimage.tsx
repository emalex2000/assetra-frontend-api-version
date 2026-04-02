"use client";
import { FC } from "react";
import { motion } from "framer-motion";

const HeroImage: FC = () => {
  return (
    <div className="w-full flex justify-center px-4 md:px-8 lg:px-0">
      
      {/* Container */}
      <div className="relative w-full max-w-162.5 h-65 sm:h-80 md:h-95 bg-gray-200 rounded-xl overflow-hidden">

        {/* MAIN DASHBOARD IMAGE */}
        <motion.img
          src="/dashboard-overview.png"
          alt="Dashboard Overview"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] md:w-[90%] lg:w-[95%]"
          
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        />

        {/* LEFT FLOATING CARD */}
        <motion.img
          src="/growth.png"
          alt="Growth Stats"
          className="absolute float2 -left-2.5 md:-left-5 bottom-10 w-22.5 sm:w-25 md:w-27.5 lg:w-32.5 shadow-xl rounded-lg"
          
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        />

        {/* RIGHT FLOATING CARD */}
        <motion.img
          src="/Illustrations.png"
          alt="Analytics Card"
          className="absolute float1 -right-2.5 md:right-[-20px] top-[30px] w-[90px] sm:w-[100px] md:w-[110px] lg:w-[130px] shadow-xl rounded-lg"
          
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        />

      </div>
    </div>
  );
};

export default HeroImage;