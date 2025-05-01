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
} from "@mui/material";
import React, { useActionState, useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import useSWR, { mutate } from "swr";
import TableLoading from "../skeleton/TableLoading";
import { showErrorToast, showSuccessToast } from "../toast/Toast";
import { FormButton } from "../SubmitButton";
import Image from "next/image";
import { updateMenu } from "@/lib/actions";
import DeleteButton from "../DeleteButton";

// Interface
interface Menu {
  id: string;
  name: string;
  price: number;
  stok: number;
  image: string;
}

// Fetch Data
const fetchData = async () => {
  const response = await fetch("/api/get-menu", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data.data;
};

// Row Komponen
function Row({ row }: { row: Menu }) {
  const [open, setOpen] = React.useState(false);
  const [priceInput, setPriceInput] = useState<string>(
    row.price ? row.price.toString() : ""
  );

  const [preview, setPreview] = useState<string | null>(null);
  const [state, formAction] = useActionState(updateMenu, null);
  console.log(state);

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
      mutate("menu");
    }
    if (state?.error || state?.errors) {
      showErrorToast(state.message || "An error occurred");
    }
  }, [state]);

  const formatPrice = (value: string) => {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  useEffect(() => {
    if (row.price) {
      setPriceInput(formatPrice(row.price.toString()));
    }
  }, [row.price]);

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
          <Image
            width={80}
            height={80}
            src={`/images/uploads/${row.image}`}
            alt={row.name}
            className="w-16 h-16 object-cover"
          />
        </TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.price}</TableCell>
        <TableCell>{row.stok}</TableCell>
        <TableCell>
          <DeleteButton api="/api/menu/" id={row.id} />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Edit Data
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
                          src={preview || `/images/uploads/${row.image}`}
                          alt="Preview"
                          className="my-2 object-cover rounded-lg"
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
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium"
                    >
                      Nama Menu
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      defaultValue={row.name}
                      className="bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="price"
                      className="block mb-2 text-sm font-medium"
                    >
                      Harga
                    </label>
                    <input
                      value={priceInput}
                      onChange={(e) => {
                        const input = e.target.value;
                        setPriceInput(formatPrice(input));
                      }}
                      type="text"
                      name="price"
                      id="price"
                      placeholder="Rp"
                      className="bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="stock"
                      className="block mb-2 text-sm font-medium"
                    >
                      Stock
                    </label>
                    <input
                      type="number"
                      name="stock"
                      id="stock"
                      defaultValue={row.stok}
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

// TableStockMenu
const TableStockMenu = () => {
  const { data: rawData, error, isLoading } = useSWR<Menu[]>("menu", fetchData);
  console.log("rawData", rawData);

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
            <TableCell>Image</TableCell>
            <TableCell>Nama Menu</TableCell>
            <TableCell>Harga</TableCell>
            <TableCell>Stock</TableCell>
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

export default TableStockMenu;
