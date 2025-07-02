declare module "*.jsx" {
  import React from "react";
  export const Card: React.FC<any>;
  export const CardContent: React.FC<any>;
  export const Button: React.FC<any>; // if you have button.jsx too
}
