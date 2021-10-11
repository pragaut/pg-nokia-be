module.exports = function (sequelize, DataTypes) {
	const paymentInfo = sequelize.define('PaymentInfo', {
		Id: {
			type: DataTypes.STRING,
			primaryKey: true,
        },

		Active: DataTypes.BOOLEAN,
        CreatedBy: DataTypes.STRING,
		UpdatedBy: DataTypes.STRING,
    },
    {
        tableName: 'PaymentInfo',
        classMethods: {
            associate: function (Models) {
                // associations can be defined here
            }
        }
    });

return paymentInfo;
};