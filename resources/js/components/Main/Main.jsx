import React from 'react';
const Main = ({ children, className = '' }) => {
    return (
      <main className={className}>
        {children}
      </main>
    );
  };
  
export default Main;
  