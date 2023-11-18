// HomePage.js

import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <Link to="/players">Go to Players Page</Link>
    </div>
  );
};

export default HomePage;