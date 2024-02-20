import { createContext } from "react";

/**
 * @fileoverview Defines the AppContext component.
 * @module AppContext
 */

/**
 * Context object for the application.
 * @typedef {Object} AppContext
 * @property {Object} user - The user object.
 * @property {Object} userData - The user data object.
 * @property {Function} setContext - Function to update the context.
 */

const AppContext = createContext({
  user: null,
  userData: null,
  setContext() {},
});

export default AppContext;
