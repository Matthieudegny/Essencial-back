class CoreDatamapper {
    tableName;

    constructor(client) {
        this.client = client;
    }

    /**
     * Récupération par identifiant
     * @param {number|number[]} id identifiant ou liste d'identifiants
     * @returns un enregistrement ou une liste d'enregistrement
     */
    async findByPk(id) {
        const preparedQuery = {
            text: `SELECT * FROM "${this.tableName}" WHERE id = $1`,
            values: [id],
        };

        const result = await this.client.query(preparedQuery);

        if (!result.rows[0]) {
            return null;
        }

        return result.rows[0];
    }

    async findAll(params) {
        let filter = '';
        const values = [];

        // Si on rentre un paramètre au FindAll on ira chercher le .$where
        // Si on le trouve on passe dans le if
        if (params?.$where) {
            const filters = [];
            let indexPlaceholder = 1;

            //  On boucle sur tout les params.$where
            // Soit params.$where = {city: paris}
            // Soit params.$where = {$or: {"city": "paris"}}
            Object.entries(params.$where).forEach(([param, value]) => {
                if (param === '$or') {
                    const filtersOr = [];
                    Object.entries(value).forEach(([key, val]) => {
                        filtersOr.push(`"${key}" = $${indexPlaceholder}`); // ex: name = $1
                        values.push(val);                                  // values.push("Arthur")
                        indexPlaceholder += 1;
                    });
                    filters.push(`(${filtersOr.join(' OR ')})`);          // ex: name = $1 OR address = $2 ...
                } else {
                    filters.push(`"${param}" = $${indexPlaceholder}`);
                    values.push(value);
                    indexPlaceholder += 1;
                }
            });
            filter = `WHERE ${filters.join(' AND ')}`;
        }

        const preparedQuery = {
            text: `
                SELECT * FROM "${this.tableName}"
                ${filter}
            `,
            values,
        };

        const result = await this.client.query(preparedQuery);

        return result.rows;
    }

    async create(inputData) {
        const fields = [];
        const placeholders = [];
        const values = [];
        let indexPlaceholder = 1;

        Object.entries(inputData).forEach(([prop, value]) => {
            
            fields.push(`"${prop}"`);
            placeholders.push(`$${indexPlaceholder}`);
            indexPlaceholder += 1;
            values.push(value);
        });

        const preparedQuery = {
            text: `
                INSERT INTO "${this.tableName}"
                (${fields})
                VALUES (${placeholders})
                RETURNING *
            `,
            values,
        };

        const result = await this.client.query(preparedQuery);
        const row = result.rows[0];

        return row;
    }

    async update(id, inputData) {
        const fieldsAndPlaceholders = [];
        let indexPlaceholder = 1;
        const values = [];

        Object.entries(inputData).forEach(([prop, value]) => {
            fieldsAndPlaceholders.push(`"${prop}" = $${indexPlaceholder}`);
            indexPlaceholder += 1;
            values.push(value);
        });

        values.push(id);

        const preparedQuery = {
            text: `
                UPDATE "${this.tableName}" SET
                ${fieldsAndPlaceholders},
                updated_at = now()
                WHERE id = $2
                RETURNING *
                `,
                values
                /* WHERE id = $${indexPlaceholder} */
        };
        const result = await this.client.query(preparedQuery);
        const row = result.rows[0];

        return row;
    }

    async delete(id) {

        const preparedQuery = {
            text: `DELETE FROM "${this.tableName}" WHERE id = $1 RETURNING *`,
            values: [id]
        };

        const result = await this.client.query(preparedQuery)
        const row = result.rows[0];
        return row;
    }
}

module.exports = CoreDatamapper;
