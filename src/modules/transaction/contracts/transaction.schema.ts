import { z } from "zod";

export const paymentMethodEnum = z
	.enum(["multicaixa_express", "reference"])
	.describe(
		"Método de pagamento utilizado (Multicaixa Express ou Referência EMIS)",
	);

export type PaymentMethod = z.infer<typeof paymentMethodEnum>;

const multicaixaExpressSchema = z
	.object({
		paymentMethod: z
			.literal(paymentMethodEnum.enum.multicaixa_express)
			.describe("Identificador fixo para o método Multicaixa Express"),
		amount: z
			.number({ error: "O campo 'amount' é obrigatório." })
			.int("O valor deve ser um número inteiro (em Kwanzas).")
			.positive("O valor deve ser maior que zero.")
			.describe(
				"Valor total da transação cobrado ao bolsista, expresso em Kwanzas (AOA)",
			),
		currency: z
			.literal("AOA")
			.default("AOA")
			.describe("Moeda oficial da transação (fixada em AOA)"),
		studentId: z
			.string({ error: "O ID do estudante é obrigatório." })
			.min(3, "O ID do estudante é inválido.")
			.describe(
				"Identificador único (UUID ou código) do estudante no sistema acadêmico",
			),
		scholarshipId: z
			.string({
				error: "O ID da bolsa de estudo é obrigatório.",
			})
			.describe(
				"Identificador da bolsa ou programa de auxílio associado a este pagamento",
			),
		phoneNumber: z
			.string({ error: "O número de telefone é obrigatório." })
			.regex(
				/^(?:\+244|244)?9\d{8}$/,
				"Número de telefone inválido (deve ser um número de Angola, ex: 923000000).",
			)
			.describe(
				"Número de telemóvel angolano do estudante para envio da notificação push do Multicaixa Express",
			),
	})
	.meta({ title: "MulticaixaExpressPayment" });

const referencePaymentSchema = z
	.object({
		paymentMethod: z
			.literal(paymentMethodEnum.enum.reference)
			.describe(
				"Identificador fixo para o método de Pagamento por Referência EMIS",
			),
		amount: z
			.number({ error: "O campo 'amount' é obrigatório." })
			.int("O valor deve ser um número inteiro (em Kwanzas).")
			.positive("O valor deve ser maior que zero.")
			.describe(
				"Valor total da transação cobrado ao bolsista, expresso em Kwanzas (AOA)",
			),
		currency: z
			.literal("AOA")
			.default("AOA")
			.describe("Moeda oficial da transação (fixada em AOA)"),
		studentId: z
			.string({ error: "O ID do estudante é obrigatório." })
			.min(3, "O ID do estudante é inválido.")
			.describe(
				"Identificador único (UUID ou código) do estudante no sistema acadêmico",
			),
		scholarshipId: z
			.string({
				error: "O ID da bolsa de estudo é obrigatório.",
			})
			.describe(
				"Identificador da bolsa ou programa de auxílio associado a este pagamento",
			),
	})
	.meta({ title: "ReferencePayment" });

export const createPaymentSchema = z.discriminatedUnion("paymentMethod", [
	multicaixaExpressSchema,
	referencePaymentSchema,
]);

export type CreatePaymentSchemaValues = z.infer<typeof createPaymentSchema>;
