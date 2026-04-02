import { FC } from "react";
import { motion } from "framer-motion";

const HeroRight: FC = () => {
  return (
    <div className="w-full flex justify-center px-4 md:px-8 lg:px-0">
      
      <div className="relative w-full max-w-[520px] h-[260px] sm:h-[320px] md:h-[380px] bg-gray-200 rounded-xl overflow-hidden">

        {/* PHONE */}
        <motion.img
          src="/Mobile-breakpoint.png"
          alt="Mobile UI"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 
          w-[60%] max-w-[220px] object-contain z-10"
          
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        />

        {/* TOP CARD */}
        <motion.img
          src="/Frame-38507.png"
          alt=""
          className="absolute top-[18px] left-[55%] -translate-x-1/2 
          w-[35%] max-w-[150px] object-contain z-20 float1"
          
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        />

        {/* RIGHT CARD */}
        <motion.img
          src="/chart8.png"
          alt=""
          className="absolute right-[18px] top-[42%] 
          w-[28%] max-w-[110px] object-contain z-20 float2"
          
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        />

        {/* BOTTOM RIGHT */}
        <motion.img
          src="/chart-3.png"
          alt=""
          className="absolute bottom-[20px] right-[35px] 
          w-[28%] max-w-[110px] object-contain z-20 float3"
          
          initial={{ opacity: 0, x: 50, y: 50 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          viewport={{ once: true }}
        />

      </div>
    </div>
  );
};

export default HeroRight;