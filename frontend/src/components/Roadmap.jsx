import Button from "./Button";
import Heading from "./Heading";
import Section from "./Section";
import Tagline from "./Tagline";
import { roadmap } from "../constants";
import { check2, grid, loading1 } from "../assets";
import { Gradient } from "./design/Roadmap";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const Roadmap = () => (
  <Section className="overflow-hidden" id="roadmap">
    <div className="container md:pb-10">

      {/* 🔥 Heading */}
      <motion.div
        variants={item}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <Heading tag="Ready to get started" title="Future Scope" />
      </motion.div>

      {/* 🔥 Roadmap Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="relative grid gap-6 md:grid-cols-2 md:gap-4 md:pb-[7rem]"
      >
        {roadmap.map((itemData) => {
          const status = itemData.status === "done" ? "Done" : "In progress";

          return (
            <motion.div
              variants={item}
              key={itemData.id}
              className={`md:flex even:md:translate-y-[7rem] p-0.25 rounded-[2.5rem] ${
                itemData.colorful ? "bg-conic-gradient" : "bg-n-6"
              }`}
            >
              <div className="relative p-8 bg-n-8 rounded-[2.4375rem] overflow-hidden xl:p-15">
                
                <div className="absolute top-0 left-0 max-w-full">
                  <img
                    className="w-full"
                    src={grid}
                    width={550}
                    height={550}
                    alt="Grid"
                  />
                </div>

                <div className="relative z-1">

                  {/* Top Row */}
                  <div className="flex items-center justify-between max-w-[27rem] mb-8 md:mb-20">
                    <Tagline>{itemData.date}</Tagline>

                    <div className="flex items-center px-4 py-1 bg-n-1 rounded text-n-8">
                      <img
                        className="mr-2.5"
                        src={itemData.status === "done" ? check2 : loading1}
                        width={16}
                        height={16}
                        alt={status}
                      />
                      <div className="tagline">{status}</div>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="mb-10 -my-10 -mx-15">
                    <img
                      className="w-full"
                      src={itemData.imageUrl}
                      width={628}
                      height={426}
                      alt={itemData.title}
                    />
                  </div>

                  {/* Text */}
                  <h4 className="h4 mb-4">{itemData.title}</h4>
                  <p className="body-2 text-n-4">{itemData.text}</p>

                </div>
              </div>
            </motion.div>
          );
        })}

        <Gradient />
      </motion.div>

   
      <motion.div
        variants={item}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="flex justify-center mt-12 md:mt-15 xl:mt-20"
      >
        <Button href="/roadmap">Our roadmap</Button>
      </motion.div>
    </div>
  </Section>
);

export default Roadmap;