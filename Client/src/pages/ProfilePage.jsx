import React from 'react';
import Layout from '../components/layout/layout';
import Profile from '../components/profile/Profile';
import MyPostSection from '../components/profile/MyPosts';

const ProfilePage = () => {
    return (
        <Layout>
            <Profile/>
            <MyPostSection/>
        </Layout>
    );
};

export default ProfilePage;