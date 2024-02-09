import { createContext } from "react";

const AppContext = createContext({
  isRegistered: false,
  setRegistered: () => {},
  isLogged: true,
  setIsLogged: () => {},
  user: null,
  userData: null,
  setContext() {
    // real implementation comes from App.jsx
  },
});

export default AppContext;
