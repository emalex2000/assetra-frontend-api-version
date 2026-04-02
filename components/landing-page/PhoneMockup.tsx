import { motion } from "framer-motion";

export default function PhoneMockup() {
  return (
    <div
      className="relative w-full max-w-[350px] md:max-w-[500px] lg:w-138.75 
                 h-[220px] md:h-[300px] lg:h-86.75 
                 bg-gray-200 rounded-tl-xl rounded-tr-xl 
                 flex items-end justify-center overflow-hidden"
    >

      {/* Phone */}
      {/* Phone */}
<motion.img
  src="Frame-38524.png"
  alt=""
  className="w-[180px] md:w-[220px] lg:w-[243.08px] max-h-full z-10"
  initial={{ y: 120, opacity: 0 }}
  whileInView={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  viewport={{ once: false, amount: 0.3 }}
/>

{/* Blue text */}
<motion.img
  src="text-blue1.png"
  alt=""
  className="absolute top-[10%] left-[5%] z-20 
             w-[120px] md:w-[150px] lg:w-[158px]"
  initial={{ opacity: 0, y: 20, scale: 0.9 }}
  whileInView={{ opacity: 1, y: 0, scale: 1 }}
  transition={{ delay: 0.3, duration: 0.5 }}
  viewport={{ once: false }}
/>

{/* White 1 */}
<motion.img
  src="text-white1.png"
  alt=""
  className="absolute top-[25%] right-[5%] z-20 
             w-[140px] md:w-[200px] lg:w-[255px]"
  initial={{ opacity: 0, y: 20, scale: 0.9 }}
  whileInView={{ opacity: 1, y: 0, scale: 1 }}
  transition={{ delay: 0.5, duration: 0.5 }}
  viewport={{ once: false }}
/>

{/* White 2 */}
<motion.img
  src="text-white2.png"
  alt=""
  className="absolute bottom-[25%] left-[10%] z-20 
             w-[140px] md:w-[200px] lg:w-[255px]"
  initial={{ opacity: 0, y: 20, scale: 0.9 }}
  whileInView={{ opacity: 1, y: 0, scale: 1 }}
  transition={{ delay: 0.7, duration: 0.5 }}
  viewport={{ once: false }}
/>

{/* Black */}
<motion.img
  src="text-black.png"
  alt=""
  className="absolute bottom-[10%] right-[10%] z-20 
             w-[120px] md:w-[160px] lg:w-[200px]"
  initial={{ opacity: 0, y: 20, scale: 0.9 }}
  whileInView={{ opacity: 1, y: 0, scale: 1 }}
  transition={{ delay: 0.9, duration: 0.5 }}
  viewport={{ once: false }}
/>
    </div>
  );
}