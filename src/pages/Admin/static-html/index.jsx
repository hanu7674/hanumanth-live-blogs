// StaticHtml.js
import React, { useEffect, useState } from 'react';

const StaticHtml = () => {
    useEffect(() => {
        // Redirect to the app/dashboard.html
        window.location.href = '/static-html'; // Update the path
      }, []);
    
      return (
        <div>
          <h2>Redirecting...</h2>
        </div>
      );
};

export default StaticHtml;
