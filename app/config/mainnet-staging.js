const envConfig = {
	"production": true,
	"apiUrl": "http://localhost:3000/api/v1",
	"baseUrl": "http://localhost:8000",
	"explorer": {
		"tx": "https://blockstream.info/tx/"
	},
	"userTypes": [
		// { code: 'singleuser', name: 'Single users', basedistribution: 15 },
		// { code: 'school', name: 'Schools', basedistribution: 10 },
		// { code: 'company', name: 'Company', basedistribution: 10 },
		// { code: 'npo', name: 'NPOs', basedistribution: 10 },
		// { code: 'park', name: 'Parks', basedistribution: 10 },
		// { code: 'munic', name: 'Municipalities', basedistribution: 10 },
		// { code: 'cultural', name: 'Cultural', basedistribution: 10 },
		// { code: 'hospital', name: 'Hospitals', basedistribution: 10 },
		// { code: 'civilprotection', name: 'Civil protection', basedistribution: 10 },
		// { code: 'helperbit', name: 'Helperbit', basedistribution: 5 }
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
		"chat": false,
		"faucet": false,
		"insurance": false,
		"conversion": false,
		"alert": false,
		"removewallet": false,
		"donationcomment": true
	},
	"mistralpay": {
		"account": "",
		"button": "",
		"paymenturi": ""
	},
	"network": "mainnet"
};


module.exports = envConfig;