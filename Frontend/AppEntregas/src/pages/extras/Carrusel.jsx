// src/TextCarousel.js
import React, { useState, useEffect } from 'react';
import '../../css/TextCarrusel.css'

const texts = [
    "Gestionar tus clientes y repartidores",
    "Seguir tu paquete en cualquier momento",
    "Revisar el historial de tus envios",
    "Gestionar tus repartidores",
  ];
  
  const TextCarrusel = () => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
    const selectText = (index) => {
      setCurrentTextIndex(index);
    };
  
    return (
      <div className="carrusel">
        <h2>{texts[currentTextIndex]}</h2>
        <div className="ButtonCarru">
          {texts.map((text, index) => (
            <button key={index} onClick={() => selectText(index)}>
               {index + 1}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  export default TextCarrusel;