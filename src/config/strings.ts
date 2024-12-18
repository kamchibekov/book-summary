abstract class Strings {
  // global
  static readonly APP_NAME = 'Book Summary';
  // Register page
  static readonly app_logo_text = 'Book Summary logo';
  static readonly sign_in_google = 'SIGN IN WITH GOOGLE';
  static readonly sign_out = 'Sign Out';
  // Sidebar Component
  static readonly todaysBlink = "Today's blink";
  static readonly library = 'My Library';
  static readonly highlights = 'Highlights';
  // DB strings
  static readonly db_highlights = 'highlights';
  static readonly db_books = 'books';
  static readonly db_finished_books = 'finished_books';
  static readonly db_users = 'users';

  // Highlights
  static readonly no_highlights =
    "It appears there aren't any highlights yet. Let's bring some attention to key moments!";
  static readonly highlight = 'Highlight';
  static readonly highlight_copied = 'Highlight copied to clipboard!';
  static readonly highlight_deleted = 'Highlight deleted!';
  static readonly highlight_delete_confirm =
    'Are you sure you want to delete this highlight?';
  static readonly highlight_saved = 'Highlight saved!';

  // Book
  static readonly set_finished = 'Mark as finished';
  static readonly marked_finished = 'Book marked as finished! Great job!';

  // Error
  static readonly to_dashboard = 'Go to Dashboard';
  static readonly not_found_message =
    "The page you're looking for doesn't exist.";
}

export default Strings;
