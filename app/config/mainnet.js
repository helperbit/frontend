/* 
 *  Helperbit: a p2p donation platform (frontend)
 *  Copyright (C) 2016-2021  Davide Gessa (gessadavide@gmail.com)
 *  Copyright (C) 2016-2021  Helperbit team
 *  
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

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
		"paymenturi": "/"
	},
	"network": "mainnet"
};


module.exports = envConfig;