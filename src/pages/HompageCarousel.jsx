import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCarouselItems, fetchCarouselSettings } from "../redux/carousel";
import Loading from "../components/Loading/loading";
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/custom-animations/cube-animation.css';
import 'react-awesome-slider/dist/custom-animations/fall-animation.css';
import 'react-awesome-slider/dist/custom-animations/fold-out-animation.css';
import 'react-awesome-slider/dist/custom-animations/open-animation.css';
import 'react-awesome-slider/dist/custom-animations/scale-out-animation.css';
import 'react-awesome-slider/dist/captioned.css';
import 'react-awesome-slider/dist/lettering.css';
import 'react-awesome-slider/dist/styles.css';
const HomePageCarousal = () => {
  const loading = useSelector((state) => state.carousel.loading);
  const carouselItems = useSelector((state) => state.carousel.carouselItems);
  const carouselSettings = useSelector((state) => state.carousel.carouselSettings);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch carousel items when the component mounts
    dispatch(fetchCarouselItems());
    dispatch(fetchCarouselSettings());
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <AwesomeSlider style={carouselSettings} {...carouselSettings}>
    {carouselItems?.map((item, index) => (
          <div data-src={item.imageUrl} alt={item.title} key={index}>
          </div>
          ))}
  </AwesomeSlider>
      )}
    </>
  );
}
export default HomePageCarousal;