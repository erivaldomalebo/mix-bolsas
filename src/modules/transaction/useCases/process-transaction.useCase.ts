import type { Status, Transaction } from "@/shared/infra/database";
import type { NotFoundError } from "@/shared/kernel/errors/defaults";
import { type Either, right } from "@/shared/kernel/errors/either";
import type { CreatePaymentSchemaValues } from "../contracts/transaction.schema";
import { TransactionRepository } from "../repositories/transaction.repository";

export class ProcessTransactionUseCase {
	constructor(private readonly repository: TransactionRepository) {}

	async execute(
		paymentData: CreatePaymentSchemaValues,
	): Promise<Either<NotFoundError, Transaction>> {
		const { amount, currency, studentId, scholarshipId, paymentMethod } =
			paymentData;

		let status: Status = "approved";
		let refusalReason: string | null = null;
		let entity: string | undefined;
		let reference: string | undefined;
		let phoneNumber: string | undefined;

		if (paymentMethod === "multicaixa_express") {
			phoneNumber = paymentData.phoneNumber;

			if (phoneNumber.endsWith("000")) {
				status = "declined";
				refusalReason =
					"Transação recusada no Multicaixa Express (Saldo insuficiente ou PIN incorreto).";
			}
		} else if (paymentMethod === "reference") {
			status = "pending";
			entity = "00123";
			reference = Math.floor(
				100000000 + Math.random() * 900000000,
			).toString();
		}

		const transaction = await this.repository.create({
			amount,
			currency,
			status,
			refusalReason,
			paymentMethod,
			studentId,
			scholarshipId,
			phoneNumber,
			entity,
			reference,
		});

		return right(transaction);
	}
}

export const processTransactionUseCase = new ProcessTransactionUseCase(
	new TransactionRepository(),
);
