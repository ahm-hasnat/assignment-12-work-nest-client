import React from 'react';
import Navbar from '../Components/Header/Navbar';
import Profile from '../Pages/Profile/Profile';
import DashFooter from '../Components/DashFooter/DashFooter';

const profile = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Profile></Profile>
            <DashFooter></DashFooter>
        </div>
    );
};

export default profile;