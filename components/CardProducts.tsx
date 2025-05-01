"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface CardProductsProps {
  id: number;
  price: number;
  image: string;
  totalDibeli?: number;
  title: string;
}

const CardProducts = () => {
  const [data, setData] = useState<CardProductsProps[]>([]);
  const [loading, setLoading] = useState(true);
  console.log("data", data);

  useEffect(() => {
    const getMenu = async () => {
      try {
        const res = await fetch("/api/get-menu");
        const json = await res.json();
        setData(json.data);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setLoading(false);
      }
    };

    getMenu();
  }, []);

  if (loading) return <p className="p-4">Loading menu...</p>;

  return (
    <div className="w-full p-2 grid md:grid-cols-3 lg:grid-cols-5 grid-cols-2 mt-5 gap-4">
      {data.map((item) => (
        <div
          key={item.id}
          className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm"
        >
          <a href="#">
            <Image
              width={80}
              height={80}
              className="w-full md:h-60 h-36 object-cover p-3 rounded-t-lg"
              src={
                `/images/uploads/${item.image}` ||
                "https://via.placeholder.com/300x300.png?text=No+Image"
              }
              alt={item.title || "No title"}
            />
          </a>
          <div className="px-5 pb-5">
            <a href="#" className="flex flex-nowrap gap-2">
              <h5 className="md:text-lg text-md font-semibold tracking-tight text-gray-900">
                {item.title}
              </h5>
            </a>
            <span className="bg-green-100 text-green-800 text-xs font-medium me-2 p-1 rounded-sm border border-green-400">
              <span className="font-bold">{item.totalDibeli ?? 0}x</span> dibeli
            </span>

            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-green-500">
                Rp {item.price.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardProducts;
