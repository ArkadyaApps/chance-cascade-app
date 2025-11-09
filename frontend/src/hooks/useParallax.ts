import { useEffect, useState, RefObject } from "react";

interface ParallaxOptions {
  speed?: number;
  direction?: 'vertical' | 'horizontal';
}

export const useScrollParallax = (options: ParallaxOptions = {}) => {
  const { speed = 0.5, direction = 'vertical' } = options;
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      setOffset(scrolled * speed);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return direction === 'vertical' 
    ? { transform: `translateY(${offset}px)` }
    : { transform: `translateX(${offset}px)` };
};

interface MouseParallaxOptions {
  intensity?: number;
  ref: RefObject<HTMLElement>;
}

export const useMouseParallax = (options: MouseParallaxOptions) => {
  const { intensity = 20, ref } = options;
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;
      
      setPosition({
        x: deltaX * intensity,
        y: deltaY * intensity,
      });
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [intensity, ref]);

  return {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    transition: 'transform 0.3s ease-out',
  };
};
