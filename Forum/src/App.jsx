import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Components/Home/Home";
import SignIn from "./Components/Views/SignIn/SignIn";
import SignUp from "./Components/Views/SignUp/SignUp";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />}/>
        <Route path="/" element={<Home />}/>
        <Route path="/sign-in" element={<SignIn />}/>
        <Route path="/sign-up" element={<SignUp />}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
