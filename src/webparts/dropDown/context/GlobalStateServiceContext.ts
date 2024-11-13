import * as React from "react";
import { GlobalStateService } from "./GlobalStateService";

// Create a React context for GlobalStateService
export const GlobalStateServiceContext = React.createContext<
  GlobalStateService | undefined
>(undefined);
