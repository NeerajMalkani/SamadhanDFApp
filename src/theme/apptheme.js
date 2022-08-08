import { DefaultTheme } from "react-native-paper";
export const theme = {
  version: 3,
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#009e59", //"#43936b", //"#2196f3", //"#473f97",
    primary2: "#64b5f6",
    secondary: "#b11313",
    accent: "#43936b",
    error: "#B00020",
    success: "#198754",
    snackbar: "#333333",
    text: "#101010",
    textSecondary: "#7d7d7d",
    textfield: "#bfbfbf",
    textLight: "#ffffff",
    textLightSecondary: "#dedede",
    border: "#ededed",
    backgroundSecondary: "#f1f1f1",
  },
  multicolors: {
    red: "#ff5959",
    green: "#4cd97b",
    yellow: "#db8b2f",
    blue: "#4cb5ff",
  },
};
