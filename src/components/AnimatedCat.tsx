export function AnimatedCat() {
  return (
    <svg width="40" height="40" viewBox="0 0 120 100" className="opacity-90 inline-block mr-2" aria-label="Animated Cat">
      {/* Body */}
      <path d="M 20 80 Q 20 40 50 40 Q 80 40 80 80 L 20 80 Z" fill="transparent" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Ears */}
      <path d="M 20 40 L 25 15 L 40 30 M 80 40 L 75 15 L 60 30" fill="transparent" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Eyes */}
      <circle cx="35" cy="55" r="3" fill="#1a1a1a" />
      <circle cx="65" cy="55" r="3" fill="#1a1a1a" />
      {/* Nose/Mouth */}
      <path d="M 45 65 L 50 70 L 55 65" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Whiskers */}
      <path d="M 10 50 L 25 55 M 5 60 L 25 60 M 10 70 L 25 65" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
      <path d="M 90 50 L 75 55 M 95 60 L 75 60 M 90 70 L 75 65" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
      {/* Tail that wags */}
      <path d="M 80 75 Q 110 75 110 45" fill="none" stroke="#1a1a1a" strokeWidth="3.5" strokeLinecap="round">
        <animateTransform 
          attributeName="transform" 
          type="rotate" 
          values="0 80 75; 25 80 75; 0 80 75" 
          dur="2s" 
          repeatCount="indefinite" 
        />
      </path>
    </svg>
  );
}
