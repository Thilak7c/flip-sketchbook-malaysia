import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Malaysia Sketchbook — A field journal",
  description: "A tactile watercolor field journal of Malaysia, drawn in ink and monsoon light.",
  icons: { icon: "/assets/hibiscus-seal.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
