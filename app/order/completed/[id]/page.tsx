// app/order/[id]/page.tsx
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import OrderCompletedClient from "./OrderCompletedPage";
// ⬅️ Client component

export default async function OrderCompletedPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session || !session.user) return notFound();

  const order = await prisma.penjualan.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      detail: {
        include: { menu: { select: { name: true } } },
      },
      user: true,
    },
  });

  if (!order) return notFound();

  return <OrderCompletedClient order={order} />;
}
