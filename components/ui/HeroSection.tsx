import { Button, Chip } from "@/lib/client-imports";
import CountdownCard from "./CountdownCard";
import { IconGallery } from "../samples/Icons";
import { BeginQuiz, Sparkles } from "@/lib/icons";

const HeroSection = () => {
  return (
    <section>
      <div
        className="w-full
        grid grid-cols-1 lg:grid-cols-2 
        items-center justify-center
        text-center text-pretty p-4 md:p-6 lg:p-8
        bg-linear-to-r from-hero1 to-hero2 
        space-y-8 lg:space-y-0 space-x-2
        mt-8
        py-12 md:py-20 lg:py-24"
      >
        <div className="justify-start text-white text-center lg:text-left space-y-8">
          <div className="space-y-2">
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
              className="py-2 font-thin uppercase border-primary/20 bg-secondary/20 "
            />
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-none ">
              Master Your
              <span className="block bg-linear-to-r from-text1 via-text2 to-text3 bg-clip-text text-transparent">
                Exam Prep
              </span>
            </h1>
          </div>
          <p className="text-sm md:text-base lg:text-lg font-light text-white/80">
            The most intelligent online reviewer platform featuring adaptive
            learning algorithms, comprehensive analytics, and real-time feedback
            to accelerate your exam preparation.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center lg:justify-start">
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

          <div className="flex flex-row whitespace-nowrap gap-2">
            {/* Expert */}
            <div className="flex-1">
              <div className="flex items-start gap-3">
                {/* Gradient vertical line - auto height */}
                <div className="hidden lg:flex w-1.5 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full flex-shrink-0 self-stretch"></div>

                {/* Text Content */}
                <div className="flex-1">
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-none">
                    <span className="text-lg md:text-xl lg:text-2xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Expert
                    </span>
                  </h1>

                  <span className="block text-sm md:text-base text-slate-400 mt-2">
                    Crafted Content
                  </span>
                </div>
              </div>
            </div>

            {/* 100 */}
            <div className="flex-1">
              <div className="flex items-start gap-3">
                {/* Gradient vertical line - auto height */}
                <div className="hidden lg:flex w-1.5 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full flex-shrink-0 self-stretch"></div>

                {/* Text Content */}
                <div className="flex-1">
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-none">
                    <span className="text-lg md:text-xl lg:text-2xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      100+
                    </span>
                  </h1>

                  <span className="block text-sm md:text-base text-slate-400 mt-2">
                    Practice Questions
                  </span>
                </div>
              </div>
            </div>

            {/* Realistic */}
            <div className="flex-1">
              <div className="flex items-start gap-3">
                {/* Gradient vertical line - auto height */}
                <div className="hidden lg:flex w-1.5 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full flex-shrink-0 self-stretch"></div>

                {/* Text Content */}
                <div className="flex-1">
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-none">
                    <span className="text-lg md:text-xl lg:text-2xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Realistic
                    </span>
                  </h1>

                  <span className="block text-sm md:text-base text-slate-400 mt-2">
                    Exam Simulation
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CountdownCard
          targetDate="April 15, 2026"
          message="Exam Day is Approaching!"
        />
      </div>
    </section>
  );
};

export default HeroSection;
