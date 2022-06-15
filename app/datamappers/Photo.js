const client = require('../db/pg');
const CoreDatamapper = require('./coreDatamapper');

class Photo extends CoreDatamapper {

    tableName = 'photo';

}

module.exports = new Photo(client);