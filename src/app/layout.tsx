import type { Metadata } from "next";
import "./globals.css";



export const metadata: Metadata = {
  title: "Plataforma de cursos",
  description: "Aprendiendo en linea",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
      >
        {children}
      </body>
    </html>
  );
}
