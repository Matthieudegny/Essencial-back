require('dotenv').config();
const express = require('express');
const expressJSDocSwagger = require('express-jsdoc-swagger')
const router = require('./app/routers');
const cors = require('cors');

const port = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'ejs');
app.set('views', './app/views');

const options = {
/*     swaggerDefinition: {
        openapi: '3.0.1', // YOU NEED THIS
    }, */
/*     securityDefinitions: {
        "JWT": {
            "type": "apiKey",
            "name": "token",
            "in": "header"
        }
    }, */
    /* security: [ { "JWT": [] } ], */
    info: {
        version: '1.0.0',
        title: 'Essencial',
        description: ' '
    },
    baseDir: __dirname,
    filesPattern: './**/*.js',
    swaggerUIPath: '/api-docs',
    exposeSwaggerUI: true,
    notRequiredAsNullable: false,
    swaggerUiOptions: {},
/*     paths: {
        "/api/user": {
            parameters: [ { name: "Authorization" , in: "header", type: "string", description: "auth token"}],
            "patch": {
                "security": [ { "JWT": [] } ],
                "tags": [
                    "User"
                ]
            }
        }
    }      */ 
}

expressJSDocSwagger(app)(options);

// Middleware d'interprétation d'un corps de requête envoyée en post sous forme de JSON
app.use(express.json());
// On peut si on veut le permettre, ajouter l'interpretation de données sous forme urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(cors(process.env.CORS_DOMAINS ?? '*'));

app.use(router);

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});