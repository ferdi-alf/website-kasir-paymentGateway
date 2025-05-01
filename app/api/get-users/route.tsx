import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // sesuaikan dengan path prisma kamu
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  const id = session?.user.id;
  try {
    const users = await prisma.user.findMany({
      where: {
        id: {
          not: id,
        },
      },
    });
    return NextResponse.json({ data: users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data users" },
      { status: 500 }
    );
  }
}
