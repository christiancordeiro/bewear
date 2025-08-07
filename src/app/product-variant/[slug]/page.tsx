import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";

import Footer from "@/components/commom/footer";
import Header from "@/components/commom/header";
import ProductList from "@/components/commom/product.list";
import { db } from "@/db";
import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";

import VariantSelector from "../components/variant-selector";
import ProductActions from "./components/product-actions";

interface ProductVariantPageProps {
  params: { slug: string };
}

export default async function ProductVariantPage({
  params,
}: ProductVariantPageProps) {
  const { slug } = params;
  const productVariant = await db.query.productVariantTable.findFirst({
    where: eq(productVariantTable.slug, slug),
    with: {
      product: {
        with: { variants: true },
      },
    },
  });
  if (!productVariant) {
    return notFound();
  }

  const likelyProducts = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, productVariant.product.categoryId),
    with: {
      variants: true,
    },
  });

  return (
    <>
      <Header />
      <div className="flex flex-col space-y-6">
        <Image
          src={productVariant.imageUrl}
          alt={productVariant.name}
          width={0}
          height={0}
          sizes="100vw"
          className="h-auto w-full object-cover"
        />

        <div className="px-5">
          <VariantSelector
            variants={productVariant.product.variants}
            selectedVariantSlug={productVariant.slug}
          />
        </div>

        <div className="px-5">
          {/*DESCRICAO */}

          <h2 className="text-lg font-semibold">
            {productVariant.product.name}
          </h2>

          <h3 className="text-muted-foreground text-sm">
            {productVariant.name}
          </h3>

          <h3 className="text-lg font-semibold">
            {formatCentsToBRL(productVariant.priceInCents)}
          </h3>
        </div>

        <ProductActions productVariantId={productVariant.id} />

        <div className="px-5">
          <p className="text-shadow-amber-600">
            {productVariant.product.description}
          </p>
        </div>

        <ProductList title="Produtos similares" products={likelyProducts} />
        <Footer />
      </div>
    </>
  );
}
