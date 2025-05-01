import { object, string, z } from "zod";

export const RegisterSchema = object({
  username: string().min(1, "Nama Harus diisi"),
  password: string().min(6, "Password harus lebih dari 6 karakter"),
  confirmPassword: string().min(6, "Konfirmasi password harus diisi"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak sama",
});

export const LoginSchema = object({
  username: string().nonempty("Username Harus diisi"),
  password: string().min(1, "Password Harus diisi"),
});

export const menuSchema = z.object({
  name: z.string().min(1, "Nama menu wajib diisi"),
  price: z
    .string()
    .min(1, "Harga wajib diisi")
    .regex(/^\d+(\.\d+)?$/, "Harga tidak valid"),
  stok: z
    .string()
    .min(1, "Stok wajib diisi")
    .regex(/^\d+$/, "Stok harus angka"),
  file: z.any(), // Untuk file kita cek nanti di action
});

export type MenuSchema = z.infer<typeof menuSchema>;
