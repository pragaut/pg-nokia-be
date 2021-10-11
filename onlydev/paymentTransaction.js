module.exports = function (sequelize, DataTypes) {
	const paymentTransaction = sequelize.define('PaymentTransaction', {
		Id: {
			type: DataTypes.STRING,
			primaryKey: true,
        },

        //PaymentInfo:

        CardNumber: DataTypes.STRING,
        CardType: DataTypes.STRING, // debit card etc
        GatewayType: DataTypes.STRING, // Master Card, Visa etc
        ExpiryDate: DataTypes.DATE,

        // Transaction Info
        TransactionDate: DataTypes.DATE,
        TransactionReferenceNumber: DataTypes.STRING,
        GatewayId: DataTypes.STRING,
        TransactionStatus: DataTypes.STRING,
    },
    {
        tableName: 'PaymentTransaction',
        classMethods: {
            associate: function (Models) {
                // associations can be defined here
            }
        }
    });

return paymentTransaction;
};