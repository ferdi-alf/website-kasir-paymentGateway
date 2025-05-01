import { auth } from "@/auth";
import CardProducts from "@/components/CardProducts";
import OrderButton from "@/components/OrderButton";

export default async function Home() {
  const session = await auth();
  console.log("babi", session);
  return (
    <div className="w-full relative h-screen bg-slate-50">
      <div className="">
        <CardProducts />
      </div>
      <OrderButton />
    </div>
  );
}
