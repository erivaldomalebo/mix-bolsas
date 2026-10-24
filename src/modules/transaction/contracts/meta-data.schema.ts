import { z } from "zod";

export const transactionSchema = z.object({
	id: z.uuid(),
	amount: z
		.number()
		.int("O valor deve ser um número inteiro (em Kwanzas).")
		.positive("O valor deve ser maior que zero.")
		.describe("Valor da transação em AOA"),
	currency: z
		.literal("AOA")
		.default("AOA")
		.describe("Moeda oficial da transação"),
	status: z
		.enum(["pending", "approved", "declined"])
		.describe("Estado atual da transação"),
	refusalReason: z
		.string()
		.nullable()
		.describe("Motivo da recusa, caso a transação tenha sido rejeitada"),
	paymentMethod: z
		.enum(["multicaixa_express", "reference"])
		.describe("Método de pagamento utilizado"),
	studentId: z.string().describe("ID do estudante associado à transação"),
	scholarshipId: z.string().describe("ID da bolsa de estudo associada"),
	phoneNumber: z
		.string()
		.nullable()
		.describe("Número de telefone (preenchido se for Multicaixa Express)"),
	entity: z
		.string()
		.nullable()
		.describe("Entidade de pagamento (preenchido se for Referência)"),
	reference: z
		.string()
		.nullable()
		.describe("Número de referência (preenchido se for Referência)"),
	createdAt: z.string().or(z.date()).describe("Data de criação do registro"),
	UpdatedAt: z
		.string()
		.or(z.date())
		.describe("Data de atualização do registro"),
});

export const findOneTransactionResponseSchema = z.object({
	message: z.string(),
	data: transactionSchema,
});

export const createTransactionResponseSchema = z.object({
	message: z.string(),
	data: transactionSchema,
});
