import React from 'react';
import Spline from '@splinetool/react-spline';

export default function Spline3DBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-transparent">
      <Spline 
        scene="https://prod.spline.design/6Wq1Q7YGeNF99q2N/scene.splinecode" 
        className="w-full h-full object-cover"
      />
    </div>
  );
}
