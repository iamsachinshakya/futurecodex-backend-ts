import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default("5000"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.format());
    process.exit(1);
}

export const env = parsed.data;
