import { useEffect, useState } from "react";

export const useMobileDisplay = () => {
    const [isMobileDisplay, setIsMobileDisplay] = useState(false);

    const onWindowResize = () => {
        const resolution = window.innerWidth;

        // This value seems to work for iPhones
        const isMobile = resolution <= 1024;

        setIsMobileDisplay(isMobile);
    }

    useEffect(() => {
        window.addEventListener("resize", onWindowResize);

        return () => window.removeEventListener("resize", onWindowResize);
    });

    useEffect(onWindowResize, []);

    return isMobileDisplay;
}


