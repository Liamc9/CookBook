import React from 'react';
import { Link } from 'react-router-dom';

const More = () => {
  return (
    <div className='mt-20 flex flex-column text-white gap-4'>
      <Link to="/chefhub/dashboard"><button className='bg-blue-500'>Become a Chef!</button></Link>
      <Link to="/page2"><button className='bg-blue-500' >Edit Profile</button></Link>
      <Link to="/page3"><button className='bg-blue-500'>Manage Subscriptions</button></Link>
      <Link to="/page4"><button className='bg-blue-500'>Update Card Details</button></Link>
      <Link to="/page5"><button className='bg-red-500'>Sign Out</button></Link>
    </div>
  );
};

export default More;
