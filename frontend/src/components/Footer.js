import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">The News Scraper</h3>
            <p className="text-gray-400">Your personalized news aggregator</p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
            <div>
              <h4 className="font-semibold">Sources</h4>
              <ul className="text-gray-400">
                <li>WION</li>
                <li>Firstpost</li>
                <li>NDTV</li>
                <li>The Wire</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold">Categories</h4>
              <ul className="text-gray-400">
                <li>Tech</li>
                <li>Politics</li>
                <li>Sports</li>
                <li>Business</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} The News Scraper. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
