import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Provider from "./ui/Provider";
import "./styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "Nice looking ui",
    default: "nice ui",
  },
  description: "It's just a nice looking ui",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider>
        <body className={inter.className}>{children}</body>
      </Provider>
    </html>
  );
}
