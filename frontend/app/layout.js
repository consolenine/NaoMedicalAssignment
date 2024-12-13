import { Provider } from "@/components/ui/provider";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

export const metadata = {
  title: "NaoMedical Assignment",
  description: "Healthcare Translation Web App with Generative AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body
      className={`${poppins.className} antialiased`}
    >
      <Provider>{children}</Provider>
    </body>
    </html>
  );
}
