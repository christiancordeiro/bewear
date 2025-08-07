import { useQueryClient } from "@tanstack/react-query";
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { formatCentsToBRL } from "@/helpers/money";
import { useDecreaseCartProduct } from "@/hooks/mutation/use-decrease-cart-product";
import { useIncreaseCartProduct } from "@/hooks/mutation/use-increase-cart-product";
import { useRemoveProductFromCart } from "@/hooks/mutation/use-remove-product-from-cart";

import { Button } from "../ui/button";

interface CartItemProps {
  id: string;
  productName: string;
  productVariantId: string;
  productVariantName: string;
  productVariantImageUrl: string;
  productVariantPriceInCents: number;
  quantity: number;
}

export default function CartItem({
  id,
  productName,
  productVariantId,
  productVariantName,
  productVariantImageUrl,
  productVariantPriceInCents,
  quantity,
}: CartItemProps) {
  const queryClient = useQueryClient();
  const removeProductFromCartMutation = useRemoveProductFromCart(id);
  const decreaseCartProductsQuantityMutation = useDecreaseCartProduct(id);
  const increaseCartProductsQuantityMutation =
    useIncreaseCartProduct(productVariantId);

  const handleDeleteClick = () => {
    removeProductFromCartMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        toast.success("Produto removido do carrinho");
      },
      onError: () => {
        toast.error("Erro ao remover produto do carrinho");
      },
    });
  };

  const handleDecreaseQuantityClick = () => {
    decreaseCartProductsQuantityMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        toast.success("Quantidade do produto diminuida");
      },
      onError: () => {
        toast.error("Erro ao diminuir a quantidade do produto");
      },
    });
  };

  const handleIncreaseQuantityClick = () => {
    increaseCartProductsQuantityMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Quantidade do produto aumentada");
      },
      onError: () => {
        toast.error("Erro ao aumentar a quantidade do produto");
      },
    });
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image
          src={productVariantImageUrl}
          alt={productVariantName}
          width={78}
          height={78}
          className="rounded-lg"
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">{productName}</p>
          <p className="text-muted-foreground text-xs font-medium">
            {productVariantName}
          </p>
          <div className="flex w-[100px] items-center justify-between rounded-lg border p-1">
            <Button
              className="h-4 w-4"
              variant="ghost"
              onClick={handleDecreaseQuantityClick}
            >
              <MinusIcon />
            </Button>
            <p className="text-xs font-medium">{quantity}</p>
            <Button
              className="h-4 w-4"
              variant="ghost"
              onClick={handleIncreaseQuantityClick}
            >
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end justify-center gap-2">
        <Button variant="outline" size="icon" onClick={handleDeleteClick}>
          <TrashIcon />
        </Button>
        <p className="text-sm font-bold">
          {formatCentsToBRL(productVariantPriceInCents)}
        </p>
      </div>
    </div>
  );
}
