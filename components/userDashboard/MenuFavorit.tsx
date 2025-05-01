import useSWR from "swr";
import TableLoading from "../skeleton/TableLoading";
import Image from "next/image";

interface FavoritData {
  id: string;
  nama: string;
  harga: number;
  image: string;
  totalDipesan: number;
}

const MenuFavorit = () => {
  const { data, error, isLoading } = useSWR("menu-favorit", async () => {
    const res = await fetch("/api/menu-favorit", { method: "GET" });
    if (!res.ok) throw new Error("Failed to fetch menu favorit");
    return res.json();
  });

  if (isLoading) return <TableLoading />;
  if (error) return <p>Error</p>;

  return (
    <div className="w-full p-4 space-y-4 h-96 overflow-auto">
      <h2 className="text-xl font-bold mb-2">Menu Favorit</h2>
      {data.map((item: FavoritData) => (
        <div
          key={item.id}
          className="flex items-center justify-between  p-4 rounded-md shadow-xl bg-white"
        >
          <div className="flex items-center gap-4">
            <Image
              src={`/images/uploads/${item.image}`}
              alt={item.nama}
              width={60}
              height={60}
              className="rounded-md"
            />
            <div>
              <p className="font-semibold text-lg">{item.nama}</p>
              <p className="text-sm text-gray-600">
                Total Dipesan: {item.totalDipesan}x
              </p>
            </div>
          </div>
          <p className="text-green-600 font-bold">
            {item.harga.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MenuFavorit;
