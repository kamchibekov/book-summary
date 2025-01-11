export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  image_url: string;
  raw_text: string;
  summary: string;
  created_at: object;
}

export interface HighlightInfo {
  id?: string;
  book_id: string;
  book_title: string;
  book_author: string;
  book_image_url: string;
  highlights: HighlightText[];
  created_at: object;
}

export interface HighlightText {
  key?: string;
  chapter: string;
  text: string;
  start: number;
  end: number;
  color: string;
  created_at: object;
}

export interface CustomSelection {
  selection: Selection;
  key: string;
  node: Node;
}

export enum Color {
  orange = '#ffa726',
  green = '#66bb6a',
  blue = '#2bb6f6',
}
