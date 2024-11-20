enum RouteEnum {
  Dashboard = '/',
  Register = '/register',
  NotFound = '/*',
  Icon = '/book-summary/icons/icon-192x192.png',
  Book = '/book/:bookId',
  // Library
  Library = 'library',
  // Highlights
  Highlights = '/highlights',
  BookHighlights = '/highlights/:bookId',
}
export default RouteEnum;
