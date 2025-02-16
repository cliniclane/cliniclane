import { Atkinson_Hyperlegible, Merriweather } from "next/font/google";

export const atkinsonHyperlegible = Atkinson_Hyperlegible({
  subsets: ["latin-ext"],
  weight: ["400", "700"],
});

export const merriweather = Merriweather({
  subsets: ["cyrillic-ext"],
  weight: ["300", "400", "700", "900"],
});
