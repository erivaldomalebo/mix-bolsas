import type { Transaction } from "@/shared/infra/database";
import { NotFoundError } from "@/shared/kernel/errors/defaults";
import { type Either, left, right } from "@/shared/kernel/errors/either";
import { TransactionRepository } from "../repositories/transaction.repository";

export class FindOneTransactionUseCase {
	constructor(private readonly repository: TransactionRepository) {}

	async execute(id: string): Promise<Either<NotFoundError, Transaction>> {
		const transaction = await this.repository.findOne(id);

		if (!transaction) {
			return left(new NotFoundError("Transação não encontrada."));
		}

		return right(transaction);
	}
}

export const findOneTransactionUseCase = new FindOneTransactionUseCase(
	new TransactionRepository(),
);
