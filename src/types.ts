export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  image_url: string;
  raw_text: string;
  summary: string;
}

export interface Highlight {
  id?: string;
  text: string;
  book_id: string;
  book_title: string;
  book_author: string;
  book_image_url: string;
}

export interface BookHighlight {
  book_id: string;
  book_title: string;
  book_author: string;
  book_image_url: string;
  highlights: { id?: string | undefined; text: string }[];
}
