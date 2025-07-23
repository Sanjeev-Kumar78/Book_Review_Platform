// src/components/BookDetail.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bookService, { type Book } from "../services/bookService";
import reviewService, { type Review } from "../services/reviewService";
import { useAuth } from "../contexts/AuthContext";

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        await fetchBookDetails();
        await fetchBookReviews();
      }
    };

    fetchData();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchBookDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await bookService.getBookById(id);
      setBook(response.data);
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
        "Failed to fetch book details";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookReviews = async () => {
    if (!id) return;

    try {
      setReviewsLoading(true);
      const response = await reviewService.getBookReviews(id);
      setReviews(response.data);
    } catch (error: unknown) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const handleWriteReview = () => {
    setShowReviewModal(true);
  };

  const handleCloseModal = () => {
    setShowReviewModal(false);
    setReviewForm({ rating: 5, comment: "" });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSubmittingReview(true);
    try {
      await reviewService.createReview({
        bookId: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment || undefined,
      });

      toast.success("Review submitted successfully!");
      handleCloseModal();
      // Refresh reviews
      await fetchBookReviews();
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
        "Failed to submit review";
      toast.error(errorMessage);
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-2xl ${
            i <= rating ? "text-yellow-400" : "text-gray-400"
          }`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">
        <div className="text-xl">Loading book details...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Book not found</h2>
          <a
            href="/books"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Books
          </a>
        </div>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold">📚 Book Details</h1>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-6">
                <a
                  href="/dashboard"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Dashboard
                </a>
                <a
                  href="/books"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Books
                </a>
                <a
                  href="/add_book"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Add Book
                </a>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Information */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
              <div className="mb-6">
                <a
                  href="/books"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  ← Back to Books
                </a>
              </div>

              <h1 className="text-4xl font-bold mb-4">{book.title}</h1>
              <p className="text-xl text-gray-300 mb-6">by {book.author}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Publication Date
                  </h3>
                  <p className="text-gray-300">{formatDate(book.published)}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Total Reviews</h3>
                  <p className="text-gray-300">{book._count.reviews}</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {book.genre.map((g, index) => (
                    <span
                      key={index}
                      className="bg-blue-600 px-3 py-1 rounded-full text-sm"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleWriteReview}
                  className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Write a Review
                </button>
                <button className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors">
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Sidebar */}
          <div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Reviews</h2>

              {reviews.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    {renderStars(Math.round(Number(calculateAverageRating())))}
                    <span className="ml-2 text-lg font-semibold">
                      {calculateAverageRating()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Based on {reviews.length} review
                    {reviews.length !== 1 ? "s" : ""}
                  </p>
                </div>
              )}

              {reviewsLoading ? (
                <div className="text-center py-4">
                  <p>Loading reviews...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No reviews yet</p>
                  <button
                    onClick={handleWriteReview}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Be the first to review
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-700 pb-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">
                          {review.user.name}
                        </span>
                        <div className="flex">
                          {renderStars(review.rating).map((star, index) => (
                            <span key={index} className="text-sm">
                              {star}
                            </span>
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-300 text-sm mb-2">
                          {review.comment}
                        </p>
                      )}
                      <p className="text-gray-500 text-xs">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-6">Write a Review</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setReviewForm({ ...reviewForm, rating: star })
                      }
                      className={`text-3xl ${
                        star <= reviewForm.rating
                          ? "text-yellow-400"
                          : "text-gray-400"
                      } hover:text-yellow-400 transition-colors`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Comment (Optional)
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, comment: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  rows={4}
                  placeholder="Share your thoughts about this book..."
                  maxLength={1000}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {reviewForm.comment.length}/1000 characters
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-800 px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetail;
