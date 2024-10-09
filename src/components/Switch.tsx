import { useState } from "react";
import classNames from "classnames";

export default function Switch() {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <div
      onClick={() => setIsSelected(!isSelected)}
      className={classNames(
        "flex w-10 h-5 bg-blue-900 rounded-full transition-all duration-300 shadow-lg cursor-pointer", // Adjusted width and height
        {
          "bg-sky-400": isSelected,
        }
      )}
    >
      <span
        className={classNames(
          "h-5 w-5 bg-white rounded-full transition-all duration-300", // Adjusted size of the inner switch
          {
            "ml-5": isSelected, // Reduced margin for selected state
          }
        )}
      />
    </div>
  );
}
