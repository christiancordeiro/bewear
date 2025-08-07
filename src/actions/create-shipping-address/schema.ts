import { z } from "zod";

export const createAddressSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(1),
  cpf: z.string().min(14),
  phone: z.string().min(1),
  zipCode: z.string().min(1),
  address: z.string().min(1),
  number: z.string().min(1),
  complement: z.string().optional(),
  district: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
});

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
