import prisma from "@/lib/prisma";
import { createCourse, getCourses } from "@/lib/services/course-service";
import { CreateCourseInput } from "@/lib/types/course";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const role = req.headers.get("userrole");
  const userId = req.headers.get("userid");
  console.log("USERID", userId);
  if ((role !== "INSTRUCTOR" && role !== "ADMIN") || !userId) {
    return NextResponse.json(
      {
        message: "Solo instructores  o administradores pueden crear cursos",
      },
      { status: 403 }
    );
  }

  const formData = await req.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const imageFile = formData.get("image") as File;
  const price = parseFloat(formData.get("price") as string);
  try {
    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
      const uploadFormData = new FormData();
      uploadFormData.append("image", imageFile);

      const uploadResponse = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/upload`,
        {
          method: "POST",
          body: uploadFormData,
        }
      );
      if (!uploadResponse.ok) {
        const errorUpload = await uploadResponse.json();
        throw new Error(errorUpload.error || "Fallo la subida de imagen");
      }
      const uploadData = await uploadResponse.json();
      imageUrl = uploadData.secure_url;
    }

    const input: CreateCourseInput = {
      title,
      description,
      price,
      imageUrl,
      instructorId: userId,
    };

    const course = await createCourse(input);

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.log(error);
    NextResponse.json({ error });
  }
};

export const GET = async (request: NextRequest) => {
  console.log("request!!!!", request);
  const userRole = request.headers.get("userrole");
  const userId = request.headers.get("userid");

  if (userRole === "ADMIN") {
    const courses = await getCourses();
    return NextResponse.json(courses);
  } else if (userRole === "INSTRUCTOR") {
    if (!userId) {
      return NextResponse.json({ message: "No existe el usuario " });
    }

    const courseLIst = await prisma.course.findMany({
      where: { instructorId: userId },
    });
    return NextResponse.json(courseLIst);
  } else {
    return NextResponse.json(
      { message: "No estás autorizado para obtener la lista de Cursos" },
      { status: 403 }
    );
  }
};
