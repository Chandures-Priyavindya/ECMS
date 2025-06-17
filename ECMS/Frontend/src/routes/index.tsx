import type { RouteObject } from "react-router-dom"
import EnergyTracker from "../pages/EnergyTracker"


export const routes: RouteObject[] = [
  {
    
    path: "/energy-tracker",
    element: <EnergyTracker/>,
  },
  
]
