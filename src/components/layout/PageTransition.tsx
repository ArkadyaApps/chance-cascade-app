import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("enter");

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage("exit");
    }
  }, [location, displayLocation]);

  return (
    <div
      className={`${
        transitionStage === "exit" ? "animate-page-exit" : "animate-page-enter"
      }`}
      onAnimationEnd={() => {
        if (transitionStage === "exit") {
          setTransitionStage("enter");
          setDisplayLocation(location);
        }
      }}
    >
      {children}
    </div>
  );
};
