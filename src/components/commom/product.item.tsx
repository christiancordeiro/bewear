import Image from "next/image";
import Link from "next/link";

import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";
import { cn } from "@/lib/utils";

interface ProductItemProps {
  product: typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  };
  textContainerClassName?: string;
}

export default function ProductItem({
  product,
  textContainerClassName,
}: ProductItemProps) {
  const firtsVariant = product.variants[0];
  return (
    <Link href="/" className="flex flex-col gap-4">
      <Image
        src={firtsVariant.imageUrl}
        alt={firtsVariant.name}
        width={0}
        height={0}
        sizes="180vw"
        className="h-auto w-full rounded-3xl"
      />
      <div
        className={cn(
          "flex max-w-[200px] flex-col gap-1",
          textContainerClassName,
        )}
      >
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
