import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import {
	createTransactionResponseSchema,
	findOneTransactionResponseSchema,
} from "../../contracts/meta-data.schema";
import { createPaymentSchema } from "../../contracts/transaction.schema";
import { FindOneTransactionController } from "./controllers/find-one-transaction.controller";
import { ProcessTransactionController } from "./controllers/process-transaction.controller";

export const TransactionRoute: FastifyPluginAsyncZod = async (server) => {
	server.get(
		"/:id",
		{
			schema: {
				tags: ["payment"],
				summary: "Detalhes de uma transação",
				description:
					"Retorna os detalhes de uma transação de bolsa de estudo.",
				params: z.object({ id: z.string() }),
				response: {
					200: findOneTransactionResponseSchema,
				},
			},
		},
		FindOneTransactionController,
	);

	server.post(
		"/",
		{
			schema: {
				tags: ["payment"],
				summary: "Criar transação de pagamento",
				description:
					"Cria uma nova transação via Multicaixa Express ou Referência para bolsas.",
				body: createPaymentSchema,
				response: {
					201: createTransactionResponseSchema,
				},
			},
		},
		ProcessTransactionController,
	);
};
