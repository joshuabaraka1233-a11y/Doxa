import type {Metadata} from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DOXA — Turn Problems Into Action",
  description: "DOXA connects real-world problems with people, resources and action.",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}