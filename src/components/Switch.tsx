import { useEffect, useState } from "react";
import classNames from "classnames";

interface SwitchProps {
  isOn: boolean;
  handleToggle: () => void;
}

export default function Switch({ isOn, handleToggle }: SwitchProps) {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    // Set a delay before enabling animation to avoid initial load animation
    const timeoutId = setTimeout(() => setShouldAnimate(true), 100); // delay by 100ms to avoid animation on load

    return () => clearTimeout(timeoutId); // Cleanup timeout on component unmount
  }, []);

  return (
    <div
      onClick={handleToggle}
      className={classNames(
        "flex w-10 h-5 bg-blue-900 rounded-full transition-all duration-300 shadow-lg cursor-pointer",
        {
          "bg-sky-400": isOn, // Color from the first version for 'on' state
        }
      )}
    >
      <span
        className={classNames(
          "h-5 w-5 bg-white rounded-full transform", // Adjusted size and common styles
          {
            "translate-x-5": isOn, // Handle position for 'on' state
            "transition-all duration-300": shouldAnimate, // Enable transition after initial load
          }
        )}
      />
    </div>
  );
}
