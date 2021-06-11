const envConfig = {
	"production": false,
	"apiUrl": "http://localhost:3000/api/v1",
	"baseUrl": "http://localhost:8000",
	"explorer": {
		"tx": "https://blockstream.info/testnet/tx/"
	},
	"userTypes": [
		{ code: 'projects', name: 'Projects', basedistribution: 15 },
		{ code: 'hospital', name: 'Hospitals', basedistribution: 10 },
		{ code: 'civilprotection', name: 'Civil protection', basedistribution: 10 },
		{ code: 'npo', name: 'NPOs', basedistribution: 10 },
		{ code: 'school', name: 'Schools', basedistribution: 10 },
		{ code: 'cultural', name: 'Cultural', basedistribution: 10 },
		{ code: 'company', name: 'Company', basedistribution: 10 },
		{ code: 'munic', name: 'Municipalities', basedistribution: 10 },
		{ code: 'park', name: 'Parks', basedistribution: 5 },
		{ code: 'singleuser', name: 'Single users', basedistribution: 5 },
		{ code: 'helperbit', name: 'Helperbit', basedistribution: 5 }
	],
	"minDonation": 0.001,
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
		"account": "",
		"button": "",
		"paymenturi": ""
	},
	"network": "testnet"
};

module.exports = envConfig;