export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  image_url: string;
  raw_text: string;
  summary: string;
}

export interface HighlightInfo {
  id?: string;
  book_id: string;
  book_title: string;
  book_author: string;
  book_image_url: string;
  highlights: HighlightText[];
}

export interface HighlightText {
  key?: string;
  chapter: string;
  text: string;
  start: number;
  end: number;
  color: string;
}

export interface SelectionWithHighlight {
  selection: Selection;
  highlightedText: HighlightText;
}
