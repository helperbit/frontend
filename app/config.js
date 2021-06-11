const envConfig = {
	"production": false,
	// "apiUrl": "http://localhost:3000/api/v1",
	"apiUrl": "https://api.helperbit.com/api/v1",
	// "apiUrl": "https://testnetbe.helperbit.com/api/v1",
	"baseUrl": "http://localhost:4200",
	"explorer": {
		"tx": "https://blockstream.info/testnet/tx/"
	},
	"minDonation": 0.001,
	"userTypes": [
		{ code: 'singleuser', name: 'Single users', basedistribution: 15 },
		{ code: 'school', name: 'Schools', basedistribution: 10 },
		{ code: 'company', name: 'Company', basedistribution: 10 },
		{ code: 'npo', name: 'NPOs', basedistribution: 10 },
		{ code: 'park', name: 'Parks', basedistribution: 10 },
		{ code: 'munic', name: 'Municipalities', basedistribution: 10 },
		{ code: 'cultural', name: 'Cultural', basedistribution: 10 },
		{ code: 'hospital', name: 'Hospitals', basedistribution: 10 },
		{ code: 'civilprotection', name: 'Civil protection', basedistribution: 10 },
		{ code: 'helperbit', name: 'Helperbit', basedistribution: 5 }
	],
	"features": {
		"captcha": true,
		"chat": true,
		"faucet": true,
		"insurance": true,
		"conversion": true,
		"alert": true,
		"removewallet": true,
		"donationcomment": true
	},
	"mistralpay": {
		"account": "596KCYY4363M",
		"button": "596KCYY4363M150PAY503FX",
		"paymenturi": "https://stg.secure.mistralpay.com/web_payment/"
	},
	"network": "testnet"
};


module.exports = envConfig;
