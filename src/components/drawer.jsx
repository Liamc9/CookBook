import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const Drawer = ({ title, isVisible, toggleVisibility, children }) => {
  return (
    <div
      className={`absolute bottom-0 left-0 w-full h-[400px] bg-white p-4 border-t rounded-t-lg transition-transform transform ${isVisible ? 'translate-y-[20%]' : 'translate-y-[100%]'} z-10`}
    >
      <div className="flex justify-between items-center ">
        <h3 className="text-xl font-bold">{title}</h3>
        <button onClick={toggleVisibility} className="focus:outline-none">
          {isVisible ? <FaArrowDown /> : <FaArrowUp />}
        </button>
      </div>
      <div className="overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default Drawer;
