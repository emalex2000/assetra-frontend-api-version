"use client";
import { FC } from "react";
import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";

const SectionA: FC = () => {
  return (
    <section className="w-full px-4 md:px-8 lg:px-16 py-16">
      
      {/* RESPONSIVE LAYOUT */}
      <div className="flex flex-col lg:flex-row items-center gap-12">

        {/* LEFT TEXT */}
        <div className="flex flex-col gap-4 max-w-xl">
          
          <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl">
            Managing <span className="text-blue-600">Electronic Devices</span> Shouldn’t Be Difficult
          </h2>

          <p className="text-gray-600 text-sm sm:text-base">
            Many organizations struggle to track their electronic equipment effectively. 
            Devices move between users, offices, and countries, but without a proper 
            system, it becomes difficult to maintain accurate records.
          </p>

          <h3 className="font-semibold mt-2">Common Challenges Include</h3>

          {/* CHALLENGES LIST */}
          <div className="flex flex-col gap-2">
            {[
              "Losing track of which user has a specific device",
              "Difficulty managing devices across different locations",
              "Lack of accountability when devices change ownership",
              "Manual spreadsheets that are difficult to maintain",
              "No historical record of device allocation",
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <FiCheck className="text-blue-600 mt-1 shrink-0" />
                <p className="text-sm sm:text-base text-gray-700">{item}</p>
              </div>
            ))}
          </div>

          <p className="text-gray-600 text-sm sm:text-base mt-2">
            Our system eliminates these challenges by giving administrators a 
            structured and reliable way to manage assets.
          </p>
        </div>

        {/* RIGHT IMAGE SECTION */}
        <div className="w-full flex justify-center">
          
          <div className="relative w-full max-w-[500px] h-[260px] sm:h-[320px] md:h-[360px] bg-gray-200 rounded-xl overflow-hidden p-6">

            {/* DASHBOARD HALF (comes from right, leaves left padding) */}
            <motion.img
              src="/dashboard-half.png"
              alt="Dashboard"
              className="absolute right-6 bottom-6 
              w-[75%] max-w-[320px] object-contain"
              
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            />

            {/* MOBILE FRAME (comes from bottom, above dashboard) */}
            <motion.img
              src="/Frame-38524.png"
              alt="Mobile frame"
              className="absolute bottom-0 left-6 
              w-[120px] sm:w-[140px] md:w-[160px] object-contain z-20"
              
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            />

          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionA;