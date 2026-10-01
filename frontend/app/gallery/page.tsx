import type { Metadata } from "next";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import { Container } from "@/components/ui/Primitives";
import { getGallery } from "@/lib/content";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos and architectural renderings from the UCReCENT initiative: brand, designs and community book mobilization.",
};

export default async function GalleryPage() {
  const images = await getGallery();
  return (
    <Container className="py-10">
      <p className="eyebrow">Gallery</p>
      <h1 className="h-display mt-2">In pictures.</h1>
      <p className="lead mt-4 max-w-3xl">
        Architectural renderings show the proposed facility. Community photos show early book
        mobilization and engagement. Captions describe what each image verifiably shows — nothing more.
        Select any image to view it larger.
      </p>
      <GalleryGrid images={images} />
    </Container>
  );
}
