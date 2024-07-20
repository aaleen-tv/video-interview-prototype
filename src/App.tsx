import "./App.css";
import * as React from 'react';
import Screening from "./Screens/Screening";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import GetStarted from "./Screens/GetStarted";
import Test from "./Screens/Test";
import TestAI from "./Screens/TestAI";

const App: React.FC = () => {
  return (
    <div style={{ width: "100vw", height: '100vh', }}>
      <Router>
        <Routes>
          <Route path="/" element={<TestAI/>} />
          {/* <Route path="/" element={<Test />} /> */}
          <Route path="/" element={<GetStarted />} />
          <Route path="/screening" element={<Screening />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
