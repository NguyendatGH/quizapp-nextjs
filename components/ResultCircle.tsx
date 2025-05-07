import React, { useEffect, useState } from "react";

type Props = {
  correct: number;
  total: number;
};

const ResultCircle: React.FC<Props> = ({ correct, total }) => {
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const progress = correct / total;

  const [dashOffset, setDashOffset] = useState(circumference);

  useEffect(() => {
    // Animate on mount
    setTimeout(() => {
      setDashOffset(circumference * (1 - progress));
    }, 100);
  }, [circumference, progress]);

  return (
    <div className="relative w-[120px] h-[120px] group flex justify-center items-center my-6">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        {/* Background Circle */}
        <circle
          stroke="#e5e7eb" // Tailwind gray-200
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress Circle */}
        <circle
          stroke="#3b82f6" // Tailwind blue-500
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-1000 ease-in-out group-hover:stroke-blue-600"
        />
      </svg>
      {/* Centered Text */}
      <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-gray-800">
        {correct}/{total}
      </div>
    </div>
  );
};

export default ResultCircle;
