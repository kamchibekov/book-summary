enum URL {
  Dashboard = '/',
  Register = '/register',
  NotFound = '/*',
  Icon = '/book-summary/icons/icon-192x192.png',
  Book = '/book/:bookTitle',
  // Library
  Library = 'library',
  LibraryBook = '/library/:bookTitle',
  // Highlights
  Highlights = '/highlights',
  BookHighlights = '/highlights/:bookId',
}
export default URL;
