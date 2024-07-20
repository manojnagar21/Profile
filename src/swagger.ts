import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "User API",
			version: "1.0.0",
			description: "API documentation for User management",
		},
		servers: [
			{
				url: "http://localhost:3000",
			},
		],
		components: {
			schemas: {
				User: {
					type: "object",
					properties: {
						name: { type: "string" },
						email: { type: "string" },
						password: { type: "string" },
						mobile: { type: "string" },
					},
				},
				LoginUser: {
					type: "object",
					properties: {
						email: { type: "string" },
						password: { type: "string" },
					},
				},
			},
		},
		securitySchemes: {
			bearerAuth: {
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT",
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	},
	apis: ["./src/controllers/*.ts"], // files containing annotations
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwaggerDocs = (app: Express) => {
	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwaggerDocs;
