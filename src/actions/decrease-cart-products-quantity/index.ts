"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { cartItemTable, cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import {
  DecreaseCartProductsQuantitySchema,
  decreaseCartProductsQuantitySchema,
} from "./schema";

export const decreaseCartProductQuantity = async (
  data: DecreaseCartProductsQuantitySchema,
) => {
  decreaseCartProductsQuantitySchema.parse(data);
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Pegar carrinho
  const cart = await db.query.cartTable.findFirst({
    where: eq(cartTable.userId, session.user.id),
  });
  let cartId = cart?.id;
  if (!cartId) {
    const [newCart] = await db
      .insert(cartTable)
      .values({
        userId: session.user.id,
      })
      .returning();
    cartId = newCart.id;
  }

  // Verificar se a variante já existe no carrinho
  const cartItem = await db.query.cartItemTable.findFirst({
    where: (cartItem, { eq }) => eq(cartItem.cartId, cartId),
    with: {
      cart: true,
    },
  });
  if (!cartItem) {
    throw new Error("Cart item not found");
  }
  const cartDoesNotBelongToUser = cartItem.cart.userId !== session.user.id;
  if (cartDoesNotBelongToUser) {
    throw new Error("Unauthorized");
  }
  if (cartItem.quantity === 1) {
    await db.delete(cartItemTable).where(eq(cartItemTable.id, cartItem.id));
    return;
  }
  await db
    .update(cartItemTable)
    .set({
      quantity: cartItem.quantity - 1,
    })
    .where(eq(cartItemTable.id, cartItem.id));
};
