// src/components/WriteReview.tsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bookService, { type Book } from "../services/bookService";
import reviewService from "../services/reviewService";
import { useAuth } from "../contexts/AuthContext";

interface ReviewFormData {
  bookId: string;
  rating: number;
  comment?: string;
}

const WriteReview = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { user, logout } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
  } = useForm<ReviewFormData>({
    mode: "onChange",
    defaultValues: {
      bookId: "",
      rating: 5,
      comment: "",
    },
  });

  const watchedRating = watch("rating");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setBooksLoading(true);
      const response = await bookService.getBooks(1, 100); // Get more books for selection
      setBooks(response.data);
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
      setBooksLoading(false);
    }
  };

  const onSubmit = async (data: ReviewFormData) => {
    // Manual validation
    if (!data.bookId) {
      toast.error("Please select a book");
      return;
    }
    if (!data.rating || data.rating < 1 || data.rating > 5) {
      toast.error("Rating must be between 1 and 5");
      return;
    }
    if (data.comment && data.comment.length > 1000) {
      toast.error("Comment must be less than 1000 characters");
      return;
    }

    setIsLoading(true);
    try {
      await reviewService.createReview({
        bookId: data.bookId,
        rating: data.rating,
        comment: data.comment || undefined,
      });

      toast.success("Review submitted successfully!");
      reset();

      // Redirect to books page after 2 seconds
      setTimeout(() => {
        window.location.href = "/books";
      }, 2000);
    } catch (error: unknown) {
      interface ApiError {
        response?: {
          data?: {
            error?: string;
            message?: string;
            details?: Array<{ msg: string }>;
          };
        };
      }

      const apiError = error as ApiError;
      const errorMessage =
        apiError?.response?.data?.error ||
        apiError?.response?.data?.message ||
        apiError?.response?.data?.details
          ?.map((detail) => detail.msg)
          .join(", ") ||
        "Failed to submit review. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const renderStars = (rating: number, interactive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-3xl cursor-pointer ${
            i <= rating ? "text-yellow-400" : "text-gray-400"
          } ${interactive ? "hover:text-yellow-300" : ""}`}
          onClick={interactive ? () => setValue("rating", i) : undefined}
        >
          ★
        </span>
      );
    }
    return stars;
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
              <h1 className="text-3xl font-bold">📝 Write a Review</h1>
              <p className="text-gray-300">Share your thoughts on a book</p>
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
                <a href="/write_review" className="text-white font-semibold">
                  Write Review
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Book Selection */}
            <div>
              <label
                htmlFor="bookId"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Select Book *
              </label>
              {booksLoading ? (
                <div className="p-3 bg-gray-700 rounded-lg">
                  <p className="text-gray-400">Loading books...</p>
                </div>
              ) : (
                <select
                  id="bookId"
                  {...register("bookId")}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-gray-900 ${
                    errors.bookId
                      ? "border-red-500 focus:ring-red-500 bg-red-50"
                      : "border-gray-300 focus:ring-blue-500 bg-white"
                  }`}
                  disabled={isLoading}
                >
                  <option value="">Choose a book to review</option>
                  {books.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title} by {book.author}
                    </option>
                  ))}
                </select>
              )}
              {errors.bookId && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.bookId.message}
                </p>
              )}
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Rating *
              </label>
              <div className="flex items-center space-x-2 mb-2">
                {renderStars(watchedRating || 5, true)}
                <span className="text-lg font-semibold ml-2">
                  {watchedRating || 5} / 5
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                {...register("rating", { valueAsNumber: true })}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                disabled={isLoading}
              />
            </div>

            {/* Comment */}
            <div>
              <label
                htmlFor="comment"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Review Comment (Optional)
              </label>
              <textarea
                id="comment"
                {...register("comment")}
                rows={6}
                placeholder="Write your detailed review here... What did you like or dislike about the book?"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-gray-900 resize-none ${
                  errors.comment
                    ? "border-red-500 focus:ring-red-500 bg-red-50"
                    : "border-gray-300 focus:ring-blue-500 bg-white"
                }`}
                disabled={isLoading}
              />
              {errors.comment && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.comment.message}
                </p>
              )}
              <p className="text-gray-400 text-sm mt-1">
                {watch("comment")?.length || 0} / 1000 characters
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isLoading || !isValid}
                className={`flex-1 p-3 rounded-lg font-semibold transition-colors ${
                  isLoading || !isValid
                    ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {isLoading ? "Submitting Review..." : "Submit Review"}
              </button>

              <a
                href="/books"
                className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors text-center"
              >
                Cancel
              </a>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            Tips for Writing Great Reviews
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Be honest and specific about what you liked or disliked</li>
            <li>• Mention the book's strengths and weaknesses</li>
            <li>• Consider the writing style, plot, characters, and pacing</li>
            <li>• Avoid major spoilers - let others discover the story</li>
            <li>• Explain why you gave the rating you did</li>
            <li>• Keep it respectful and constructive</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default WriteReview;
