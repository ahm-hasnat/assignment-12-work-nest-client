import React from 'react';
import Slider from '../../../Components/Slider/Slider';
import BestWorkers from '../../../Components/BestWorkers/BestWorkers';
import Testimonials from '../../../Components/Testimonials/Testimonials';
import FAQ from '../../../Components/FAQ/FAQ';
import Stats from '../../../Components/Stats/Stast';

const Home = () => {
    return (
        <div>
            <Slider></Slider>
            <BestWorkers></BestWorkers>
            <Testimonials></Testimonials>
            <FAQ></FAQ>
            <Stats></Stats>
        </div>
    );
};

export default Home;