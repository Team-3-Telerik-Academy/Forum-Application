import { createContext } from "react";

const AppContext = createContext({
  isRegistered: false,
  setRegistered: () => {},
  isLogged: true,
  setIsLogged: () => {},
  user: null,
  userData: null,
  setContext() {},
});

export default AppContext;
