export type HomeSectionsBookAsset = {
  id: string;
  src: `/works/placeholder/${string}`;
  width: number;
  height: number;
};

/** book.png → book8.png — order used along the left dot strip. */
export const HOME_SECTIONS_BOOKS: readonly HomeSectionsBookAsset[] = [
  { id: "book-1", src: "/works/placeholder/book.png", width: 1254, height: 1254 },
  { id: "book-2", src: "/works/placeholder/book2.png", width: 887, height: 1774 },
  { id: "book-3", src: "/works/placeholder/book3.png", width: 1254, height: 1254 },
  { id: "book-4", src: "/works/placeholder/book4.png", width: 1263, height: 1245 },
  { id: "book-5", src: "/works/placeholder/book5.png", width: 887, height: 1774 },
  { id: "book-6", src: "/works/placeholder/book6.png", width: 1774, height: 887 },
  { id: "book-7", src: "/works/placeholder/book7.png", width: 1254, height: 1254 },
  { id: "book-8", src: "/works/placeholder/book8.png", width: 1774, height: 887 },
];
