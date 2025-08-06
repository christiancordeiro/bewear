import z from "zod";

export const addCartProductSchema = z.object({
  productVariantId: z.uuid(),
  quantity: z.number().min(1),
});

export type AddCartProductSchema = z.infer<typeof addCartProductSchema>;
