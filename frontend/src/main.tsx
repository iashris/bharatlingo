import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App.tsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./Home.tsx";
import { SongActivity } from "./SongActivity.tsx";
import YouTubeAnnotation from "./components/YTEditor";
import { About } from "./About.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<SongActivity />} path="/song" />
        <Route element={<YouTubeAnnotation />} path="/annotate" />
        <Route element={<About />} path="/about" />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
