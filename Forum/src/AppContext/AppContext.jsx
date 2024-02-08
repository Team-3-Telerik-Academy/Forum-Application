import { createContext } from "react";

const AppContext = createContext({
    isRegistered: false,
    setRegistered: () => {},
    isLogged: true,
    setIsLogged: () => {},
})

export default AppContext;