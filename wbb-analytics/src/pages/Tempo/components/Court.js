import React, { useState } from "react";
import "./Court.css";
import ImageMapper from "react-img-mapper";
import basketballCourtVector from "./basketball-court-vector.jpg";
import ShotPopup from "./ShotPopup";

//export zone variable to be used in ShotPopup.js
// export let zone = null;

//ES6 way
const Court = (props) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);

  const handleOverlayClick = () => {
    setIsPopupOpen(false);
};

      // Handle player click for substitution
  const handleCourtClick = (area) => {
      console.log(`Player ${area} clicked for substitution`);
      setSelectedZone(area);
      setIsPopupOpen(true);
  };

  let MAP2 = {
    name: "my-map",
    areas: [
      { name: "3", shape: "poly", coords: [49,3,58,79,210,79,210,3], fillColor: "#4f2984", preFillColor:"rgba(52, 52, 52, 0.2)", strokeColor: "green"},
      { name: "2", shape: "poly", coords: [385,3,385,83,540,83,548,3], fillColor: "#4f2984", preFillColor:"rgba(52, 52, 52, 0.2)", strokeColor: "green"},
      { name: "1", shape: "poly", coords: [215,3,215,230,380,230,380,3], fillColor: "#4f2984", preFillColor: "rgba(52, 52, 52, 0.2)", strokeColor: "purple"},
      { name: "5", shape: "poly", coords: [56,83,210,83,210,235,300,235,300,316,245,312,239,310,220,305,176,285,140,260,115,235,100,210,85,185,75,160, 65,120], fillColor: "#4f2984", preFillColor: "rgba(52, 52, 52, 0.2)", strokeColor: "red" },
      { name: "4", shape: "poly", coords: [60,83,215,83,215,235,300,235,300,316,240,310,238,310,218,302,173,280,149,264,129,238,100,196,85,170,75,145].map((n, i, arr) => (i % 2 === 0 ? 600 - n : n)), fillColor: "#4f2984", preFillColor: "rgba(52, 52, 52, 0.2)", strokeColor: "red"},
      { name: "8", shape: "poly", coords: [160,280, 0,550, 600,550, 445,275, 410,295, 360,315, 300,320, 245,315, 195,299], fillColor: "#4f2984", preFillColor: "rgba(52, 52, 52, 0.2)", strokeColor: "blue" },
      { name: "7", shape: "poly", coords: [0,3, 45,3, 53,83, 70,155, 80,180, 90,200, 100,220 , 110,235, 120,245, 130,255, 140,265, 160,280, 0,550], fillColor: "#4f2984", preFillColor: "rgba(52, 52, 52, 0.2)", strokeColor: "blue" },
      { name: "6", shape: "poly", coords: [600,3, 553,3, 545,83, 534,130, 520,170, 490,220, 445,275, 600,550], fillColor: "#4f2984", preFillColor: "rgba(52, 52, 52, 0.2)", strokeColor: "blue" },

      ]
  };

  const clicked = (area) => {
    console.log(area);
    handleCourtClick(area.name);
  

  };

  //zone = area.name;

  return (
    <div className="grid">
      <div className="presenter"> 
        <div style={{ position: "relative" }}>
          <ImageMapper
            src={basketballCourtVector}
            map={MAP2}
            width={600}
            height={550}
            lineWidth={5}
            strokeColor={"white"}
            onClick={(area) => clicked(area)}
            
          />
          {isPopupOpen && (
            <>
              <div className="Overlay" onClick={handleOverlayClick}></div>
              <ShotPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                selectedZone={selectedZone}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Court;