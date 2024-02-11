import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import SignIn from "./Components/Views/SignIn/SignIn";
import SignUp from "./Components/Views/SignUp/SignUp";
import AppContext from "./AppContext/AppContext";
import { useEffect, useState } from "react";
import Footer from "./Components/Footer/Footer";
import { useAuthState } from "react-firebase-hooks/auth";
import { getUserData } from "./services/users.service";
import { auth } from "./config/firebase-config";
import Home from "./Components/Views/Home/Home";
import CreatePost from "./Components/Views/CreatePost/CreatePost";
import Posts from "./Components/Views/Posts/Posts";
import Post from "./Components/Views/Post/Post";
import NotFound from "./Components/Views/NotFound/NotFound";
import AdminDashboard from "./Components/Views/AdminDashboard/AdminDashboard";

const App = () => {
  const [user, loading, error] = useAuthState(auth);
  const [isRegistered, setRegistered] = useState(false);
  // const [isLogged, setIsLogged] = useState(true);
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });

  if (appState.user !== user) {
    setAppState({ user });
  }

  useEffect(() => {
    if (user === null) return;

    getUserData(user.uid)
      .then((snapshot) => {
        if (!snapshot.exists()) {
          throw new Error("Something went wrong!");
        }

        setAppState({
          ...appState,
          userData: snapshot.val()[Object.keys(snapshot.val())[0]],
        });
      })
      .catch((e) => alert(e.message));
  }, [user]);

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
          <Route path="/create-new-post" element={<CreatePost />} />
          <Route path="/:type" element={<Posts />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
        <Footer />
      </AppContext.Provider>
    </BrowserRouter>
  );
};

export default App;
