import React from 'react';
import Slider from '../../../Components/Slider/Slider';
import BestWorkers from '../../../Components/BestWorkers/BestWorkers';
import Testimonials from '../../../Components/Testimonials/Testimonials';
import FAQ from '../../../Components/FAQ/FAQ';
import Stats from '../../../Components/Stats/Stast';
import Blog from '../../../Components/Blogs/Blog';

const Home = () => {
    return (
        <div>
            <Slider></Slider>
            <BestWorkers></BestWorkers>
            <Testimonials></Testimonials>
            <Blog></Blog>
             <FAQ></FAQ>
              <Stats></Stats>
        </div>
    );
};

export default Home;