import useSWR from "swr";
import TableLoading from "../skeleton/TableLoading";
import Image from "next/image";

interface Data {
  id: string;
  tanggal: string;
  status: string;
  totalHarga: number;
  totalJumlah: number;
  detail: {
    id: string;
    image: string;
    nama: string;
    jumlah: number;
    subTotal: number;
  }[];
}

const HistoryPesanan = () => {
  const { data, error, isLoading } = useSWR("pesanan", async () => {
    const res = await fetch("/api/history-pesanan", { method: "GET" });
    if (!res.ok) throw new Error("Failed to fetch user data");
    return res.json();
  });
  console.log(data);

  if (isLoading) {
    return <TableLoading />;
  }

  if (error) {
    return <p>Error</p>;
  }
  return (
    <div className="w-full p-2 space-y-4 h-96 overflow-auto">
      {data.map((order: Data) => (
        <div
          key={order.id}
          className="rounded-md shadow-xl bg-white p-4 space-y-2 "
        >
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {new Date(order.tanggal).toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
            <p className="text-right font-bold text-green-600">
              Total: <span className="text-green-500 font-medium"></span>
              {order.totalHarga.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </p>
          </div>

          <div className="space-y-2">
            {order.detail.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b pb-2"
              >
                <Image
                  height={60}
                  width={60}
                  className="rounded-md"
                  src={`/images/uploads/${item.image}`}
                  alt={item.nama}
                />
                <div className="flex flex-col">
                  <p className="font-medium">{item.nama}</p>
                  <p className="text-sm text-gray-500">
                    Jumlah: {item.jumlah} | Subtotal:{" "}
                    <span className="text-green-500 font-medium">
                      {" "}
                      {item.subTotal.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryPesanan;
