import './global.css';
import { ReactNode } from "react"; // Import ReactNode type

export const metadata = {
    title: "Kaleem",
    description: "The place to go for all your Kaleem One questions!"
}

interface RootLayoutProps {
    children: ReactNode; // Explicitly type 'children' as ReactNode
}

const RootLayout = ({ children }: RootLayoutProps) => {
    return (
        <html>
            <body>{children}</body>
        </html>
    );
}

export default RootLayout;
