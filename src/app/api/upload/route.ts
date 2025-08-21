import { NextResponse, NextRequest } from "next/server";

import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const POST = async (request: NextRequest) => {
  try {
    const data = await request.formData();
    // console.log(data.get('image').name)
    const image = data.get("image");
    if (!(image instanceof File)) {
      return NextResponse.json(
        { error: "No se recibió un archivo válido" },
        { status: 400 }
      );
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    //    const filePath = path.join(process.cwd(), 'public', image.name)
    //    await writeFile(filePath, buffer)
    const response = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({}, ( err, result) => {
          if (err ) {
            return reject(err);
          }else
          if(!result) {
            return reject(new Error ('Cloudinary no recibio la respuesta'))
          }
          resolve(result);
        })
        .end(buffer);
    });

    return NextResponse.json({
      message: "imagen subida correctamente",
      secure_url: response.secure_url,   
    });
  } catch (error) {
    console.error(error, "Error al subir la imagen");
    return NextResponse.json(
      { error: "error al procesar la imagen" },
      { status: 400 }
    );
  }
};
