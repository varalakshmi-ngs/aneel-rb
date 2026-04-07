import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// import TopHeader from "@/components/TopHeader";
import AdminTopBarGate from "@/components/AdminTopBarGate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Robo Church",
  description: "Cutting-edge software, AI, and IT services",
  icons: {
    icon: "/Logo-removebg-preview1 (1).ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0A2222]`}
      >
        {/* <TopHeader /> */}
        <AdminTopBarGate />
        <Header />
        <main className="pt-[100px] sm:pt-[90px] md:pt-[80px]">{/* Add top padding to avoid overlap with top bar (70px) */}
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
