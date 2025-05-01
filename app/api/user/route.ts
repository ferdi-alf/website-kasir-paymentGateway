/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { hash } from "bcrypt-ts";

const prisma = new PrismaClient();

const userSchema = z.object({
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(50, "Username maksimal 50 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: z.enum(["ADMIN", "KASIR", "PEMBELI"], {
    errorMap: () => ({ message: "Silahkan pilih role yang valid" }),
  }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validationResult = userSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Validasi gagal",
          errors: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { username, password, role } = validationResult.data;
    function getRandomAvatar() {
      const randomAvatar = Math.floor(Math.random() * 5) + 1;
      return `/avatar/avatar-${randomAvatar}.png`;
    }

    const image = getRandomAvatar();
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Username sudah digunakan" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        image: image,
        username,
        password: hashedPassword,
        role,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        message: "User berhasil dibuat",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saat membuat user:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
