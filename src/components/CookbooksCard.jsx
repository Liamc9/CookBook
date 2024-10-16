import React from "react";
import { Link } from "react-router-dom";
import { ForkAndKnifeIcon, UserIcon2 } from "../assets/Icons";

export default function CookbooksCard({ cookbook }) {
  const { title, imageUrl, chef, recipes, cuisine } = cookbook;

  return (
    <Link to={`/cookbooks/${cookbook.id}`} className="max-w-2xl flex flex-row rounded overflow-hidden shadow-lg bg-white">
      {/* Image on the left/top */}
      <div className="w-1/3">
        <img className="h-full w-full object-cover" src={imageUrl} alt={title} />
      </div>

      {/* Details on the right/bottom */}
      <div className=" w-2/3 p-2 flex flex-col justify-between">
        {/* Cookbook details */}
        <div>
          {/* Title */}
          <h2 className="font-bold text-2xl mb-2">{title}</h2>

          {/* Chef */}
          <p className="flex flex-row items-center text-gray-700 text-base mb-1">
            <UserIcon2 className='w-6 h-6 mr-2'/> {chef}
          </p>

          {/* Cuisine */}
          <p className="flex flex-row items-center text-gray-700 text-base mb-1">
            <ForkAndKnifeIcon className='w-6 h-6 mr-2'/> {cuisine}
          </p>

          {/* Number of recipes */}
          <p className="flex flex-row items-center text-gray-700 text-base mb-1">
            <ForkAndKnifeIcon className='w-6 h-6 mr-2'/> {recipes.length} Recipes
          </p>
        </div>
      </div>
    </Link>
  );
}
