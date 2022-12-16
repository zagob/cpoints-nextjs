import { useMediaQuery } from "../hooks/useMediaQuery";

export const useIs2XL = () => useMediaQuery("(min-width: 1430px)");
export const useIsXL = () => useMediaQuery("(min-width: 1280px)");
export const useIsMedium = () => useMediaQuery("(max-width: 840px)");
export const useIsSmall = () => useMediaQuery("(max-width: 444px)");
