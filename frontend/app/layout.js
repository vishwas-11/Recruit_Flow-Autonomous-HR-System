import "./globals.css";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}