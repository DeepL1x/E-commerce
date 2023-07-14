import { createContext, useEffect, useState } from "react";

type MobileContextType = {
    isMobile: boolean;
    setMobileMode: (isMobile: boolean) => void;
}

type  MobileContextProviderProps = {
  children: React.ReactNode;
}

export const MobileContext = createContext<MobileContextType>({
    isMobile: false,
    setMobileMode: (isMobile: boolean) => {}
});

const MobileContextProvider = ({ children }: MobileContextProviderProps) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth < 800;
            setIsMobile(isMobile);
        }

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    
    })

    const setMobileMode = (isMobile: boolean) => {
        setIsMobile(isMobile);
    }

    return (
        <MobileContext.Provider value={{ isMobile, setMobileMode }}>
            {children}
        </MobileContext.Provider>
    );
}

export default MobileContextProvider;