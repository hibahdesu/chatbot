import './global.css';
import { ReactNode } from "react"; // Import ReactNode type

export const metadata = {
    title: "Tourist",
    description: "The place to go for all your Tourist questions!"
}

interface RootLayoutProps {
    children: ReactNode; 
}

const RootLayout = ({ children }: RootLayoutProps) => {
    return (
        <html>
            <body>{children}</body>
        </html>
    );
}

export default RootLayout;
