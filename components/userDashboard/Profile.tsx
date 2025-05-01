/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useActionState, useEffect, useState } from "react";
import AvatarPorfile from "./AvatarProfile";
import { FormButton } from "../SubmitButton";
import { Avatar, Skeleton } from "@mui/material";
import { updateProfile } from "@/lib/actions";
import { showErrorToast, showSuccessToast } from "../toast/Toast";
import useSWR, { mutate } from "swr";

const Profile = () => {
  const [user, setUser] = useState({
    username: "",
    role: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [state, formAction] = useActionState(updateProfile, null);
  console.log(state);

  const { data, error } = useSWR("profile", async () => {
    const res = await fetch("/api/user/me", { method: "GET" });
    if (!res.ok) throw new Error("Failed to fetch user data");
    return res.json();
  });

  useEffect(() => {
    if (state?.success) {
      showSuccessToast(state.message);
      mutate("profile");
    } else if (state?.error) {
      showErrorToast(state.message);
    }
  }, [state]);

  useEffect(() => {
    if (data) {
      setUser(data);
      setLoading(false);
    }
  }, [data]);

  return (
    <div className="flex p-2 w-full md:w-1/4 bg-white shadow-lg rounded-lg items-center md:flex-col flex-row justify-around">
      <form action={formAction}>
        {loading ? (
          <Skeleton variant="circular" className="w-full">
            <Avatar />
          </Skeleton>
        ) : (
          <AvatarPorfile
            avatar={user?.image ? user.image : "/default-avatar.png"}
          />
        )}

        <div className="w-full">
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Username
          </label>
          <input
            defaultValue={user?.username}
            type="text"
            id="username"
            name="username"
            className="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-green-500 block p-2.5"
            required
          />
          <FormButton />
        </div>
      </form>
    </div>
  );
};

export default Profile;
