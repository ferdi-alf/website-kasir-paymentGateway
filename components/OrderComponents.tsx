"use client";
import { useFetchData } from "@/hook/useFetchData";
import { useEffect, useState } from "react";
import TableLoading from "./skeleton/TableLoading";
import Image from "next/image";
import { Checkbox } from "@mui/material";
import { formatPrice } from "@/lib/formatPrice";
import Payment from "./PaymentComponent";

export interface Menu {
  id: string;
  name: string;
  image: string;
  price: number;
  stok: number;
}

const OrderComponents = () => {
  const { data: menus, loading } = useFetchData<Menu[]>("/api/get-menu");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [counts, setCounts] = useState<{ [id: string]: number }>({});
  const [selectedItems, setSelectedItems] = useState<{
    [id: string]: { count: number; price: number; image: string; name: string };
  }>({});

  const getCount = (id: string) => {
    if (selectedIds.includes(id) && counts[id] === undefined) {
      return 1;
    }
    return counts[id] || 0;
  };

  const handleTambah = (row: Menu) => {
    const { id, stok, price, image, name } = row;
    const currentCount = counts[id] !== undefined ? counts[id] : 0;
    const newCount = currentCount + 1;

    if (newCount > stok) return;

    setCounts((prev) => ({ ...prev, [id]: newCount }));

    setSelectedItems((prev) => ({
      ...prev,
      [id]: {
        id: id,
        count: newCount,
        price: price,
        image: image,
        name: name,
      },
    }));

    if (!selectedIds.includes(id)) {
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  const handleSubtract = (row: Menu) => {
    const { id } = row;
    const current = counts[id] !== undefined ? counts[id] : 1;
    const newCount = current - 1;

    if (newCount <= 0) {
      setCounts((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

      setSelectedItems((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

      setSelectedIds((prev) => prev.filter((i) => i !== id));
      return;
    }

    setCounts((prev) => ({ ...prev, [id]: newCount }));
    setSelectedItems((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        id: id,
        count: newCount,
      },
    }));
  };

  const toggleCheckbox = (id: string, row: Menu) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        setCounts((prevCounts) => {
          const updated = { ...prevCounts };
          delete updated[id];
          return updated;
        });

        setSelectedItems((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });

        return prev.filter((i) => i !== id);
      } else {
        const newCount = 1;
        setCounts((prevCounts) => ({
          ...prevCounts,
          [id]: newCount,
        }));

        setSelectedItems((prev) => ({
          ...prev,
          [id]: {
            id: row.id,
            count: newCount,
            price: row.price,
            image: row.image,
            name: row.name,
          },
        }));

        return [...prev, id];
      }
    });
  };

  useEffect(() => {
    if (menus) {
      console.log("Data menu:", menus);
    }
  }, [menus]);

  // For debugging
  useEffect(() => {
    console.log("Selected items in OrderComponents:", selectedItems);
  }, [selectedItems]);

  if (loading) {
    return <TableLoading />;
  }
  return (
    <div className="bg-white md:w-4/5 w-11/12 shadow-md mt-10 pb-24 rounded-lg py-2 px-3">
      {menus?.data.map((row) => {
        const isSelected = selectedIds.includes(row.id);
        const count = getCount(row.id);

        return (
          <div
            key={row.id}
            className={`flex w-full hover:bg-gray-100 md:justify-normal justify-between ${
              isSelected ? "bg-gray-200" : ""
            } flex-nowrap duration-100  border-b p-2 gap-3`}
          >
            <div className="flex">
              <div className="flex items-center self-stretch">
                <Checkbox
                  color="primary"
                  onChange={() => toggleCheckbox(row.id, row)}
                  checked={isSelected}
                />
              </div>

              <div className=" ">
                <Image
                  height={80}
                  width={80}
                  alt={`gambar menu ${row.name}`}
                  src={`/images/uploads/${row.image}`}
                  className="w-full rounded-lg h-full"
                />
              </div>
            </div>

            <div className="truncate flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-xl">{row.name}</h3>
                <p className="font-semibold text-green-500 mt-1 text-lg">{`RP ${formatPrice(
                  row.price
                )}`}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-thin">Stok tersisa: {row.stok}</p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubtract(row);
                    }}
                    className="px-3 py-1 bg-gray-200 text-black rounded hover:bg-gray-300"
                  >
                    −
                  </button>
                  <span className="w-6 text-center">{count}</span>
                  <button
                    disabled={count >= row.stok}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTambah(row);
                    }}
                    className={`${
                      count >= row.stok && "opacity-30 cursor-not-allowed"
                    } px-3 py-1 bg-gray-200 text-black rounded hover:bg-gray-300`}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <Payment selectedItems={selectedItems} />
    </div>
  );
};

export default OrderComponents;
