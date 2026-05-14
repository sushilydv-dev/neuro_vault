import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const CompanyLogos = ({ className }) => {
  const companyLogos = [
    "Summarize",
    "Chat",
    "Collaborate",
    "Learn",
    "Research",
  ];

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.h5
        variants={item}
        className="tagline mb-6 text-center text-white/90"
      >
        HELPING PEOPLE GET AI-POWERED ANSWERS FROM THEIR DOCUMENTS WITH
        NEUROVAULT
      </motion.h5>

      <motion.ul
        variants={container}
        className="flex gap-6 justify-center flex-wrap"
      >
        {companyLogos.map((logo, index) => (
          <motion.li
            key={index}
            variants={item}
            className="flex-1 min-w-[120px]"
          >
            <div
              className="
                group
                rounded-lg
                border border-gray-700
                transition-all duration-300 ease-out
                hover:-translate-y-[0.2rem]
                hover:border-gray-200
              "
            >
              <div className="flex items-center justify-center h-[4.5rem] text-lg font-semibold text-gray-400 group-hover:text-white  rounded-lg backdrop-blur-md transition-colors duration-300">
                {logo}
              </div>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
};

export default CompanyLogos;