"use client"

import React from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface VolumeControlProps {
  volume: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  onIncrease,
  onDecrease,
}) => {
  return (
    <div className="radio-volume-control">
      <button
        aria-label="Volume up"
        onClick={onIncrease}
        className="radio-volume-btn"
      >
        <ChevronUp size={14} />
      </button>
      <span className="radio-volume-value">
        {volume}%
      </span>
      <button
        aria-label="Volume down"
        onClick={onDecrease}
        className="radio-volume-btn"
      >
        <ChevronDown size={14} />
      </button>
    </div>
  );
};

export default VolumeControl;
