import Image from "next/image";
import Link from "next/link";

import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";

interface ProductItemProps {
  product: typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  };
}

export default function ProductItem({ product }: ProductItemProps) {
  const firtsVariant = product.variants[0];
  return (
    <Link href="/" className="flex flex-col gap-4">
      <Image
        src={firtsVariant.imageUrl}
        alt={firtsVariant.name}
        width={200}
        height={200}
        className="rouded-3xl"
      />
      <div className="flex max-w-[200px] flex-col gap-1">
        <p className="truncate text-sm font-medium">{product.name}</p>
        <p className="text-muted-foreground truncate text-xs font-medium">
          {product.description}
        </p>
        <div className="truncate text-sm font-semibold">
          {formatCentsToBRL(firtsVariant.priceInCents)}
        </div>
      </div>
    </Link>
  );
}
