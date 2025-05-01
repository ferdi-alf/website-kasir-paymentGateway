import React, { useActionState, useEffect, useState } from "react";
import ModalLayout from "../modal/ModalLayout";
import { FormButton } from "../SubmitButton";
import Image from "next/image";
import { createMenu } from "@/lib/actions";
import { showErrorToast, showSuccessToast } from "../toast/Toast";
import { mutate } from "swr";

type Errors = {
  [key: string]: string[];
};

const ModalMenu = () => {
  const [state, formAction] = useActionState(createMenu, {
    errors: {} as Errors,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [priceInput, setPriceInput] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [stock, setStok] = useState<string>("");

  useEffect(() => {
    if (state?.success) {
      showSuccessToast(state.message || "Berhasil menambahkan menu baru");
      setPreview(null);
      mutate("menu");
      setPriceInput("");
      setName("");
      setStok("");
    } else if (state?.error) {
      showErrorToast(state.message || "Gagal menambahkan menu baru");
    }
  }, [state]);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  }
  const formatPrice = (value: string) => {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <ModalLayout title="Tambah Menu" textButton="Tambah Menu +" state={state}>
      <form className="space-y-4" action={formAction}>
        <div className="grid gap-4 mb-4 grid-cols-2">
          <div className="flex items-center flex-col justify-center col-span-2">
            <label
              htmlFor="dropzone-file"
              className={`flex flex-col items-center justify-center w-full  border-2 ${
                state?.errors?.file ? "border-red-500" : "border-gray-300"
              }  border-dashed rounded-lg cursor-pointer bg-gray-50 00 hover:bg-gray-100`}
            >
              {preview ? (
                <Image
                  height={80}
                  width={80}
                  src={preview}
                  className="my-2 object-cover rounded-lg"
                  alt="Preview"
                />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">
                      Click untuk upload gambar menu
                    </span>{" "}
                    atau drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG atau JPEG (MAX. 800x400px)
                  </p>
                </div>
              )}

              <input
                onChange={handleImageChange}
                id="dropzone-file"
                name="file"
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                className="hidden"
              />
            </label>
            {state?.errors?.file && (
              <p className="text-red-500">{state.errors.file}</p>
            )}
          </div>

          <div className="col-span-2">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Nama Menu
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              name="name"
              id="name"
              className={`bg-gray-50 border ${
                state.errors?.name ? "border-red-500" : "border-gray-300"
              }  text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 `}
              placeholder="Type product name"
            />
            {state?.errors?.name && (
              <p className="text-red-500 text-xs">{state.errors.name}</p>
            )}
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="price"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Price
            </label>
            <input
              type="number"
              name="price"
              value={priceInput}
              onChange={(e) => setPriceInput(formatPrice(e.target.value))}
              id="price"
              className={`bg-gray-50 border ${
                state.errors?.price ? "border-red-500" : "border-gray-300"
              }  text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 `}
              placeholder="Rp"
            />
            {state?.errors?.price && (
              <p className="text-red-500 text-xs">{state.errors.price}</p>
            )}
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="price"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Stok
            </label>
            <input
              value={stock}
              onChange={(e) => setStok(e.target.value)}
              type="number"
              name="stok"
              id="stok"
              className={`bg-gray-50 border ${
                state.errors?.stok ? "border-red-500" : "border-gray-300"
              }  text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 `}
              placeholder="masukan stok"
            />
            {state?.errors?.stok && (
              <p className="text-red-500 text-xs">{state.errors.stok}</p>
            )}
          </div>
        </div>
        <FormButton />
      </form>
    </ModalLayout>
  );
};

export default ModalMenu;
