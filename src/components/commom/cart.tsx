import { useQuery } from "@tanstack/react-query";
import { ShoppingBasketIcon } from "lucide-react";
import Image from "next/image";

import { getCart } from "@/actions/get-cart";

import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";

export default function Cart() {
  const { data: cart, isPending: cartIsLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(),
  });
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <ShoppingBasketIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle>Carrinho</SheetTitle>
        {cartIsLoading && <div>Carrinho está carregando...</div>}
        {cart?.items.map((item) => (
          <div key={item.id}>
            <Image
              src={item.productVariant.imageUrl}
              width={100}
              height={100}
              alt={item.productVariant.product.name}
            />
            <div>
              <h3>{item.productVariant.product.name}</h3>
            </div>
          </div>
        ))}
      </SheetContent>
    </Sheet>
  );
}
