"use client";
import { Course } from "@/lib/types/course";
import { useParams , useRouter} from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

const EditCoursePage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [stateSubmit, setStateSubmit] = useState(false);

  useEffect(() => {
    const fectchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${id}`);
        if (!response.ok) throw new Error("No se encontró el curso");
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fectchCourse();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStateSubmit(true);
    const formData = new FormData(form);

    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: "PATCH",
        body: formData,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData || "Error al actualizar");
      }
      router.push(`/dashboard/courses/${id}`);

    } catch (error) {
      console.error("Error", error);

    }
  };

  if (loading) return <p>Cargando...</p>;
  if (!course) return <p>Curso no encontrado</p>;

  return (
    <div>
      <h1>Editar Curso</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="text" name="title" value={course?.title} required />
        </div>
        <div>
          <input
            type="text"
            name="description"
            value={course?.description}
            required
          />
        </div>
        <div>
          <textarea name="description" value={course?.description} required />
        </div>
        <div>
          <input
            type="number"
            name="description"
            value={course?.price}
            required
          />
        </div>
        <div>
          {course?.imageUrl ? (
            <Image
              src={course?.imageUrl ?? "/placeholder.png"}
              alt={
                course?.title ? `Imagen de ${course.title}` : "Imagen del curso"
              }
              width={400}
              height={300}
              priority
            />
          ) : (
            <p>No hay imagen para mostrar</p>
          )}
        </div>
        <button type="submit" disabled={stateSubmit}>
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default EditCoursePage;
