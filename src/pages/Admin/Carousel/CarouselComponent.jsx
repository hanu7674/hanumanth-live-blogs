import React, { useState, useEffect } from 'react';
import AwesomeSlider from 'react-awesome-slider';
import withCaption from 'react-awesome-slider/dist/index';
import LetteringHoc from 'react-awesome-slider/src/hoc/animated-lettering/hoc';
HOC for Captioned images
const withCaptionedImages = (WrappedComponent) => {
  // Your logic for Captioned images HOC goes here
  // For example, you can use context, state, or other logic

  return (props) => {
    return <WrappedComponent {...props}  />;
  };
};

// HOC for Smooth lettering
const withSmoothLettering = (props) => {
  // Your logic for Smooth lettering HOC goes here
  // For example, you can use context, state, or other logic

  return (props) => {
    return <LetteringHoc {...props}  />;
  };
};

// HOC for Autoplay
const withAutoplay = (WrappedComponent) => {
  // Your logic for Autoplay HOC goes here
  // For example, you can use context, state, or other logic
  const [autoplay, setAutoplay] = useState(true);

  return (props) => {
    return <WrappedComponent {...props} autoplay={autoplay} />;
  };
};

export default CarouselComponent = ({ selectedHOC }) => {
  // State to keep track of the selected HOC
  const [hocComponent, setHOCComponent] = useState(null);

  // Effect to update the hocComponent when the selectedHOC changes
  useEffect(() => {
    switch (selectedHOC) {
      case 'Captioned images HOC':
        setHOCComponent(withCaptionedImages);
        break;
      case 'Smooth lettering HOC':
        setHOCComponent(withSmoothLettering);
        break;
      case 'Autoplay HOC':
        setHOCComponent(withAutoplay);
        break;
      default:
        setHOCComponent(null);
    }
  }, [selectedHOC]);

  const WrappedCarousel = hocComponent ? hocComponent(AwesomeSlider) : AwesomeSlider;

  return (
    <WrappedCarousel>
      <div data-src="/path/to/image-0.png" />
      <div data-src="/path/to/image-1.png" />
      <div data-src="/path/to/image-2.jpg" />
    </WrappedCarousel>
  );
};
