import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  let name, price, stok, file;
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    name = formData.get("name") as string;
    price = formData.get("price") as string;
    stok = formData.get("stok") as string;
    file = formData.get("file") as File | null;
  } else {
    // Handle as JSON
    const body = await request.json();
    name = body.name;
    price = body.price;
    stok = body.stok;
    file = null;
  }

  console.log("Received data:", { id, name, price, stok, hasFile: !!file });

  const formattedPrice = price ? parseInt(price.replace(/\./g, "")) : 0;

  const formattedStok = stok ? parseInt(stok) : 0;

  let imagePath = "";

  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name}`;

    const uploadsDir = path.join(process.cwd(), "public", "images", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, fileName);
    await writeFile(filePath, buffer);

    imagePath = fileName;
  }

  const currentMenu = await prisma.menu.findUnique({
    where: { id },
  });

  if (!currentMenu) {
    return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
  }
  const updatedMenu = await prisma.menu.update({
    where: { id },
    data: {
      name,
      price: formattedPrice,
      stok: formattedStok,
      ...(imagePath ? { image: imagePath } : {}),
    },
  });

  if (imagePath && currentMenu.image) {
    const oldImagePath = path.join(
      process.cwd(),
      "public",
      "images",
      "uploads",
      currentMenu.image
    );
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }

  return NextResponse.json(
    {
      message: "Menu berhasil diupdate",
      data: updatedMenu,
    },
    { status: 200 }
  );
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          error: true,
          message: "Id tidak valid",
          status: 402,
        },
        { status: 402 }
      );
    }

    const checkData = await prisma.menu.findUnique({
      where: { id },
    });

    if (!checkData) {
      return NextResponse.json(
        {
          error: true,
          message: "Data yang ingin dihapus, tidak ditemukan",
          status: 404,
        },
        { status: 404 }
      );
    }

    const result = await prisma.menu.delete({
      where: { id },
    });

    if (result) {
      return NextResponse.json(
        {
          success: true,
          message: "Berhasil menghapus data",
          status: 201,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.log(error);
  }
}
