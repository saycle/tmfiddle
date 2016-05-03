var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DATABASE_URL);

var Machine = sequelize.define('machine', {
	id: { type: Sequelize.STRING, primaryKey:true },
	machineDefinition: Sequelize.JSON
});

sequelize.sync();

exports.machine = Machine;