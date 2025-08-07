import z from "zod";

export const decreaseCartProductsQuantitySchema = z.object({
  cartItemId: z.uuid(),
});

export type DecreaseCartProductsQuantitySchema = z.infer<
  typeof decreaseCartProductsQuantitySchema
>;
