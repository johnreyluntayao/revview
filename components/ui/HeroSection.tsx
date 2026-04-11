import { Button, Chip } from "@/lib/client-imports";
import CountdownCard from "./CountdownCard";
import { IconGallery } from "../samples/Icons";
import { BeginQuiz, Sparkles } from "@/lib/icons";

const HeroSection = () => {
  return (
    <section>
      <div
        className="w-full min-h-screen
        grid grid-cols-1 lg:grid-cols-2 
        bg-linear-to-r from-hero1 to-hero2
        mt-16
        py-12 md:py-20 lg:py-24
        px-4 md:px-6 lg:px-8
        gap-8"
      >
        <div className="justify-start text-white text-center lg:text-left">
          <div className="space-y-3.5 md:space-y-4 lg:space-y-4.5">
            <Chip
              text="Welcome to Revview"
              leftIcon={
                <Sparkles
                  size={16}
                  strokeWidth={1}
                  className="text-yellow-300"
                  fill="currentColor"
                />
              }
              className=" uppercase border border-primary/30 bg-primary/20 tracking-widest text-[#BFDBFE]"
            />
            <div className="tracking-wide">
              <h1 className="text-[36px] md:text-5xl lg:text-6xl font-black">
              Master your
            </h1>
            <h1 className="inline-block text-[36px] md:text-5xl lg:text-6xl font-black bg-linear-to-r from-text1 via-text2 to-text3 bg-clip-text text-transparent">
                Board Exam
            </h1>
            </div>
            
          </div>

          <p className="text-base md:text-lg lg:text-xl text-white/80 mt-6 md:mt-7 lg:mt-8">
            The most intelligent online reviewer platform featuring adaptive
            learning algorithms, comprehensive analytics, and real-time feedback
            to accelerate your exam preparation.
          </p>

          <div className="flex flex-col md:flex-row gap-2 md:gap-3 lg:gap-4 justify-center lg:justify-start mt-6 md:mt-8 lg:mt-12">
            <Button
              text="Get Started Free"
              backgroundColor="bg-primary"
              textColor="text-white"
              rightIcon={<BeginQuiz />}
            />
            <Button
              text="Learn More"
              borderColor="border-primary border-4"
              textColor="text-white"
            />
          </div>

          <div className="flex mt-8 md:mt-10 lg:mt-12 text-center lg:text-start justify-center lg:justify-start">
            <div className="flex-1 px-0 lg:px-3 py-0 border-l-none lg:border-l-4 border-primary300 space-y-2 md:space-y-2.5 lg:space-y-3">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary300">
                Expert
              </h1>
              <p className="block text-[10px] md:text-xs lg:text-sm text-white/80">
                Crafted Content
              </p>
            </div>

            <div className="flex-1 px-0 lg:px-3 py-0 border-l-none lg:border-l-4 border-purple300 space-y-2 md:space-y-2.5 lg:space-y-3">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-purple300">
                100+
              </h1>
              <p className="block text-[10px] md:text-xs lg:text-sm text-white/80">
                Practice Questions
              </p>
            </div>

            <div className="flex-1 px-0 lg:px-3 py-0 border-l-none lg:border-l-4 border-cyan400 space-y-2 md:space-y-2.5 lg:space-y-3">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-cyan400">
                Realistic
              </h1>
              <p className="block text-[10px] md:text-xs lg:text-sm text-white/80">
                Exam Simulation
              </p>
            </div>

          </div>
        </div>
        <div className="flex items-center justify-center">

          <CountdownCard
          targetDate="August 15, 2026"
          message="Exam Day is Approaching!"
        />
        </div>
        
      </div>
    </section>
  );
};

export default HeroSection;
