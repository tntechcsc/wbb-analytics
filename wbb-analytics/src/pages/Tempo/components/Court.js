import React, { useState } from "react";
import "./Court.css";
import basketballCourtVector from "./basketball-court-vector.jpg";
import ShotPopup from "./ShotPopup";



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
      { name: "3", shape: "poly", coords: [45,3,53,83,210,83,210,3], fillColor: "#4f2984"  },
      { name: "2", shape: "poly", coords: [385,3,385,83,545,83,553,3], fillColor: "#4f2984"  },
      { name: "1", shape: "poly", coords: [210,3,210,235,385,235,385,3], fillColor: "#4f2984"  },
      { name: "5", shape: "poly", coords: [53,83,210,83,210,235,300,235,300,318,240,312,230,310,218,305,173,285,140,260,115,235,100,210,85,185,75,160], fillColor: "#4f2984" },
      { name: "4", shape: "poly", coords: [56,83,215,83,215,235,300,235,300,318,240,312,230,310,218,305,173,285,140,260,115,235,100,208,85,175,75,150].map((n, i, arr) => (i % 2 === 0 ? 600 - n : n)), fillColor: "#4f2984"  },
      { name: "8", shape: "poly", coords: [160,280, 0,550, 600,550, 445,275, 410,295, 360,315, 300,320, 245,315, 195,299], fillColor: "#4f2984"  },
      { name: "7", shape: "poly", coords: [0,3, 45,3, 53,83, 70,155, 80,180, 90,200, 100,220 , 110,235, 120,245, 130,255, 140,265, 160,280, 0,550], fillColor: "#4f2984"},
      { name: "6", shape: "poly", coords: [600,3, 553,3, 545,83, 534,130, 520,170, 490,220, 445,275, 600,550], fillColor: "#4f2984"},

      ]
  };

  const clicked = (area) => {
    console.log(area);
    handleCourtClick(area.name);

  };

  return (
    <div className="grid">
      <div className="presenter"> 
        <div style={{ position: "relative" }}>
          
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
