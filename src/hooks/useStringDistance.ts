import { useMobileDisplay } from "./useMobileDisplay";

const stringDistanceOnDesktop = 14;
const stringDistanceOnMobile = 18;

export function useStringDistance() {
    const isMobile = useMobileDisplay();

    return isMobile ? stringDistanceOnMobile : stringDistanceOnDesktop;
}
