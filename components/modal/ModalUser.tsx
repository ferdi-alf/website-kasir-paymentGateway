/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import ModalLayout from "../modal/ModalLayout";
import { FormButton } from "../SubmitButton";
import { showErrorToast, showSuccessToast } from "../toast/Toast";
import { mutate } from "swr";
import {
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { z } from "zod";

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

type UserFormData = z.infer<typeof userSchema>;
type Errors = {
  [key: string]: string[];
};

const ModalUser = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSuccess(false);

    const formData = new FormData(event.currentTarget);
    const userData = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      role: formData.get("role") as string,
    };

    const validationResult = userSchema.safeParse(userData);

    if (!validationResult.success) {
      const formattedErrors: Errors = {};
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (!formattedErrors[path]) {
          formattedErrors[path] = [];
        }
        formattedErrors[path].push(issue.message);
      });
      setErrors(formattedErrors);
      setIsLoading(false);
      return;
    }

    try {
      const url = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${url}/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menambahkan user");
      }

      const result = await response.json();
      setSuccess(true);

      mutate("/api/users");
    } catch (error) {
      setErrors({
        form: [(error as Error).message],
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      showSuccessToast("User berhasil ditambahkan");
      mutate("users");
      formRef.current?.reset(); // reset form
      setSuccess(false);
    }
  }, [success]);

  return (
    <ModalLayout
      title="Tambah User"
      textButton="Tambah User +"
      state={{ success }}
    >
      {errors.form && (
        <div className="p-3 mb-4 text-sm text-red-800 bg-red-100 rounded-lg">
          {errors.form.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}

      <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
        <div className="mb-6">
          <TextField
            error={!!errors.username}
            helperText={errors.username && errors.username[0]}
            label="Username"
            fullWidth
            variant="standard"
            color="success"
            name="username"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="role"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Pilih Role
          </label>
          <select
            name="role"
            id="role"
            className={`bg-gray-50 border ${
              errors.role ? "border-red-500" : "border-gray-300"
            } text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5`}
          >
            <option value="">Pilih Role</option>
            <option value="ADMIN">Admin</option>
            <option value="KASIR">Kasir</option>
            <option value="PEMBELI">Pembeli</option>
          </select>
          {errors.role && (
            <span className="text-sm text-red-500">{errors.role[0]}</span>
          )}
        </div>

        <FormControl
          variant="standard"
          error={!!errors.password}
          fullWidth
          className="mt-6"
          color="success"
        >
          <InputLabel htmlFor="standard-adornment-password">
            Password
          </InputLabel>
          <Input
            name="password"
            id="standard-adornment-password"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? "hide the password" : "display the password"
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />

          {errors.password && (
            <FormHelperText error>{errors.password[0]}</FormHelperText>
          )}
        </FormControl>

        <div className="mt-6">
          <FormButton />
        </div>
      </form>
    </ModalLayout>
  );
};

export default ModalUser;
