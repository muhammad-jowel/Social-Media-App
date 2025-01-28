import React from 'react';
import Layout from '../components/layout/layout';
// import PostInput from '../components/Home/PostInput';
import PostSection from '../components/Home/PostSection';

const HomePage = () => {
    return (
        <Layout>
            {/* <PostInput/> */}
            <PostSection/>
        </Layout>
    );
};

export default HomePage;