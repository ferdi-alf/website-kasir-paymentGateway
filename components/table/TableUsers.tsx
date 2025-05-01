import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import React, { useActionState, useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import useSWR, { mutate } from "swr";
import TableLoading from "../skeleton/TableLoading";
import { showErrorToast, showSuccessToast } from "../toast/Toast";
import { FormButton } from "../SubmitButton";
import Image from "next/image";
// import { updateUser } from "@/lib/actions";
import DeleteButton from "../DeleteButton";
import { updateUser } from "@/lib/actions";

interface User {
  id: string;
  username: string | null;
  image: string | null;
  role: string;
}

enum Role {
  PEMBELI = "PEMBELI",
  ADMIN = "ADMIN",
  KASIR = "KASIR",
}

const fetchData = async () => {
  const response = await fetch("/api/get-users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data.data;
};

// Row Komponen
function Row({ row }: { row: User }) {
  const [open, setOpen] = React.useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [role, setRole] = useState<string>(row.role);
  const [state, formAction] = useActionState(updateUser, null);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  }

  useEffect(() => {
    if (state?.success) {
      showSuccessToast(state.message);
      mutate("users");
    }
    if (state?.error || state?.errors) {
      showErrorToast(state.message || "An error occurred");
    }
  }, [state]);

  useEffect(() => {
    setRole(row.role);
  }, [row.role]);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell>
          {row.image ? (
            <Image
              width={80}
              height={80}
              src={row.image}
              alt={row.username || "User"}
              className="md:w-20 md:h-20 w-10 h-10 bject-cover rounded-full"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500 text-xl">
                {row.username?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
          )}
        </TableCell>
        <TableCell>{row.username || "Tidak ada username"}</TableCell>
        <TableCell>{row.role}</TableCell>
        <TableCell>
          <DeleteButton api="/api/user/" id={row.id} />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Edit User
              </Typography>
              <form className="space-y-4" action={formAction}>
                <input type="hidden" name="id" value={row.id} />
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="flex items-center flex-col justify-center col-span-2">
                    <label
                      htmlFor="dropzone-file-image"
                      className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="my-2">
                        <Image
                          height={80}
                          width={80}
                          src={preview || row.image || "/default-avatar.png"}
                          alt="Preview"
                          className="my-2 h-20 w-20 object-cover rounded-full"
                        />
                      </div>

                      <input
                        onChange={handleImageChange}
                        id="dropzone-file-image"
                        name="file"
                        type="file"
                        accept="image/png, image/jpg, image/jpeg"
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="username"
                      className="block mb-2 text-sm font-medium"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      defaultValue={row.username || ""}
                      className="bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    />
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="role"
                      className="block mb-2 text-sm font-medium"
                    >
                      Role
                    </label>
                    <FormControl fullWidth>
                      <Select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        name="role"
                        id="role"
                        className="bg-gray-50"
                      >
                        <MenuItem value={Role.PEMBELI}>PEMBELI</MenuItem>
                        <MenuItem value={Role.ADMIN}>ADMIN</MenuItem>
                        <MenuItem value={Role.KASIR}>KASIR</MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium"
                    >
                      Password Baru (Kosongkan jika tidak ingin mengubah)
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    />
                  </div>
                </div>

                <FormButton />
              </form>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

// TableUsers
const TableUsers = () => {
  const {
    data: rawData,
    error,
    isLoading,
  } = useSWR<User[]>("users", fetchData);

  console.log("wwk", rawData);

  if (isLoading) {
    return <TableLoading />;
  }
  if (error) {
    showErrorToast("Gagal memuat data");
    return <div>Error loading data...</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Avatar</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rawData?.map((row) => (
            <Row key={row.id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableUsers;
