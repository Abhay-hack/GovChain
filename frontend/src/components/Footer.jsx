import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white text-center p-4 mt-6 shadow-md">
      <p className="text-sm">&copy; 2025 GovChain. All rights reserved.</p>
      <p className="mt-2">
        <a 
          href="https://github.com/your-repo" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-400 hover:text-blue-500 transition"
        >
          GitHub
        </a> 
        <span className="mx-2">|</span>
        <a href="/terms" className="text-blue-400 hover:text-blue-500 transition">Terms</a>
        <span className="mx-2">|</span>
        <a href="/privacy" className="text-blue-400 hover:text-blue-500 transition">Privacy</a>
      </p>
    </footer>
  );
}

export default Footer;
