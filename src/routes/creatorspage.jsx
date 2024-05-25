import { useState, useEffect } from "react";

export default function CreatorsPage() {
  // STATE VARIABLES
  const [state, setState] = useState(0);
  const [activeTab, setActiveTab] = useState(1); // 1 for Tab 1, 2 for Tab 2, 3 for Tab 3

  // JAVASCRIPT LOGIC
  useEffect(() => {
    setState(state + 1);
  }, []);

  // Handle tab click
  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  // Determine which content to display based on the active tab
  const getTabContent = () => {
    switch (activeTab) {
      case 1:
        return (
          <div className="p-4 text-center">
            This will be like a social media style feed where the creators post
            are
          </div>
        );
      case 2:
        return (
          <div className="p-4 text-center">
            This will be the CookBook where the creators recipes are. You have
            to subscribe to see.
          </div>
        );
      case 3:
        return (
          <div className="p-4 text-center">
            <div class="flex flex-col rounded-3xl bg-white">
              <div class="px-6 py-8 sm:p-10 sm:pb-6">
                <div class="grid w-full grid-cols-1 items-center justify-center text-left">
                  <div>
                    <h2 class="text-lg font-medium tracking-tighter text-gray-600 lg:text-3xl">
                      Starter
                    </h2>
                    <p class="mt-2 text-sm text-gray-500">
                      Suitable to grow steadily.
                    </p>
                  </div>
                  <div class="mt-6">
                    <p>
                      <span class="text-5xl font-light tracking-tight text-black">
                        $25
                      </span>
                      <span class="text-base font-medium text-gray-500">
                        {" "}
                        /mo{" "}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex px-6 pb-8 sm:px-8">
                <a
                  aria-describedby="tier-company"
                  class="nline-flex flex w-full items-center justify-center rounded-full border-2 border-black bg-black px-6 py-2.5 text-center text-sm text-white duration-200 hover:border-black hover:bg-transparent hover:text-black focus:outline-none focus-visible:outline-black focus-visible:ring-black"
                  href="#"
                >
                  Get started
                </a>
              </div>
            </div>
          </div>
        );
      default:
        return <div className="p-4 text-center">Content for Tab 1</div>;
    }
  };

  // HTML
  return (
    <>
      <div className="flex min-h-screen w-full flex-col items-center">
        <div className="relative h-64 w-full items-center bg-gray-200">
          <div className="absolute bottom-0 left-1/2 h-32 w-32 -translate-x-1/2 translate-y-1/4 overflow-hidden rounded-full border-4 border-black bg-gray-300"></div>
        </div>
        <h1 className="mt-10 text-3xl font-bold">John Doe</h1>
        <p className="text-gray-500">Software Engineer</p>
        {/* Tabs Section */}
        <div className="flex w-full items-center justify-around bg-white px-4 py-2 shadow-lg">
          <div
            onClick={() => handleTabClick(1)}
            className="tab cursor-pointer text-center"
          >
            <p className="text-sm text-gray-700 hover:text-blue-500">
              Creator Feed
            </p>
          </div>
          <div
            onClick={() => handleTabClick(2)}
            className="tab cursor-pointer text-center"
          >
            <p className="text-sm text-gray-700 hover:text-blue-500">
              Cookbook
            </p>
          </div>
          <div
            onClick={() => handleTabClick(3)}
            className="tab cursor-pointer text-center"
          >
            <p className="text-sm text-gray-700 hover:text-blue-500">Other</p>
          </div>
        </div>
        {/* Dynamic Content Based on Active Tab */}
        {getTabContent()}
      </div>
    </>
  );
}
