import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bookService from "../services/bookService";
import { useAuth } from "../contexts/AuthContext";

const bookSchema = yup.object().shape({
  title: yup
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters")
    .required("Title is required"),
  author: yup
    .string()
    .min(1, "Author is required")
    .max(100, "Author must be less than 100 characters")
    .required("Author is required"),
  genres: yup
    .array()
    .of(
      yup.object().shape({
        value: yup
          .string()
          .min(1, "Genre cannot be empty")
          .max(50, "Genre must be less than 50 characters")
          .required("Genre is required"),
      })
    )
    .min(1, "At least one genre is required")
    .required("Genres are required"),
  published: yup.string().required("Publication date is required"),
});

type BookFormData = yup.InferType<typeof bookSchema>;

const AddBook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, logout } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm<BookFormData>({
    resolver: yupResolver(bookSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      author: "",
      genres: [{ value: "" }],
      published: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "genres",
  });

  const onSubmit = async (data: BookFormData) => {
    setIsLoading(true);
    try {
      const bookData = {
        title: data.title,
        author: data.author,
        genre: (data.genres || []).map((g) => g.value.trim()).filter(Boolean),
        published: new Date(data.published).toISOString(),
      };

      await bookService.createBook(bookData);

      toast.success("Book added successfully!");
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
        "Failed to add book. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
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
              <h1 className="text-3xl font-bold">📚 Add New Book</h1>
              <p className="text-gray-300">
                Share a great book with the community
              </p>
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
                <a href="/add_book" className="text-white font-semibold">
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Book Title *
              </label>
              <input
                type="text"
                id="title"
                {...register("title")}
                placeholder="Enter the book title"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-gray-900 ${
                  errors.title
                    ? "border-red-500 focus:ring-red-500 bg-red-50"
                    : "border-gray-300 focus:ring-blue-500 bg-white"
                }`}
                disabled={isLoading}
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Author */}
            <div>
              <label
                htmlFor="author"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Author *
              </label>
              <input
                type="text"
                id="author"
                {...register("author")}
                placeholder="Enter the author's name"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-gray-900 ${
                  errors.author
                    ? "border-red-500 focus:ring-red-500 bg-red-50"
                    : "border-gray-300 focus:ring-blue-500 bg-white"
                }`}
                disabled={isLoading}
              />
              {errors.author && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.author.message}
                </p>
              )}
            </div>

            {/* Genres */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Genres *
              </label>
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-start">
                    <input
                      {...register(`genres.${index}.value` as const)}
                      placeholder={`Genre ${index + 1}`}
                      className={`flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-gray-900 ${
                        errors.genres?.[index]?.value
                          ? "border-red-500 focus:ring-red-500 bg-red-50"
                          : "border-gray-300 focus:ring-blue-500 bg-white"
                      }`}
                      disabled={isLoading}
                    />
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-3 rounded-lg font-semibold transition-colors"
                        disabled={isLoading}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                {errors.genres && (
                  <p className="text-red-400 text-sm">
                    {errors.genres.message}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => append({ value: "" })}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                  disabled={isLoading}
                >
                  + Add Another Genre
                </button>
              </div>
            </div>

            {/* Publication Date */}
            <div>
              <label
                htmlFor="published"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Publication Date *
              </label>
              <input
                type="date"
                id="published"
                {...register("published")}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-gray-900 ${
                  errors.published
                    ? "border-red-500 focus:ring-red-500 bg-red-50"
                    : "border-gray-300 focus:ring-blue-500 bg-white"
                }`}
                disabled={isLoading}
              />
              {errors.published && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.published.message}
                </p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isLoading || !isValid}
                className={`flex-1 p-3 rounded-lg font-semibold transition-colors ${
                  isLoading || !isValid
                    ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isLoading ? "Adding Book..." : "Add Book"}
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

        {/* Help Section */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Tips for Adding Books</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Make sure the book title is accurate and complete</li>
            <li>• Include the full author name (first and last name)</li>
            <li>• Add relevant genres to help others discover the book</li>
            <li>• Use the original publication date of the book</li>
            <li>• Double-check all information before submitting</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default AddBook;
