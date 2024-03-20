import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

// Get a reference to the root DOM node
const rootElement = document.getElementById('root');
// Create a root
const root = createRoot(rootElement);
// Initial render: Render the <App> into the root
// Add this in node_modules/react-dom/index.js
window.React1 = require('react');

// Add this in your component file
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);

root.render(
    
    <Router>
        <App />
    </Router>
);