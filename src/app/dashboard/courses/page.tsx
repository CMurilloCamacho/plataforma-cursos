"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Course } from "@/lib/types/course";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses");
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error cargando cursos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return <div>Cargando cursos...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Todos los Cursos</h1>

      <Link
        href="/dashboard/courses/new"
        className="mb-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Crear Nuevo Curso
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="border rounded-lg overflow-hidden shadow-lg"
          >
            {course.imageUrl && (
              <div className="relative w-full h-48">
                <Image
                  src={course.imageUrl}
                  alt={course.title}
                  fill // Ocupa todo el espacio del contenedor padre
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimización para diferentes viewports
                  priority={false} // Prioriza solo las imágenes visibles en el viewport inicial
                />
              </div>
            )}
            <div className="p-4">
              <h2 className="font-bold text-xl">{course.title}</h2>
              <p className="text-gray-600 mt-2 line-clamp-2">
                {course.description}
              </p>
              <p className="mt-2 font-bold">${course.price.toFixed(2)}</p>
              <Link
                href={`/dashboard/courses/${course.id}`}
                className="mt-4 inline-block text-blue-600 hover:underline"
              >
                Ver detalles
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
