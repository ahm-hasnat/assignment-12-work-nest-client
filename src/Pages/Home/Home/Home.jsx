import React from 'react';
import Slider from '../../../Components/Slider/Slider';
import BestWorkers from '../../../Components/BestWorkers/BestWorkers';
import Testimonials from '../../../Components/Testimonials/Testimonials';
import FAQ from '../../../Components/FAQ/FAQ';
import Stats from '../../../Components/Stats/Stast';
import Blog from '../../../Components/Blogs/Blog';
import Partners from '../../../Partners/Partners';
import HowItWorks from '../../../Components/HowItWorks/HowItWorks';

const Home = () => {
    return (
        <div className="bg-white">
            <Slider></Slider>
            <HowItWorks></HowItWorks>
            <BestWorkers></BestWorkers>
           
            <Testimonials></Testimonials>
             <Partners></Partners>
            <Blog></Blog>
             <FAQ></FAQ>
              <Stats></Stats>
        </div>
    );
};

export default Home;