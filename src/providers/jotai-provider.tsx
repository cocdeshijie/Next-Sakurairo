import { Provider } from "jotai";
import { FC, ReactNode } from "react";

interface JotaiProviderProps {
    children: ReactNode;
}

export const JotaiProvider: FC<JotaiProviderProps> = ({ children }) => {
    return <Provider>{children}</Provider>;
};
