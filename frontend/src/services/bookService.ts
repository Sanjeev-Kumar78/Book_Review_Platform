// src/services/bookService.ts
import api from "../utils/api";

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string[];
  published: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    reviews: number;
  };
}

export interface CreateBookData {
  title: string;
  author: string;
  genre: string[];
  published: string;
}

export interface BooksResponse {
  data: Book[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class BookService {
  // Get all books with pagination and search
  async getBooks(page = 1, limit = 12, search = ""): Promise<BooksResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search.trim()) {
      params.append("q", search.trim());
    }

    const response = await api.get(`/books?${params.toString()}`);
    return response.data;
  }

  // Get book by ID
  async getBookById(id: string): Promise<{ data: Book }> {
    const response = await api.get(`/books/${id}`);
    return response.data;
  }

  // Create new book
  async createBook(
    bookData: CreateBookData
  ): Promise<{ data: Book; message: string }> {
    const response = await api.post("/books", bookData);
    return response.data;
  }

  // Update book
  async updateBook(
    id: string,
    bookData: Partial<CreateBookData>
  ): Promise<{ data: Book; message: string }> {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  }

  // Delete book
  async deleteBook(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  }

  // Search books
  async searchBooks(
    query: string,
    page = 1,
    limit = 12
  ): Promise<BooksResponse> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await api.get(`/books/search?${params.toString()}`);
    return response.data;
  }
}

export default new BookService();
