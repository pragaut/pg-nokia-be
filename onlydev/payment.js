module.exports = function (sequelize, DataTypes) {
	const payment = sequelize.define('Payment', {
		Id: {
			type: DataTypes.STRING,
			primaryKey: true,
        },
        
        PaidBy: DataTypes.STRING,
        PaidDate: DataTypes.STRING,
        PaidAmount: DataTypes.DOUBLE,
        PaymentNotes: DataTypes.STRING,
        
        // user id of the player who will be receiving the amount
        // if user is adding the amount in the wallet so TBS will be the PaidTo
        // once TBS has received the money, we will approve the payment and we will push the money to the wallet
        PaidTo: DataTypes.STRING,

        /**
         * Pending Payment means that TBS has not received the payment yet.
         * In Process means that TBS has received the money but has not made the payment to the person yet
         * Paid means the money is transferred to the Player account
         * Returned means the Payment is returned to the Staker
         */
        
        PaymentStatus: DataTypes.STRING, // Pending, In Process, Paid, Returned

		Active: DataTypes.BOOLEAN,
        CreatedBy: DataTypes.STRING,
		UpdatedBy: DataTypes.STRING,
	},
    {
        tableName: 'Payment',
        classMethods: {
            associate: function (Models) {
                // associations can be defined here
            }
        }
    });

return payment;
};