import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import bookService, {
  type Book,
  type BooksResponse,
} from "../services/bookService";
import { useAuth } from "../contexts/AuthContext";

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchBooks = async (page = 1, search = "") => {
    try {
      setLoading(true);

      const booksData: BooksResponse = await bookService.getBooks(
        page,
        12,
        search
      );

      setBooks(booksData.data);
      setTotalPages(booksData.pagination.pages);
      setCurrentPage(booksData.pagination.page);
    } catch (error: unknown) {
      interface ApiError {
        response?: {
          data?: {
            error?: string;
            message?: string;
          };
        };
      }

      const apiError = error as ApiError;
      const errorMessage =
        apiError?.response?.data?.error ||
        apiError?.response?.data?.message ||
        "Failed to fetch books";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBooks(1, searchQuery);
  };

  const handlePageChange = (page: number) => {
    fetchBooks(page, searchQuery);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold">📚 Book Review Platform</h1>
              <p className="text-gray-300">Discover amazing books</p>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-6">
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <Link to="/books" className="text-white font-semibold">
                  Books
                </Link>
                <Link
                  to="/add_book"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Add Book
                </Link>
              </nav>
              <div className="flex items-center space-x-3">
                <span className="text-gray-300">Welcome, {user?.name}!</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books by title or author..."
              className="flex-1 p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white placeholder-gray-400"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Search
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  fetchBooks(1, "");
                }}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-3 rounded-lg font-semibold transition-colors"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {/* Add Book Button */}
        <div className="mb-8">
          <Link
            to="/add_book"
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
          >
            + Add New Book
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-xl">Loading books...</div>
          </div>
        )}

        {/* Books Grid */}
        {!loading && (
          <>
            {books.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-2xl font-semibold mb-4">No books found</h3>
                <p className="text-gray-400 mb-6">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "Be the first to add a book to the platform!"}
                </p>
                <Link
                  to="/add_book"
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Add First Book
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {books.map((book) => (
                    <div
                      key={book.id}
                      className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <h3 className="text-xl font-bold mb-2 text-white line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-gray-300 mb-2">by {book.author}</p>
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {book.genre.slice(0, 3).map((g, index) => (
                            <span
                              key={index}
                              className="bg-blue-600 text-xs px-2 py-1 rounded-full"
                            >
                              {g}
                            </span>
                          ))}
                          {book.genre.length > 3 && (
                            <span className="bg-gray-600 text-xs px-2 py-1 rounded-full">
                              +{book.genre.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-400 mb-4">
                        <p>Published: {formatDate(book.published)}</p>
                        <p>Reviews: {book._count.reviews}</p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/books/${book.id}`}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg text-sm font-semibold transition-colors text-center"
                        >
                          View Details
                        </Link>
                        <button className="bg-green-600 hover:bg-green-700 py-2 px-4 rounded-lg text-sm font-semibold transition-colors">
                          Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        currentPage === 1
                          ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                          : "bg-gray-700 hover:bg-gray-600 text-white"
                      }`}
                    >
                      Previous
                    </button>

                    <div className="flex space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 rounded-lg font-semibold transition-colors ${
                              currentPage === page
                                ? "bg-blue-600 text-white"
                                : "bg-gray-700 hover:bg-gray-600 text-white"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        currentPage === totalPages
                          ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                          : "bg-gray-700 hover:bg-gray-600 text-white"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Books;
