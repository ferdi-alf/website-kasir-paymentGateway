import prisma from "@/lib/prisma";
import { menuSchema } from "@/lib/zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validation = menuSchema.safeParse({
      name: body.name,
      price: String(body.price),
      stok: String(body.stok),
      file: "dummy", // file di API sudah berupa image url, dummy supaya lolos
    });

    if (!validation.success) {
      return Response.json({ error: validation.error.errors }, { status: 400 });
    }

    const newMenu = await prisma.menu.create({
      data: {
        name: body.name,
        price: body.price,
        stok: body.stok,
        image: body.image,
      },
    });

    return Response.json({
      success: true,
      message: "Menu Berhasil ditambahkan",
      data: newMenu,
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
