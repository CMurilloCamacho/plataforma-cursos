"use client";
import { Course } from "@/lib/types/course";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const PageIdCourse = () => {
  const { id } = useParams();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${id}`);
        if (!res.ok) throw new Error("Curso no encontrado");
        const data = await res.json();

        setCourse(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);
  if (loading) {
    return <div>Cargando curso...</div>;
  }

  if (!course) {
    return <div> Curso no encontrado</div>;
  }
  return (
    <div>
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
        <p className="text-gray-600 mt-2 line-clamp-2">{course.description}</p>
        <p className="mt-2 font-bold">${course.price.toFixed(2)}</p>
        <Link
          href={`/dashboard/courses/${course.id}`}
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
};

export default PageIdCourse;
