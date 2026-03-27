import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import ThemeToggler from "@/components/ThemeToggler";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Apply theme on initial load to avoid hydration mismatch
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <>
      <Component {...pageProps} />
    </>
  );
}
