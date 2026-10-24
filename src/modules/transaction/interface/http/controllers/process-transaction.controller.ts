import type { FastifyReply, FastifyRequest } from "fastify";
import {
	type CreatePaymentSchemaValues,
	createPaymentSchema,
} from "@/modules/transaction/contracts/transaction.schema";
import { processTransactionUseCase } from "@/modules/transaction/useCases/process-transaction.useCase";

export const ProcessTransactionController = async (
	request: FastifyRequest<{ Body: CreatePaymentSchemaValues }>,
	reply: FastifyReply,
) => {
	const parseResult = createPaymentSchema.safeParse(request.body);

	if (!parseResult.success) {
		const formattedErrors = parseResult.error.issues.map((issue) => ({
			field: issue.path.join("."),
			message: issue.message,
		}));

		return reply.status(400).send({
			message: "Dados de pagamento inválidos.",
			errors: formattedErrors,
		});
	}

	const result = await processTransactionUseCase.execute(parseResult.data);

	if (result.isLeft()) {
		return reply.status(result.value.statusCode).send({
			message: result.value.message,
		});
	}

	return reply.status(201).send({
		message: "Transação processada com sucesso.",
		data: result.value,
	});
};
