import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

// Get a reference to the root DOM node
const rootElement = document.getElementById('root');
// Create a root
const root = createRoot(rootElement);
// Initial render: Render the <App> into the root
root.render(
  <Router>
    <App />
  </Router>
);