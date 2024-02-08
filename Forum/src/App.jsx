import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Components/Home/Home";
import SignIn from "./Components/Views/SignIn/SignIn";
import SignUp from "./Components/Views/SignUp/SignUp";
import AppContext from "./AppContext/AppContext";
import { useState } from "react";

const App = () => {
  const [isRegistered, setRegistered] = useState(false);

  return (
    <BrowserRouter>
      <AppContext.Provider value={{isRegistered, setRegistered}}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </AppContext.Provider>
    </BrowserRouter>
  );
};

export default App;
