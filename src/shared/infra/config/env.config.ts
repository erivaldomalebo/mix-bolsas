import { z } from "zod";

const envSchema = z.object({
	PORT: z.coerce.number().default(5500),
	NODE_ENV: z.enum(["production", "development"]).default("production"),
	JWT_SECRET: z.uuid({
		message: "JWT_SECRET deve ser um uuid válido.",
	}),
});

export const env = envSchema.parse(process.env);
