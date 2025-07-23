// src/services/reviewService.ts
import api from "../utils/api";

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  book: {
    id: string;
    title: string;
    author: string;
  };
}

export interface CreateReviewData {
  bookId: string;
  rating: number;
  comment?: string;
}

export interface ReviewsResponse {
  data: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class ReviewService {
  // Get all reviews with pagination
  async getReviews(page = 1, limit = 10): Promise<ReviewsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await api.get(`/reviews?${params.toString()}`);
    return response.data;
  }

  // Get reviews for a specific book
  async getBookReviews(
    bookId: string,
    page = 1,
    limit = 10
  ): Promise<ReviewsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await api.get(
      `/books/${bookId}/reviews?${params.toString()}`
    );
    return response.data;
  }

  // Get review by ID
  async getReviewById(id: string): Promise<{ data: Review }> {
    const response = await api.get(`/reviews/${id}`);
    return response.data;
  }

  // Create new review
  async createReview(
    reviewData: CreateReviewData
  ): Promise<{ data: Review; message: string }> {
    const response = await api.post("/reviews", reviewData);
    return response.data;
  }

  // Update review
  async updateReview(
    id: string,
    reviewData: Partial<CreateReviewData>
  ): Promise<{ data: Review; message: string }> {
    const response = await api.put(`/reviews/${id}`, reviewData);
    return response.data;
  }

  // Delete review
  async deleteReview(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  }

  // Get current user's reviews
  async getMyReviews(page = 1, limit = 10): Promise<ReviewsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await api.get(`/reviews/my?${params.toString()}`);
    return response.data;
  }
}

export default new ReviewService();
