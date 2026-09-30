import React from 'react';

const Title = ({ title, titlesStyles = "" }) => {
  return (
    <div className={`mb-12 ${titlesStyles}`}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-primary tracking-tight">
        {title}
      </h2>
      <div className="w-16 h-1 bg-tertiary rounded-full mx-auto mt-3" />
    </div>
  );
};

export default Title;
