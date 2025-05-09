import React, { useEffect, useState } from "react";
import { SketchPicker } from "react-color";

const ColorPicker = ({ setSchoolColor, schoolColor }) => {
  const [darkColor, setDarkColor] = useState("#000000");
  const [lightColor, setLightColor] = useState("#ffffff");

  /* useEffect(() => {
    setDarkColor(schoolColor?.darkColor);
    setLightColor(schoolColor?.lightColor);
  }, [schoolColor]); */

  // Function to ensure selected color is dark
  const handleDarkColorChange = (color) => {
    const { r, g, b } = color.rgb;
    const brightness = r * 0.299 + g * 0.587 + b * 0.114; // Luminance formula
    if (brightness < 100) {
      setDarkColor(color.hex);
      setSchoolColor((prev) => ({ ...prev, darkColor: color?.hex }));
    }
  };

  // Function to ensure selected color is light
  const handleLightColorChange = (color) => {
    const { r, g, b } = color.rgb;
    const brightness = r * 0.299 + g * 0.587 + b * 0.114; // Luminance formula
    if (brightness > 150) {
      setLightColor(color.hex);
      setSchoolColor((prev) => ({ ...prev, lightColor: color?.hex }));
    }
  };

  return (
    <div className="color-picker-container">
      <div className="color-pickers">
        <p>Dark Color Picker</p>
        <SketchPicker color={darkColor} onChange={handleDarkColorChange} />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <p>Selected Dark Color: </p>
          <div
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: schoolColor?.darkColor,
              border: "2px solid #fff",
            }}
          ></div>
        </div>
      </div>
      <div className="color-pickers">
        <p>Light Color Picker</p>
        <SketchPicker color={lightColor} onChange={handleLightColorChange} />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <p>Selected Light Color: </p>
          <div
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: schoolColor?.lightColor,
              border: "2px solid #fff",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
