import { check } from "../assets";
import { pricing } from "../constants";
import Button from "./Button";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const listContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const listItem = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
};

const PricingList = () => {
  return (
    <motion.div
      className="flex gap-[1rem] max-lg:flex-wrap"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {pricing.map((itemData) => (
        <motion.div
          key={itemData.id}
          variants={item}
          whileHover={{ scale: 1.03 }}
          className="w-[19rem] max-lg:w-full h-full px-6 bg-n-8 border border-n-6 rounded-[2rem] lg:w-auto even:py-14 odd:py-8 odd:my-4 [&>h4]:first:text-color-2 [&>h4]:even:text-color-1 [&>h4]:last:text-color-3"
        >
          <h4 className="h4 mb-4">{itemData.title}</h4>

          <p className="body-2 min-h-[4rem] mb-3 text-n-1/50">
            {itemData.description}
          </p>

          <div className="flex items-center h-[5.5rem] mb-6">
            {itemData.price && (
              <>
                <div className="h3">$</div>
                <div className="text-[5.5rem] leading-none font-bold">
                  {itemData.price}
                </div>
              </>
            )}
          </div>

          <Button
            className="w-full mb-6"
            href={itemData.price ? "/pricing" : "mailto:contact@jsmastery.pro"}
            white={!!itemData.price}
          >
            {itemData.price ? "Get started" : "Contact us"}
          </Button>

          {/* 🔥 FEATURES STAGGER */}
          <motion.ul
            variants={listContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {itemData.features.map((feature, index) => (
              <motion.li
                key={index}
                variants={listItem}
                className="flex items-start py-5 border-t border-n-6"
              >
                <img src={check} width={24} height={24} alt="Check" />
                <p className="body-2 ml-4">{feature}</p>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PricingList;