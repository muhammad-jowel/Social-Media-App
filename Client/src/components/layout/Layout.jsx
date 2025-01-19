import React from "react";
import TopHeader from "./TopHeader";
import LeftNavbar from "./LeftNavbar";
import RightNavbar from "./RightNavbar";

const Layout = (props) => {
  return (
    <div className="h-screen flex flex-col">
      <TopHeader />
      <div className="container flex flex-1 mt-4 mx-auto space-x-4 px-3 overflow-hidden">

        <div className="lg:w-1/5">
          <LeftNavbar />
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {props.children}
        </div>

        <div className="lg:w-1/5">
          <RightNavbar />
        </div>
      </div>
    </div>
  );
};

export default Layout;
