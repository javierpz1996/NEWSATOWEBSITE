import Image from "next/image";
import { HOME_SECTIONS_BOOKS } from "@/lib/home-sections-books";

/** Enough slots to fill the Comisiones → Animaciones column on tall viewports. */
const BOOK_SLOT_COUNT = 56;

export function HomeSectionsDotBook() {
  return (
    <div className="home-sections-dot-book" aria-hidden="true">
      <div className="home-sections-dot-book__stack">
        {Array.from({ length: BOOK_SLOT_COUNT }, (_, index) => {
          const book = HOME_SECTIONS_BOOKS[index % HOME_SECTIONS_BOOKS.length];
          return (
            <Image
              key={`${book.id}-${index}`}
              className="home-sections-dot-book__item"
              src={book.src}
              alt=""
              width={book.width}
              height={book.height}
              unoptimized
            />
          );
        })}
      </div>
    </div>
  );
}
