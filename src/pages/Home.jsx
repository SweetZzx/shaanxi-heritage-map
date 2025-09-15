// src/pages/Home.jsx
import React from "react";
import Map from "../components/Map";
import SideMenu from "../components/SideMenu";

function Home() {
  return (
    <div className="w-screen h-screen relative overflow-hidden bg-slate-900">
      {/* <SideMenu /> */}
      <Map />
    </div>
  );
}

export default Home;
