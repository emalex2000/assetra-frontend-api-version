"use client";
import { FC } from "react";
import { motion } from "framer-motion";

const SectionB: FC = () => {
  return (
    <section className="w-full px-4 md:px-8 lg:px-16 py-16">
      
      <div className="flex flex-col lg:flex-row items-center gap-12">

        {/* LEFT (MOCKUP AREA) */}
        <div className="w-full flex justify-between">
          
          <div
            className="
              relative w-full max-w-137.75 
              h-[260px] sm:h-[320px] md:h-[380px] 
              rounded-xl overflow-hidden
              bg-no-repeat bg-center bg-contain
              p-6
            "
            style={{
              backgroundImage: "url('/mockup-table.png')",
            }}
          >

            {/* BLUE CHAT (LEFT - TOP) */}
            <motion.img
              src="/text-blue1.png"
              alt="blue chat"
              className="
                absolute top-[18%] left-[12%]
                w-[22%] min-w-[70px] max-w-[110px]
                object-contain
              "
              initial={{ opacity: 0, scale: 0.7, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            />

            {/* WHITE CHAT (LEFT - MIDDLE) */}
            <motion.img
              src="/text-white2.png"
              alt="white chat"
              className="
                absolute top-[42%] left-[20%]
                w-[30%] min-w-[100px] max-w-[150px]
                object-contain
              "
              initial={{ opacity: 0, scale: 0.7, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            />

            {/* BLACK CHAT (RIGHT SIDE - SAFE INSIDE) */}
            <motion.img
              src="/text-black2.png"
              alt="black chat"
              className="
                absolute bottom-[18%] right-[15%]
                w-[22%] min-w-[70px] max-w-[110px]
                object-contain
              "
              initial={{ opacity: 0, scale: 0.7, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            />

          </div>
        </div>

        {/* RIGHT TEXT */}
        <div className="flex flex-col gap-4 max-w-xl text-center lg:text-left">
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            A Smarter Way to Manage Electronic Assets
          </h2>

          <p className="text-gray-600 text-sm sm:text-base">
            Our Electronic Equipment Management System provides a centralized platform for 
            tracking and managing electronic devices across your organization. Administrators 
            can easily register devices, assign them to users, track their location by country, 
            and monitor the complete history of each device.
          </p>

        </div>

      </div>
    </section>
  );
};

export default SectionB;