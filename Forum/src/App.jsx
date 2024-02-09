import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Components/Home/Home";
import SignIn from "./Components/Views/SignIn/SignIn";
import SignUp from "./Components/Views/SignUp/SignUp";
import AppContext from "./AppContext/AppContext";
import { useState } from "react";
import Footer from "./Components/Footer/Footer";

const App = () => {
  const [isRegistered, setRegistered] = useState(false);
  // const [isLogged, setIsLogged] = useState(true);
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });

  return (
    <BrowserRouter>
      <AppContext.Provider
        value={{
          isRegistered,
          setRegistered,
          // isLogged,
          // setIsLogged,
          ...appState,
          setContext: setAppState,
        }}
      >
        <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/create-new-post" element={<SignUp />} />
        </Routes>
        <Footer />
      </AppContext.Provider>
    </BrowserRouter>
  );
};

export default App;
