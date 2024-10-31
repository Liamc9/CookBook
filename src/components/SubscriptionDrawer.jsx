import React from "react";

const SubscriptionDrawer = ({ isOpen, closeDrawer, children }) => {
  return (
    <div
      className={`fixed inset-0 z-50 transition-transform duration-300 ${
        isOpen ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="absolute inset-0 bg-black opacity-50" onClick={closeDrawer}></div>
      <div className="relative bg-white p-6 h-1/3 rounded-t-xl shadow-lg">
        {children}
        <button
          className="absolute top-2 right-2 text-gray-500"
          onClick={closeDrawer}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SubscriptionDrawer;
