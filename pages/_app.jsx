import { Inter } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function App({ Component, pageProps }) {
  return (
    <div className={`${inter.variable} font-sans antialiased`} style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      <Component {...pageProps} />
    </div>
  );
}
