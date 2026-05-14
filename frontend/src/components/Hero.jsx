import { curve, heroBackground, robot } from "../assets";
import Button from "./Button";
import Section from "./Section";
import { BackgroundCircles, BottomLine, Gradient } from "./design/Hero";
import { heroIcons } from "../constants";
import { ScrollParallax } from "react-just-parallax";
import { useRef } from "react";
import Generating from "./Generating";
import Notification from "./Notification";
import CompanyLogos from "./CompanyLogos";
import robotVideo from "../assets/robot.mp4";
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
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const Hero = () => {
  const parallaxRef = useRef(null);

  return (
    <Section
      className="pt-[12rem] -mt-[5.25rem]"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      <div className="container relative" ref={parallaxRef}>
        
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]"
        >
          <motion.h1 variants={item} className="h1 mb-6">
            Explore the Future of Collaborative Knowledge with{" "}
            <span className="inline-block relative">
              Neurovault
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8"
          >
            A collaborative AI workspace where your entire team can query your document library and get instant, source-cited answers — zero cloud, zero compromise.
          </motion.p>

          <motion.div variants={item}>
            <Button href="/workspace" white>
              Create workspace
            </Button>
          </motion.div>
        </motion.div>

        {/* 🎥 VIDEO SECTION */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24"
        >
          <div className="relative z-1 p-0.5 rounded-2xl">
            <div className="relative rounded-[1rem]">
              <div className="h-[0em] rounded-t-[0.9rem]" />

              <div className="aspect-[33/40] rounded-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/490] perspective-[1000px] group">
                
                <video
                  src={robotVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="
                    w-full h-full object-cover rounded-3xl
                    transition-transform duration-1000 ease-out
                    transform-gpu [transform-style:preserve-3d]
                    group-hover:[transform:rotateX(-8deg)_scale(1.7)]
                    md:scale-[1] md:-translate-y-[10%]
                    translate-y-[23%]
                  "
                />

                <Generating className="absolute left-4 right-4 bottom-5 md:left-1/2 md:right-auto md:bottom-8 md:w-[31rem] md:-translate-x-1/2" />

                <ScrollParallax isAbsolutelyPositioned className="backdrop-blur-sm">
                  <ul className="hidden absolute -left-[5.5rem] bottom-[7.5rem] px-1 py-1 backdrop-blur border border-n-1/10 rounded-2xl xl:flex h-[4rem]  flex items-center justify-center ">
                    {heroIcons.map((icon, index) => (
                      <li className="p-4" key={index}>
                        <img src={icon} width={18} height={18} alt={icon} />
                      </li>
                    ))}
                  </ul>
                </ScrollParallax>

                <ScrollParallax isAbsolutelyPositioned>
                  <Notification
                    className="hidden absolute -right-[5.5rem] bottom-[11rem] w-[18rem] xl:flex h-[5rem]"
                    title="Summarization"
                  />
                </ScrollParallax>

              </div>
            </div>
          </div>

          {/* Background */}
          <div className="absolute -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%]">
            <img
              src={heroBackground}
              className="w-full"
              width={1440}
              height={1800}
              alt="hero"
            />
          </div>

          <BackgroundCircles className="animate-spin" />
        </motion.div>

        <CompanyLogos className="hidden relative z-10 mt-20 lg:block wi" />
      </div>

      <BottomLine />
    </Section>
  );
};

export default Hero;