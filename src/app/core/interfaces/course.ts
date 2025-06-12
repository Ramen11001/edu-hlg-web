import { Comment } from 'src/app/core/interfaces/comment';

export interface Course {
  id: number;
  title: string;
  description: string;
  teacher: string;
  company: string;
  address: string;
  mode: 'in-person' | 'virtual' | 'hybrid';
  area: 'technique' | 'humanities' | 'health';
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  cost: number;
  certificate: boolean;
  modules: string[];
  comments?: Comment[];
  averageRating?: number;
}