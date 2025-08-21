export interface Course {
    id: string
  title: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  instructorId: string;
}

export type CreateCourseInput = Omit<Course, "id">