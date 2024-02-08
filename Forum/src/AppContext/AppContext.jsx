import { createContext } from "react";

const AppContext = createContext({
    isRegistered: false,
    setRegistered: () => {},
})

export default AppContext;