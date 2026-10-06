import type { Metadata } from "next";
import { MoreInfoPageContent } from "@/app/more-info/more-info-page-content";

export const metadata: Metadata = {
  title: "Más información",
  description:
    "Por qué existe este sitio, hacia dónde apunta el proyecto y créditos de desarrollo.",
};

export default function MoreInfoPage() {
  return <MoreInfoPageContent />;
}
