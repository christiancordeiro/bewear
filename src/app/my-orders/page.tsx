import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Footer from "@/components/commom/footer";
import Header from "@/components/commom/header";
import { db } from "@/db";
import { orderTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import Orders from "./components/orders";

export default async function MyOrdersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    redirect("/login");
  }
  const orders = await db.query.orderTable.findMany({
    where: eq(orderTable.userId, session?.user.id),
    with: {
      items: {
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });
  return (
    <>
      <Header />

      <div className="px-5">
        <Orders
          orders={orders.map((order) => ({
            id: order.id,
            totalPriceInCents: order.totalPriceInCents,
            status: order.status,
            createdAt: order.createdAt.toISOString(),
            items: order.items.map((item) => ({
              id: item.id,
              imageUrl: item.productVariant.imageUrl,
              productName: item.productVariant.product.name,
              productVariantName: item.productVariant.name,
              priceInCents: item.productVariant.priceInCents,
              quantity: item.quantity,
            })),
          }))}
        />
      </div>
      <div className="mt-12">
        <Footer />
      </div>
    </>
  );
}
