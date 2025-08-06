import { desc } from "drizzle-orm";
import Image from "next/image";

import CategorySelector from "@/components/commom/category.selector";
import Footer from "@/components/commom/footer";
import Header from "@/components/commom/header";
import ProductList from "@/components/commom/product.list";
import { db } from "@/db";
import { productTable } from "@/db/schema";

export default async function Home() {
  const product = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });

  const newlyCreatedProduct = await db.query.productTable.findMany({
    orderBy: [desc(productTable.createdAt)],
    with: {
      variants: true,
    },
  });
  const categories = await db.query.categoryTable.findMany({});

  return (
    <>
      <Header />
      <div className="space-y-6">
        <div className="px-5">
          <Image
            src="/banner.png"
            alt="Leve uma vida com estilo"
            width={0}
            height={0}
            sizes="100vw"
            className="h-auto w-full"
          />
        </div>

        <ProductList title="Mais vendidos" products={product} />

        <div className="px-5">
          <CategorySelector categories={categories} />
        </div>

        <div className="px-5">
          <Image
            src="/banner02.png"
            alt="Leve uma vida com estilo"
            width={0}
            height={0}
            sizes="100vw"
            className="h-auto w-full"
          />
        </div>
        <ProductList title="Novos produtos" products={newlyCreatedProduct} />
        <Footer />
      </div>
    </>
  );
}
