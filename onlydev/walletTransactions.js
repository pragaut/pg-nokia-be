module.exports = function (sequelize, DataTypes) {
	const wallet = sequelize.define('Wallet', {
		Id: {
			type: DataTypes.STRING,
			primaryKey: true,
        },

        UserId: DataTypes.STRING, // the wallet this user belongs to

        WalletRequestedDate: DataTypes.DATE,
        WalletActivationDate: DataTypes.DATE,

        WalletNotes: DataTypes.STRING,
        WalletAdminNotes: DataTypes.STRING,

		Active: DataTypes.BOOLEAN,
        CreatedBy: DataTypes.STRING,
		UpdatedBy: DataTypes.STRING,
    },
    {
        tableName: 'Wallet',
        classMethods: {
            associate: function (Models) {
                // associations can be defined here
            }
        }
    });

return wallet;
};