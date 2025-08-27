declare module '@env' {
  export const API_URL: string;
  export const NODE_ENV: string;
  // Add all your .env variables here
  export const GOOGLE_CLIENT_ID: string;
}
declare module "*.svg" {
  import * as React from "react";
  // import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}