const config = {
	ENVIRONMENT: process.env.MODE, // prod = production, dev = running node on same machine, staging = staging, localnetwork means running on network using an IP
	ENCRYPTION_KEY: process.env.ENCRYPTION_KEY, // this key will be used to encrypt and decrypt any token
	INJECTED_KEY: process.env.INJECTED_KEY, // this key will be used to identify the jsonwebtoken
	JWT_SECRET: process.env.JWT_SECRET, // the secret key to be used for encrypting jwt
	TOKEN_ALLOWED_FOR_HOW_LONG: '20000h',
	OTP_ALLOWED_FOR_HOW_LONG: '15', // in minutes
	OTP_LENGTH: 4,
	PASSWORD_ITERATIONS: 100,
	VERIFICATION_HASH_ALLOWED_FOR_HOW_LONG_SECONDS: 1080,
	USE_Q: false, // it will be used when we will use the queuing system
	LOG_LEVEL: 1,
	LOGS_TO_ACCUMULATE: 0,
	OPR_KEY: process.env.OPR_KEY,
	DB_ROWS_LIMIT: 5000, // by default to return how many values
	DEBUG: true, // if true, logging will be deep
	SUPER_ADMIN: 'Super Admin',
	JWT: {
		ISSUER: 'ANAND',
		SUBJECT: 'Auth Token',
		AUDIENCE: 'ANAND Group Users',
		ALGORITHM: 'RS256',
	},
	STAGING: {
		//CODE: '@Bc123',
		CODE: 'PG13',
		SHOULD_SEND_EMAIL: true,
		SHOULD_SEND_OTP: false,
	},
	MODULES: ['User'], // List of all models here.

	// open modules mean that if the property is set as  true, it has the open route access,
	// please note that the properties are full lowercase
	// all: true means any request is going to fine for that particular module

	OPEN_MODULES: {
		otp: {
			all: true,
		},

		account: {
			all: true,
		},

		'account-login': {
			all: true,
		},

		'account-resetpassword': {
			all: true,
		},

		'account-forgotpassword': {
			all: true,
		},

		'otp-verifypasswordotp': {
			all: true,
		},
		objective: {
			all: true
		},

		image: {
			list: true
		},
		
		notificationDetails: {
			list: true
		}, 
		'user': {
			list: true
		},

		'account-register': {
			all: true
		},

		'otp-verifyemailotp': {
			all: true
		},

	}, // this will be the modules which are open totally, and doesn't require special access to save data. For example, registration

	// We will keep a config for identifying if we wanna send information to user on which step of orders

	ORDER_EMAIL_CONFIG: {
		ON_CREATE: true,
		ON_CANCEL: true
	},

	URLs: {
		DEV: 'http://pragaut.com',
		PROD: 'http://pragaut.com',
		RAZOR_PAY_URL: 'https://api.razorpay.com/v1/',
	},

	SEQUELIZE: {
		host: process.env.HOST,
		username: process.env.DBUSER,
		password: process.env.PASSWORD,
		database: process.env.DATABASE,
		dialect: 'mysql',
		multipleStatements: true,
		timezone: '+05:30',
		logging: true,
	}, // process.env.MODE !== 'production',


	USER_TYPE: {
		ANANDGROUP: 'Anand-Group',
		GROUPCOMPANY: 'Group-Company',
	},

	EMAILS: {
		ERROR: 'pragauttechnologies@gmail.com',
		NO_REPLY: 'noreply@anandgroup.com',
		ADMIN: 'pardeepbhardwaj10@gmail.com',
	},

	PAYMENT_DIRECTIONS: {
		BOTH: 'both',
		IN: 'in',
		OUT: 'out',
	},

	PAYMENT_TYPES: {
		RAZOR_PAY: 'razor-pay',
		MANUAL: 'manual',
	},

	REFUND: {
		RETURN_TBS_FEES: true,
	},
};


const requiredFields = {
	register: ['firstName', 'lastName', 'email', 'password'],
	event: ['name', 'url', 'buyInAmount', 'scheduledStart'],
	login: ['email', 'password'],
	login_social: ['email', 'token'],
	towerMonitoringUserDetails:['receiverId','employeeId','roleId']
};

/**
 * Access Config will be used for providing access level details for a particular modules
 * for example, let's say I have assigned Staker an access level 1 for Event, but there are some other end
 * points for event which I want to hold, I will mention it here, if I don't mention, then it will be assumed
 * that any (get) endpoint with access 1 will be available for users, (post) endpoint with access of 12 will be
 * available for users
 */
const accessConfig = [
	{ name: 'eventlist', minimumAccess: 1, maximumAccess: 5 },
	{ name: 'order-gettracking', minimumAccess: 0, maximumAccess: 5 },
	{ name: 'eventlist', minimumAccess: 1, maximumAccess: 5 },
	{ name: 'unregister', minimumAccess: 20, maximumAccess: 10000 },
];


const listAttributes = {
	user: ['id', 'firstName', 'lastName', 'title'],
};

module.exports.config = config;
module.exports.accessConfig = accessConfig;
module.exports.requiredFields = requiredFields;
module.exports.listAttributes = listAttributes;