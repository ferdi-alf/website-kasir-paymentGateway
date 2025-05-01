import * as React from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FilterListIcon from "@mui/icons-material/FilterList";
import useSWR from "swr";
import TableLoading from "../skeleton/TableLoading";
import { DrawerDemo } from "../DrawerPesanan";

interface Data {
  id: string;
  tanggal: string;
  status: string;
  totalHarga: number;
  totalJumlah: number;
  pembeli: string;
  detail: {
    id: string;
    image: string;
    nama: string;
    jumlah: number;
    subTotal: number;
  }[];
}

function EnhancedTableHead() {
  return (
    <TableHead>
      <TableRow>
        <TableCell className="truncate">Order Id</TableCell>
        <TableCell className="truncate">Atas Nama</TableCell>
        <TableCell className="truncate">Total Menu</TableCell>
        <TableCell>Harga</TableCell>
        <TableCell>Tanggal</TableCell>
        <TableCell>Status</TableCell>
        <TableCell>Action</TableCell>
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar() {
  return (
    <div className="flex justify-between">
      <Typography variant="h6" id="tableTitle" component="div">
        Harap konfirmasi pesanan
      </Typography>

      <Tooltip title="Filter list">
        <IconButton>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}

const statusLabel: Record<string, string> = {
  MenungguPembayaran: "Menunggu Pembayaran",
  MenungguKonfirmasi: "Menunggu Konfirmasi",
  Dikonfirmasi: "Dikonfirmasi",
  Dibayar: "Dibayar",
  Gagal: "Gagal",
};

export default function ConfirmTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { data, error, isLoading } = useSWR("pesanan", async () => {
    const res = await fetch("/api/pesanan", { method: "GET" });
    if (!res.ok) throw new Error("Failed to fetch user data");
    return res.json();
  });

  if (isLoading) {
    return <TableLoading />;
  }

  if (error) {
    return <p>Error</p>;
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="h-96 overflow-auto">
      <EnhancedTableToolbar />
      <TableContainer>
        <Table aria-labelledby="tableTitle">
          <EnhancedTableHead />
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order: Data) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    <p className="font-bold">{order.pembeli}</p>
                  </TableCell>
                  <TableCell>{order.totalJumlah}</TableCell>
                  <TableCell>
                    <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm  border border-green-400">
                      {order.totalHarga.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(order.tanggal).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell>{statusLabel[order.status]}</TableCell>
                  <TableCell>
                    <DrawerDemo order={order} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length} // Gantilah dari '1' ke 'data.length'
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}
