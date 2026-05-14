import { benefits } from "../constants";
import Heading from "./Heading";
import Section from "./Section";
import Arrow from "../assets/svg/Arrow";
import { GradientLight } from "./design/Benefits";
import ClipPath from "../assets/svg/ClipPath";
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
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const innerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const Benefits = () => {
  return (
    <Section id="features">
      <div className="container relative z-2">

        <motion.div
          variants={item}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-10"
        >
          <Heading
            className="md:max-w-md lg:max-w-2xl"
            title="Less Scrolling, More Knowing with NeuroVault"
          />
        </motion.div>

        {/* 🔥 Benefits Grid */}
        <motion.div
          className="flex flex-wrap gap-10 mb-10"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {benefits.map((itemData) => (
            <motion.div
              key={itemData.id}
              variants={item}
              className="block relative p-0.5 bg-no-repeat bg-[length:100%_100%] md:max-w-[24rem]"
              style={{ backgroundImage: `url(${itemData.backgroundUrl})` }}
              whileHover={{ scale: 1.03 }}
            >
              {/* 🔥 Inner Content Animation */}
              <motion.div
                className="relative z-2 flex flex-col min-h-[22rem] p-[2.4rem] pointer-events-none"
                variants={innerItem}
              >
                <h5 className="h5 mb-5">{itemData.title}</h5>
                <p className="body-2 mb-6 text-n-3">{itemData.text}</p>
                <div className="flex items-center mt-auto">
                  <img
                    src={itemData.iconUrl}
                    width={48}
                    height={48}
                    alt={itemData.title}
                  />
                  <p className="ml-auto font-code text-xs font-bold text-n-1 uppercase tracking-wider">
                    Explore more
                  </p>
                  <Arrow />
                </div>
              </motion.div>

              {/* Gradient & ClipPath */}
              {itemData.light && <GradientLight />}
              <div
                className="absolute inset-0.5 bg-n-8"
                style={{ clipPath: "url(#benefits)" }}
              >
                <div className="absolute inset-0 opacity-0 transition-opacity hover:opacity-10">
                  {itemData.imageUrl && (
                    <img
                      src={itemData.imageUrl}
                      width={380}
                      height={362}
                      alt={itemData.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              <ClipPath />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
};

export default Benefits;
"/Users/apple/Documents/brainwave-main"
