import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { StudentProvider } from "@/lib/contexts/StudentContext";
import { OpportunitiesProvider } from "@/lib/contexts/OpportunitiesContext";

export const metadata: Metadata = {
  title: "OpenDoor — Student Opportunity & Activity Tracker",
  description: "Discover volunteering and internship opportunities, track your activities, and build a college-ready profile with AI-powered tools.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <StudentProvider>
            <OpportunitiesProvider>
              {children}
            </OpportunitiesProvider>
          </StudentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
