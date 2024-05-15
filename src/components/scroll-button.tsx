import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { MoveDownIcon } from 'lucide-react';

const ScrollButton = () => {
    const [isVisible, setIsVisible] = useState(false);
    const prevScrollPos = useRef(0);
  
    const scrollToBottom = () => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth"
      });
    };
  
    useEffect(() => {
      const toggleVisibility = () => {
        const currentScrollPos = window.pageYOffset;
  
        // Button is displayed after user has started scrolling down
        setIsVisible(currentScrollPos < prevScrollPos.current);
  
        prevScrollPos.current = currentScrollPos;
      };
  
      window.addEventListener("scroll", toggleVisibility);
  
      return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);
 
    return (
        <div className={`mb-2 ${isVisible ? 'visible' : 'invisible'}`}>
            <Button className="rounded-full" size="icon" variant="outline" onClick={scrollToBottom}>
                <MoveDownIcon className="h-4 w-4" />
            </Button>
        </div>
    );
}
 
export default ScrollButton;
