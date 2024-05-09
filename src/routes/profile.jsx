import { useState, useEffect } from 'react';

export default function Profile() {
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
                return <div className="text-center p-4">This will be like a social media style feed where the creators post are</div>;
            case 2:
                return <div className="text-center p-4">This will be the CookBook where the creators recipes are. You have to subscribe to see.</div>;
            case 3:
                return <div className="text-center p-4">Content for Tab 3</div>;
            default:
                return <div className="text-center p-4">Content for Tab 1</div>;
        }
    };

    // HTML
    return (
        <>
            <div className="flex flex-col items-center w-full min-h-screen">
                <div className="w-full h-64 bg-gray-200 relative items-center">
                    <div className="w-32 h-32 bg-gray-300 rounded-full overflow-hidden border-4 border-black absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4">
                    </div>
                </div>
                <h1 className="text-3xl font-bold mt-10">John Doe</h1>
                <p className="text-gray-500">Software Engineer</p>
                {/* Tabs Section */}
                <div className="w-full px-4 py-2 flex justify-around items-center bg-white shadow-lg">
                    <div onClick={() => handleTabClick(1)} className="tab text-center cursor-pointer">
                        <p className="text-sm text-gray-700 hover:text-blue-500">My Feed</p>
                    </div>
                    <div onClick={() => handleTabClick(2)} className="tab text-center cursor-pointer">
                        <p className="text-sm text-gray-700 hover:text-blue-500">Cookbook</p>
                    </div>
                    <div onClick={() => handleTabClick(3)} className="tab text-center cursor-pointer">
                        <p className="text-sm text-gray-700 hover:text-blue-500">Other</p>
                    </div>
                </div>
                {/* Dynamic Content Based on Active Tab */}
                {getTabContent()}
            </div>
        </>
    );
}
