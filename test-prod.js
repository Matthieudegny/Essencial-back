const swaggerSpec = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: packageJson.name,
            version: packageJson.version
        },
        components: {
            securitySchemes: {
                Authorization: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    value: "Bearer <JWT token here>"
                }
            }
        }
    },
    apis: [
        './dist/**/*.js'
    ]
};

