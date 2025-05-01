"use server";

import { LoginSchema, menuSchema, RegisterSchema } from "./zod";
import { auth, signIn } from "@/auth";
import { hashSync } from "bcrypt-ts";
import { AuthError } from "next-auth";
import prisma from "./prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import fs from "fs";

import path from "path";

export const RegisterCredentials = async (
  prevdat: unknown,
  formData: FormData
) => {
  const validateFields = RegisterSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validateFields.success) {
    return {
      error: validateFields.error.flatten().fieldErrors,
    };
  }

  const { username, password, confirmPassword } = validateFields.data;
  const isSamePassword = password === confirmPassword;
  if (!isSamePassword) {
    return {
      error: {
        confirmPassword: "Konfirmasi password tidak sama",
      },
    };
  }

  const hashedPassword = hashSync(password, 10);
  function getRandomAvatar() {
    const randomAvatar = Math.floor(Math.random() * 5) + 1;
    return `/avatar/avatar-${randomAvatar}.png`;
  }

  const image = getRandomAvatar();

  try {
    await prisma.user.create({
      data: {
        image: image,
        username,
        password: hashedPassword,
      },
    });

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false, // Harus false
      callbackUrl: "/",
    });

    if (result?.ok && result?.url) {
      redirect(result.url); // Next.js 'redirect' untuk navigasi
    }

    return { status: 200, message: "Registrasi berhasil 🥳", success: true };
  } catch (error) {
    console.error(error);
    return {
      error: {
        status: 500,
        message: "Terjadi kesalahan pada server 😴",
        success: false,
      },
    };
  }
};

export const loginCrendentials = async (
  prevState: unknown,
  formData: FormData
) => {
  const validateFields = LoginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validateFields.success) {
    return {
      error: validateFields.error.flatten().fieldErrors,
    };
  }

  const { username, password } = validateFields.data;

  try {
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false, // <- INI DIGANTI
      callbackUrl: "/",
    });

    if (result) {
      return {
        status: 200,
        message: "Login berhasil",
        success: true,
      };
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.cause) {
        case "CredentialsSignin":
          return {
            errors: true,
            message: "Username atau Password salah kocak",
          };
      }
      return { errors: true, message: "Username atau Password salah kocak." };
    }
    throw error;
  }
};

export async function createMenu(prevState: unknown, formData: FormData) {
  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const stok = formData.get("stok") as string;
  const file = formData.get("file") as File | null;

  const validation = menuSchema.safeParse({ name, price, stok, file });

  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors,
    };
  }

  if (!file || file.size === 0) {
    return {
      errors: {
        file: ["Gambar wajib diupload"],
      },
    };
  }

  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  const filename = `${Date.now()}-${file.name}`;
  const filepath = path.join(process.cwd(), "public/images/uploads", filename);

  fs.writeFileSync(filepath, bytes);

  const url = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${url}/api/menu`, {
    method: "POST",
    body: JSON.stringify({
      name,
      price: Number(price.replace(/\./g, "")),
      stok: Number(stok),
      image: filename,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      error: data.error || "Gagal membuat menu",
      values: { name, price, stok },
    };
  }

  revalidatePath("/dashboard");

  return { success: true, message: data.message };
}

export async function updateMenu(prevState: unknown, formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const stok = formData.get("stock") as string;
    const file = formData.get("file") as File | null;

    const formState = { id, name, price, stok, file };
    console.log("data yang diterima:", formState);

    if (!id || !name || !price || !stok) {
      return {
        message: "Semua field harus diisi",
        errors: { name, price, stok },
      };
    }

    const url = process.env.NEXT_PUBLIC_API_URL;

    let response;

    if (file && file.size > 0) {
      const apiFormData = new FormData();
      apiFormData.append("id", id);
      apiFormData.append("name", name);
      apiFormData.append("price", price);
      apiFormData.append("stok", stok);
      apiFormData.append("file", file);
      console.log("data yang dikirim", apiFormData);
      console.log("Sending with file to API:", `${url}/api/menu/${id}`);

      response = await fetch(`${url}/api/menu/${id}`, {
        method: "PUT",
        body: apiFormData,
      });
    } else {
      console.log("Sending with file to API:", `${url}/api/menu/${id}`);
      response = await fetch(`${url}/api/menu/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          price,
          stok,
        }),
      });
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        errors: { name, price, stok },
      };
    }

    revalidatePath("/dashboard");

    return { success: true, message: data.message || "Menu berhasil diupdate" };
  } catch (error) {
    console.error("Error updating menu:", error);
    return {
      error: true,
      message: "Terjadi kesalahan saat mengupdate menu",
      values: formData,
    };
  }
}

export async function updateProfile(prevState: unknown, formData: FormData) {
  try {
    const username = formData.get("username") as string;
    const file = formData.get("file") as File | null;
    const session = await auth();
    const userid = session?.user.id;

    const formState = new FormData();
    if (username) formState.append("username", username);
    if (file && file.size > 0) formState.append("file", file);
    if (userid) formState.append("userId", userid);

    console.log("data yang dikirim:", { username, file: file?.name });

    if (!username) {
      return {
        error: true,
        message: "Username tidak boleh kosong",
      };
    }

    const url = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(`${url}/api/update-profile`, {
      method: "PUT",
      body: formState,
    });

    let data;
    try {
      data = await response.json();
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return {
        error: true,
        message: "Gagal membaca respon server",
      };
    }

    if (!response.ok) {
      return {
        error: true,
        message: data?.message || "Update gagal",
      };
    }

    return {
      success: true,
      message: data.message || "Profile berhasil diupdate",
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      error: true,
      message: "Terjadi kesalahan saat mengupdate profile",
      values: Object.fromEntries(formData.entries()),
    };
  }
}

export async function updateUser(prevState: unknown, formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const username = formData.get("username") as string;
    const role = formData.get("role") as string;
    const password = formData.get("password") as string;
    const file = formData.get("file") as File | null;

    if (!id || !username || !role) {
      return {
        message: "Field tidak lengkap",
        errors: { username, role },
      };
    }

    const url = process.env.NEXT_PUBLIC_API_URL;

    let response;
    if (file && file.size > 0) {
      const apiFormData = new FormData();
      apiFormData.append("id", id);
      apiFormData.append("username", username);
      apiFormData.append("role", role);
      apiFormData.append("password", password);
      apiFormData.append("file", file);
      console.log("form data", formData);

      response = await fetch(`${url}/api/user/${id}`, {
        method: "PUT",
        body: apiFormData,
      });
      console.log("ini Response", response);
    } else {
      response = await fetch(`${url}/api/user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          role,
          password,
        }),
      });
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        error: true,
        message: data.message || "Gagal update user",
      };
    }

    return { success: true, message: data.message || "Berhasil update user" };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      error: true,
      message: "Terjadi kesalahan saat mengupdate user",
    };
  }
}
