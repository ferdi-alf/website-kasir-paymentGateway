"use client";
import { FormButton } from "@/components/SubmitButton";
import { showErrorToast, showSuccessToast } from "@/components/toast/Toast";
import { loginCrendentials } from "@/lib/actions";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useActionState, useEffect, useState } from "react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction] = useActionState(loginCrendentials, null);
  const router = useRouter();
  console.log("anjay", state);

  useEffect(() => {
    if (state?.success) {
      showSuccessToast(state.message ?? "Operation successful");

      setTimeout(() => {
        router.replace("/");
      }, 1500);
    } else if (state?.errors) {
      showErrorToast(state.message ?? "Terjadi kesalahan");
    }
  }, [state, router]);

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
  return (
    <div className="">
      <h1 className="text-center text-black font-bold">Login</h1>
      <form action={formAction} className="relative flex-col gap-5">
        <div className="mb-6">
          <TextField
            error={!!state?.error?.username}
            helperText={state?.error?.username}
            label="Username"
            fullWidth
            variant="standard"
            color="success"
            name="username"
          />
        </div>
        <FormControl
          variant="standard"
          error={!!state?.error?.password}
          fullWidth
          className="mt-10"
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

          <FormHelperText>{state?.error?.password}</FormHelperText>
        </FormControl>
        <FormButton />
      </form>
      <div className="flex justify-center mt-5">
        <p className="text-gray-500">Belum punya akun?</p>
        <Link href="/register" className="text-green-500 font-bold ml-2">
          Daftar Disini
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
