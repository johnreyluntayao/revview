import React from "react";
import Chip from "../atoms/Chip";
import Card from "../atoms/Card";
import Carousel from "../atoms/Carousel"; // ← Import the new Carousel

const BoostPreparation = () => {
  const affiliateCards = [
    <Card
      key="1"
      variant="affiliate"
      badge="Book"
      value="Complete CSE Review Guide"
      subValue="Comprehensive 500-page study material covering all exam topics"
      price="₱599"
      buttonText="Learn More"
      buttonLink="/review-guide"
      image="/steps/image 1.svg"
      imageAlt="Stack of review books"
      className="h-full"
    />,
    // Add more cards here as needed
    <Card
      key="2"
      variant="affiliate"
      badge="Course"
      value="Advanced CSE Mastery Program"
      subValue="Live classes + recorded sessions with expert instructors"
      price="₱1,299"
      buttonText="Learn More"
      buttonLink="/mastery-program"
      image="/steps/image 2.svg"
      imageAlt="Online course illustration"
      className="h-full"
    />,
    <Card
      key="3"
      variant="affiliate"
      badge="Book"
      value="CSE Practice Test Bank"
      subValue="2000+ practice questions with detailed explanations"
      price="₱399"
      buttonText="Learn More"
      buttonLink="/practice-tests"
      image="/steps/image 3.svg"
      imageAlt="Practice test materials"
      className="h-full"
    />,
    <Card
      key="3"
      variant="affiliate"
      badge="Book"
      value="CSE Practice Test Bank"
      subValue="2000+ practice questions with detailed explanations"
      price="₱399"
      buttonText="Learn More"
      buttonLink="/practice-tests"
      image="/steps/image 3.svg"
      imageAlt="Practice test materials"
      className="h-full"
    />,
    <Card
      key="3"
      variant="affiliate"
      badge="Book"
      value="CSE Practice Test Bank"
      subValue="2000+ practice questions with detailed explanations"
      price="₱399"
      buttonText="Learn More"
      buttonLink="/practice-tests"
      image="/steps/image 3.svg"
      imageAlt="Practice test materials"
      className="h-full"
    />,
    <Card
      key="3"
      variant="affiliate"
      badge="Book"
      value="CSE Practice Test Bank"
      subValue="2000+ practice questions with detailed explanations"
      price="₱399"
      buttonText="Learn More"
      buttonLink="/practice-tests"
      image="/steps/image 3.svg"
      imageAlt="Practice test materials"
      className="h-full"
    />,
  ];

  return (
    <section>
      <div className="bg-primary/10 w-full flex flex-col items-center justify-center text-pretty gap-4 md:gap-6 lg:gap-8 py-7.5 md:py-15 lg:py-22.5 px-4 md:px-6 lg:px-12">
        <div className="flex flex-col items-center gap-2 md:gap-3 lg:gap-4">
          <Chip
            text="Recommended Resources"
            className="py-2"
            variant="product"
            leftIcon={<span>📚</span>}
          />
          <h1 className="text-2xl md:text-[32px] lg:text-5xl font-bold text-foreground">
            Boost Your Preparation
          </h1>
          <p className="text-xs md:text-base lg:text-xl text-muted-foreground text-center">
            Curated study materials and courses from trusted providers
          </p>
        </div>

        {/* Carousel instead of Grid */}
        <div className="w-full">
          <Carousel showDots={true}
          showArrows={true} fadeIntensity="light">
            {affiliateCards}
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default BoostPreparation;
