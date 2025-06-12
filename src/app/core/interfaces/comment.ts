// comment.interface.ts
export interface Comment {
  id?: number;
  rating: number;
  text: string;
  userId: number;
  courseId?: number;
  createdAt?: string;
  updatedAt?: string;
}