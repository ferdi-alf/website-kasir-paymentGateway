import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";
import prisma from "@/lib/prisma";

const getAvatarUrl = (fileName) => {
  return `/avatar/${fileName}`;
};

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const username = formData.get("username") as string | null;
    const file = formData.get("file") as File | null;
    const userId = formData.get("userId") as string;

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true, image: true },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: true, message: "User tidak ditemukan", status: 404 },
        { status: 404 }
      );
    }

    if (username && username !== currentUser.username) {
      const checkUsername = await prisma.user.findUnique({
        where: { username },
      });

      if (checkUsername) {
        return NextResponse.json(
          { error: true, message: "Username sudah digunakan", status: 400 },
          { status: 400 }
        );
      }
    }

    const updateData: { username?: string; image?: string } = {};

    if (username) {
      updateData.username = username;
    }

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${file.name}`;

      const avatarDir = path.join(process.cwd(), "public", "avatar");
      if (!fs.existsSync(avatarDir)) {
        fs.mkdirSync(avatarDir, { recursive: true });
      }

      const filePath = path.join(avatarDir, fileName);
      await writeFile(filePath, buffer);

      updateData.image = getAvatarUrl(fileName);
    }

    const updateUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    if (updateUser) {
      return NextResponse.json({
        status: 200,
        message: "Berhasil Update Profile",
        data: {
          username: updateUser.username,
          image: updateUser.image,
        },
      });
    } else {
      return NextResponse.json(
        {
          error: true,
          message: "Gagal update profile",
          status: 500,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      {
        error: true,
        message: "Terjadi kesalahan pada server",
        status: 500,
      },
      { status: 500 }
    );
  }
}
