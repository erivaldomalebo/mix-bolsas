import { db, type Status, type Transaction } from "@/shared/infra/database";
import type { PaymentMethod } from "../contracts/transaction.schema";

export interface CreateTransactionDTO {
	amount: number;
	currency: string;
	status: Status;
	refusalReason: string | null;
	paymentMethod: PaymentMethod;
	studentId: string;
	scholarshipId: string;
	phoneNumber?: string;
	entity?: string;
	reference?: string;
}

export class TransactionRepository {
	async create(data: CreateTransactionDTO): Promise<Transaction> {
		return await db.transaction.create({
			data: {
				amount: data.amount,
				currency: data.currency,
				status: data.status,
				refusalReason: data.refusalReason,
				paymentMethod: data.paymentMethod,
				studentId: data.studentId,
				scholarshipId: data.scholarshipId,
				phoneNumber: data.phoneNumber ?? null,
				entity: data.entity ?? null,
				reference: data.reference ?? null,
			},
		});
	}

	async findOne(id: string): Promise<Transaction | null> {
		return await db.transaction.findUnique({
			where: {
				id,
			},
		});
	}
}
