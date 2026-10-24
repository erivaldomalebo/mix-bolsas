import type { FastifyReply, FastifyRequest } from "fastify";
import { findOneTransactionUseCase } from "@/modules/transaction/useCases/find-one-transaction.useCase";

export const FindOneTransactionController = async (
	request: FastifyRequest<{ Params: { id: string } }>,
	reply: FastifyReply,
) => {
	const { id } = request.params;

	if (!id) {
		return reply.status(400).send({
			message: "O parâmetro 'id' é obrigatório.",
		});
	}

	const result = await findOneTransactionUseCase.execute(id);

	if (result.isLeft()) {
		return reply.status(result.value.statusCode).send({
			message: result.value.message,
		});
	}

	return reply.status(200).send({
		message: "Transação encontrada com sucesso.",
		data: result.value,
	});
};
