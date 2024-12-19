"use client";

import Image from "next/image";
import React, { useState } from "react";
import { CarouselItem } from "../types";

type ImageCarouselProps = {
  items: CarouselItem[];
};

const ImageCarousel: React.FC<ImageCarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="overflow-hidden rounded-lg shadow-lg">
        <div className="relative h-64 md:h-96">
          <Image
            src={items[currentIndex].imagePath}
            alt={`Slide ${currentIndex + 1}`}
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white">
            <p>{items[currentIndex].text}</p>
          </div>
        </div>
      </div>
      <button
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2"
        onClick={goToPrevious}
      >
        &#10094;
      </button>
      <button
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2"
        onClick={goToNext}
      >
        &#10095;
      </button>
    </div>
  );
};

export default ImageCarousel;
