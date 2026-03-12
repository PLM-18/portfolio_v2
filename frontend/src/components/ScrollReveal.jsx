import { useEffect, useRef, useState } from 'react';

const ScrollReveal = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // The Intersection Observer detects when the element enters the screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Unobserve after it becomes visible so it only animates once
          observer.unobserve(entry.target); 
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.15, // Triggers when 15% of the element is visible
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      // Tailwind classes handle the transition smoothly
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24'
      }`}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;