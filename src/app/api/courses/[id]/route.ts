import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);

    if (!id) {
      return NextResponse.json(
        { error: "ID de curso no proporcionado" },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: { id: id },
      include: {
        instructor: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "El curso no ha sido  encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {

    console.log('request.headers!!!!!', request.headers)
  try {
    const userRole = request.headers.get("userRole");
    const userId = request.headers.get('userid')
    const {id} = await Promise.resolve(params)
    if (!["ADMIN", "INSTRUCTOR"].includes(userRole || "")) {
      return NextResponse.json(
        {
          message:
            "No autorizado, solo admin e instructores pueden actualizar cursos",
        },
        {}
      );
    }

    
    if (!id) {
      return NextResponse.json(
        {
          message: "Id de curso no proporcionado",
        },
        { status: 400 }
      );
    }
    const findCourse = await prisma.course.findUnique({
      where: {
        id,
      },
    });
    if (findCourse?.instructorId !== userId) {

        return NextResponse.json({message: "No autorizado, solo puedes actualizar tus cursos"})
    }
    if (!findCourse)
      return NextResponse.json(
        { message: "NO se encontro el curso" },
        { status: 404 }
      );

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const imageFile = formData.get("image") as File | null;

    let imageUrl = findCourse.imageUrl;
    if (
      imageFile &&
      imageFile?.size > 0 &&
      imageFile.type.startsWith("image/")
    ) {
      try {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<UploadApiResponse>(
          (resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {},
              (error, result) => {
                if (error) return reject(error);
                if (!result)
                  return reject(new Error("No hay resultado de la imagen"));
                resolve(result as UploadApiResponse);
              }
            );
            uploadStream.end(buffer);
          }
        );
        imageUrl = result.secure_url;
      } catch (error) {
        console.error("error al subir la imagen", error);
        return NextResponse.json(
          { message: "Error al subir la imagen " },
          { status: 500 }
        );
      }
    }

    const updateCourse = await prisma.course.update({
      where: { id  },
      data: {
        title,
        description,
        price,
        imageUrl,
      },
    });
    return NextResponse.json({
      updateCourse,
    });
  } catch (error) {
    console.error("Error en el PATCH", error);
    return NextResponse.json(
      {
        message: "Error al aplicar el Patch",
      },
      {
        status: 500,
      }
    );
  }
};
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = await Promise.resolve(params);
    const userRole = request.headers.get("userRole");
    const userId = request.headers.get("userId");

    if (!["ADMIN", "INSTRUCTOR"].includes(userRole || "")) {
      return NextResponse.json({
        message: "No estas  autorizado para eliminar ",
      });
    }

    const findCourse = await prisma.course.findUnique({
      where: { id },
    });
    if (!findCourse)
      return NextResponse.json(
        { message: "Curso No encontrado" },
        { status: 404 }
      );
    if (userRole === "INSTRUCTOR" && findCourse?.instructorId !== userId) {
      return NextResponse.json(
        { message: "No autorizado: Solo puedes eliminar tus propios cursos" },
        { status: 403 }
      );
    }
    await prisma.course.delete({ where: { id } });
    return NextResponse.json({ message: "Curso eliminado" });
  } catch (error) {
    console.error("Error", error);
    return NextResponse.json(
      { message: "Error al eliminar el curso" },
      { status: 400 }
    );
  }
};
