import { useEffect } from 'react';
import { UseIntersectionObserverType } from '../@types/common';

export const useIntersectionObserver: UseIntersectionObserverType = ({ parentElement, targetElement, onIntersectHandler, intersectionThreshold = 1.0, parentMargin = '0px', enabled = true }) => {
  useEffect(() => {
    if (!enabled) return;

    // using IntersectionObserver browseer api
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => entry.isIntersecting && onIntersectHandler()),
      {
        root: parentElement && parentElement.current,  //assuming its a ref
        rootMargin: parentMargin,
        threshold: intersectionThreshold
      }
    );

    const element = targetElement && targetElement.current;  //assuming its a ref

    if (!element) return;

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  },
    [enabled, intersectionThreshold, onIntersectHandler, parentElement, parentMargin, targetElement]);
};
