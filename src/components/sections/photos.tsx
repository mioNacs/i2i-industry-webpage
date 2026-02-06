import Image from "next/image";
import { getPhotos } from "@/lib/contentful/client";
import SectionHeader from "@/components/ui/section-header";

export default async function PhotosAndImages() {
  const r = await getPhotos();
  const seminarImages = r.data.photosCollection.items
    .map((e) => e.photosCollection.items)
    .flat()
    .map((e) => e.url);

  return (
    <section className="w-full bg-secondary py-12">
      <div className="px-8 lg:px-16 mb-8">
        <SectionHeader
          title={
            <>
              <span className="text-primary">Life</span> at i2i
            </>
          }
          subtitle="A glimpse into our vibrant learning environment"
        />
      </div>

      <div className="px-8 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {seminarImages.map((e, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-lg group relative"
          >
            <Image
              src={e}
              width={600}
              height={450}
              alt={`Seminar photo ${i + 1}`}
              className="h-auto max-w-full min-h-[280px] object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
          </div>
        ))}
      </div>
    </section>
  );
}
