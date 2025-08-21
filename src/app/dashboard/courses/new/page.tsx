// src/app/dashboard/courses/new/page.tsx
"use client";

export default function NewCoursePage() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/courses", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      window.location.href = "/dashboard/courses";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="title"
        placeholder="Título del curso"
        required
        className="w-full p-2 border rounded"
      />
      <textarea
        name="description"
        placeholder="Descripción"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        name="price"
        placeholder="Precio (USD)"
        step="0.01"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="file"
        name="image"
        accept="image/*"
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Crear Curso
      </button>
    </form>
  );
}
