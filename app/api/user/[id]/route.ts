import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";

import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  let username, role, password, file;
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    username = formData.get("username") as string;
    role = formData.get("role") as string;
    password = formData.get("password") as string;
    file = formData.get("file") as File | null;
  } else {
    const body = await request.json();
    username = body.username;
    role = body.role;
    password = body.password;
    file = null;
  }

  const currentUser = await prisma.user.findUnique({ where: { id } });

  if (!currentUser) {
    return NextResponse.json(
      { error: "User tidak ditemukan" },
      { status: 404 }
    );
  }

  let imagePath = "";
  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExtension = file.name.split(".").pop();
    const safeFileName = `${Date.now()}.${fileExtension}`;
    const uploadsDir = path.join(process.cwd(), "public", "avatar");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, safeFileName);
    await writeFile(filePath, buffer);

    // simpan ke database path: "/avatar/nama.jpg"
    imagePath = `/avatar/${safeFileName}`;
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      username,
      role,
      ...(password ? { password } : {}),
      ...(imagePath ? { image: imagePath } : {}),
    },
  });

  if (imagePath && currentUser.image) {
    const oldImagePath = path.join(
      process.cwd(),
      "public",
      "images",
      "avatar",
      currentUser.image
    );
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }

  return NextResponse.json(
    {
      message: "User berhasil diupdate",
      data: updatedUser,
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

    const checkData = await prisma.user.findUnique({
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

    const result = await prisma.user.delete({
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
