/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { auth } from "@/auth";
import { showErrorToast, showSuccessToast } from "@/components/toast/Toast";
import { RegisterCredentials } from "@/lib/actions";
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
import { useRouter } from "next/navigation";
import React, { useActionState, useEffect, useState } from "react";

const RegisterPage = () => {
  const [state, formAction] = useActionState(RegisterCredentials, null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      showSuccessToast(state.message ?? "Operation successful");
      router.push("/");
    } else if (state?.error) {
      showErrorToast(
        "message" in state.error && state.error.message
          ? state.error.message
          : "Terjadi kesalahan"
      );
    }
  }, [state, router]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowPassword2 = () => setShowPassword2((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const handleMouseDownPassword2 = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const handleMouseUpPassword2 = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  return (
    <div className="">
      <h1 className="text-center text-black font-bold">Register</h1>
      <form action={formAction} className="relative flex-col gap-5">
        <div className="mb-6">
          <TextField
            error={
              !!(
                state?.error &&
                "username" in state.error &&
                state.error.username
              )
            }
            helperText={
              state?.error && "username" in state.error
                ? state.error.username
                : undefined
            }
            label="Username"
            fullWidth
            variant="standard"
            color="success"
            name="username"
          />
        </div>
        <FormControl
          variant="standard"
          error={
            !!(
              state?.error &&
              "password" in state.error &&
              state.error.password
            )
          }
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

          <FormHelperText>
            {state?.error && "password" in state.error
              ? String(state.error.password)
              : ""}
          </FormHelperText>
        </FormControl>

        <FormControl
          variant="standard"
          error={
            !!(
              state?.error &&
              "confirmPassword" in state.error &&
              state.error.confirmPassword
            )
          }
          fullWidth
          className="mt-10"
          color="success"
        >
          <InputLabel htmlFor="standard-adornment-password">
            Konfirmasi Password
          </InputLabel>
          <Input
            name="confirmPassword"
            id="standard-adornment-password"
            type={showPassword2 ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? "hide the password" : "display the password"
                  }
                  onClick={handleClickShowPassword2}
                  onMouseDown={handleMouseDownPassword2}
                  onMouseUp={handleMouseUpPassword2}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />

          <FormHelperText>
            {state?.error && "confirmPassword" in state.error
              ? String(state.error.confirmPassword)
              : ""}
          </FormHelperText>
        </FormControl>
        <button className="bg-green-500 mt-10 cursor-pointer hover:bg-green-700  text-white font-bold py-2 px-4 rounded-md w-full">
          Submit
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
