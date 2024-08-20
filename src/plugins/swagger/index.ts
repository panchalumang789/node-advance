import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

export const swaggerPlugin: FastifyPluginAsync<{ routePrefix: string }> = async (api, options) => {
    await api.register(fastifySwagger, {
        openapi: {
            openapi: '3.0.3',
            info: {
                title: 'Node Advance',
                version: '0.1.0',
            },
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                },
            },
            security: [],
        },
        transform: jsonSchemaTransform,
    });

    await api.register(fastifySwaggerUi, {
        routePrefix: options.routePrefix,
        initOAuth: {},
    });
}

export const swaggerOnReady = (app: FastifyInstance) => {
    app.swagger();
};