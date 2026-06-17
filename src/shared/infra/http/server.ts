import "module-alias/register";
import "tsconfig-paths/register";
import { fastifyCors } from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifyRateLimit from "@fastify/rate-limit";
import { fastifySwagger } from "@fastify/swagger";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { fastify } from "fastify";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { env } from "@/shared/infra/config/env.config";
import { AppError, getHttpStatusText } from "@/shared/kernel/errors/defaults";
import { MainRoute } from "./routes";

export const server = fastify().withTypeProvider<ZodTypeProvider>();

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

server.register(fastifyCors, {
	origin: true,
	methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
	// credentials: true,
});

server.register(fastifyJwt, {
	secret: env.JWT_SECRET,
	formatUser(payload) {
		return payload;
	},
});

/*
 * Registro do Rate limit
 * max - Máximo de requisições permitidas
 * timeWindow - Tempo para renovação do limite
 */
server.register(fastifyRateLimit, {
	max: 100,
	timeWindow: "1 minute",
	errorResponseBuilder: (_, context) => ({
		status: 429,
		error: "Too Many Requests",
		message: `Você atingiu o limite de ${context.max} requisições por minuto.`,
	}),
});

server.register(fastifySwagger, {
	openapi: {
		info: {
			title: "Fastify-Boilerplate-API",
			description:
				"Boilerplate para uma api usando typescript, fastify, swagger e scalar",
			version: "1.0.3",
		},
	},
	transform: jsonSchemaTransform,
});

server.register(ScalarApiReference, {
	routePrefix: "/docs",
	configuration: {
		theme: "default",
		showDeveloperTools: "never",
		mcp: {
			disabled: true,
		},
	},
});

server.setNotFoundHandler((req, reply) => {
	reply.status(404).send({ error: "Rota não encontrada", path: req.url });
});

server.setErrorHandler((error, _request, reply) => {
	if (error instanceof AppError) {
		return reply.status(error.statusCode).send({
			error: getHttpStatusText(error.statusCode),
			message: error.message,
			status: error.statusCode,
		});
	}

	if (error instanceof Error) {
		const status = (error as { statusCode?: number }).statusCode ?? 500;
		return reply.status(status).send({
			error: getHttpStatusText(status),
			message: error.message,
			status,
		});
	}

	reply.status(500).send({
		error: "Internal Server Error",
		message: "Erro interno do servidor",
		status: 500,
	});
});

server.register(MainRoute);

server.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
	console.log(`🔥 HTTP server running on http://localhost:${env.PORT}`);
	console.log(`📚 Docs available ab http://localhost:${env.PORT}/docs`);
});
