import React from "react";
import { imgLanding } from "../assets";
const CompanyLandingPage = () => {
  return (
    <div className="flex flex-col h-screen bg-[#13131a] text-white ">
      {/* <main className="flex-1 p-6 bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900"> */}
      <main className="flex-1 p-6 bg-[#13131a]">
        {" "}
        {/* Modify this line */}
        <section className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Creative Solutions For A Digital World
          </h1>
          <p className="text-xl md:text-2xl mb-6">
            Unlock the Potential of Creative Design to Stand Out in Today’s
            World.
          </p>
          <button className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-full text-lg font-semibold">
            Start A Project
          </button>
        </section>
        <section className="mt-10 flex justify-center space-x-4">
          <span className="px-4 py-2 bg-purple-700 hover:bg-purple-800 rounded-lg">
            Branding
          </span>
          <span className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg">
            UI/UX Design
          </span>
          <span className="px-4 py-2 bg-pink-700 hover:bg-pink-800 rounded-lg">
            Websites
          </span>
        </section>
        <section className="mt-10 flex justify-center">
          <div className="flex flex-col items-center">
            <img
              src={imgLanding}
              alt="Creative Design"
              className="w-full h-auto md:max-w-2xl"
            />
            <p className="mt-4 text-lg">
              +10Y Committed to design-driven product development for years, we
              excel in crafting innovative solutions.
            </p>
          </div>
        </section>
        <section className="mt-10 text-center">
          {/* <h2 className="text-3xl font-semibold">Strategy & Analytics</h2>
          <p className="mt-4 text-lg">
            We refine what exists, reimagine what’s possible, and combine insights, heart, and creativity to help brands better understand themselves and grow into new categories, markets, and audiences.
          </p> */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {[
              "Brand Strategy",
              "Marketing Strategy",
              "Copywriting",
              "Content Strategy",
              "Information Architecture",
              "Consumer & Market Insights",
              "Content Creation",
            ].map((item, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded-lg"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CompanyLandingPage;
