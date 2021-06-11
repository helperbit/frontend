import { tileLayer } from 'leaflet';
const envConfig = require('./config');

const bitcoin = {
	messagePrefix: '\x18Bitcoin Signed Message:\n',
	bech32: 'bc',
	bip32: {
		public: 0x0488b21e,
		private: 0x0488ade4,
	},
	pubKeyHash: 0x00,
	scriptHash: 0x05,
	wif: 0x80,
};
const testnet = {
	messagePrefix: '\x18Bitcoin Signed Message:\n',
	bech32: 'tb',
	bip32: {
		public: 0x043587cf,
		private: 0x04358394,
	},
	pubKeyHash: 0x6f,
	scriptHash: 0xc4,
	wif: 0xef,
};

export class AppSettings {
	/********* Env constants */
	public static production = envConfig.production;
	public static features = envConfig.features || {};
	public static languages = ['it', 'es'];

	/* Bitcon related */
	public static minDonation = envConfig.minDonation;
	public static network = envConfig.network === 'mainnet' ? bitcoin : testnet;
	public static networkName = envConfig.network;
	public static explorer: { tx: string } = envConfig.explorer;

	/* Backend API url and frontend base url */
	public static apiUrl = envConfig.apiUrl;
	public static baseUrl = envConfig.baseUrl;

	//urls of varius page of webapp
	public static urls = {
		public: {
			project: envConfig.baseUrl + '/project/',
			campaign: envConfig.baseUrl + '/campaign/',
			media: envConfig.baseUrl + '/media/',
			profile: envConfig.baseUrl + '/user/',
			charityPot: envConfig.baseUrl + '/charity-pot/'
		},
		private: {
		}
	};

	/********* Frontend configuration */
	/* User types */
	public static userTypes = envConfig.userTypes;


	/* Map related */
	public static defaultMapCenter = { lat: 32.419, lng: -45.417, zoom: 7 };

	public static layersOnlyTerrain = {
		baselayers: {
			esriTerrain: {
				name: 'ESRI Terrain',
				type: 'xyz',
				url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
			}
		}
	};
	public static layers = {
		baselayers: {
			esriTerrain: {
				name: 'ESRI Terrain',
				type: 'xyz',
				url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
			},
			osm: {
				name: 'OpenStreetMap',
				url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
				type: 'xyz'
			},
			googleHybrid: {
				name: 'Google Hybrid',
				layerType: 'HYBRID',
				type: 'google'
			},
			googleRoadmap: {
				name: 'Google Streets',
				layerType: 'ROADMAP',
				type: 'google'
			}
		}
	};
	public static tileLayers = {
		osm: {
			url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			options: {
				attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			}
		},
		satellite: {
			url: "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
			options: {
				attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
				subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
			}
		},
		esriTerrain: () => tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
			attribution: '&copy; ESRI Terrain'
		}),
		openStreetMap: () => tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}),
		empty: () => tileLayer("media/empty_tile.png", {}),
		twoColors: () => tileLayer("media/tiles/light_nolabels/{z}/{x}/{y}.png", {
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
		})
	};

	public static form = {
		regex: {
			text: /^[a-zA-Z]+$/,
			alphanumeric: /^[a-zA-Z0-9]+$/,
			username: /^[0-9a-zA-Z_]+$/,
			fullName: /^[a-zA-Z \']*$/,
			password: /^(?=.*[a-zA-Z])(?=.*[0-9])/,
			number: /^[0-9]+$/,
			numberDecimal: /^[0-9]+(\.[0-9]{1,2})?$/,
			bitcoin: {
				digits8: /^[0-9]+(\.[0-9]{1,8})?$/,
				digits11: /^[0-9]+(\.[0-9]{1,11})?$/
			},
			//email: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
			email: /^([\w-+]+(?:\.[\w-+]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,8}(?:\.[a-z]{2})?)$/i, //same of backend
			phoneNumber: /^(\([0-9]{3}\)|[0-9]{3}-)[0-9]{3}-[0-9]{4}$/,
			url: {
				youtube: /^http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/,
				website: /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
			},
		},
		length: {
			min: {
				password: 8,
				username: 4,
				idNumber: 4,
				fullName: 5,
				firstName: 2,
				lastName: 2,
				contact: {
					subject: 4,
					message: 24
				},
				feedback: {
					description: 8 //in realtà 3 sono sufficienti
				},
				ror: {
					description: 12
				},
				rorSend: {
					description: 8
				},
				project: {
					title: 8, //in realtà 3 sono sufficienti
					description: 8
				},
				activity: {
					title: 8, //in realtà 3 sono sufficienti
					description: 8
				},
				campaign: {
					title: 4,
					description: 9
				},
				npo: {
					name: 2
				}
			}
		},
		exts: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
		extsImages: ['jpg', 'jpeg', 'png', 'webp'],
		extsFiles: ['pdf'],
		fileSize: {
			document: {
				max: 4000000
			},
			media: {
				max: 2097152
			}
		},
		options: {
			// language: {
			// 	default: [
			// 		{
			// 			name: translate.instant('Italian'),
			// 			value: 'it'
			// 		},
			// 		{
			// 			name: translate.instant('English'),
			// 			value: 'en'
			// 		},
			// 		{
			// 			name: translate.instant('Spanish'),
			// 			value: 'es'
			// 		}
			// 	]
			// },
			// currency: {
			// 	default: [
			// 		{
			// 			name: 'Euro (€)',
			// 			value: 'EUR'
			// 		},
			// 		{
			// 			name: 'Dollar ($)',
			// 			value: 'USD'
			// 		}
			// 	],
			// 	campaign: [
			// 		{
			// 			name: 'Euro (€)',
			// 			value: 'EUR'
			// 		},
			// 		{
			// 			name: 'Dollar ($)',
			// 			value: 'USD'
			// 		},
			// 		{
			// 			name: 'Bitcoin (฿)',
			// 			value: 'BTC'
			// 		}
			// 	]
			// },
			// document: {
			// 	default: [
			// 		{
			// 			name: translate.instant('ID'),
			// 			value: 'id'
			// 		},
			// 		{
			// 			name: translate.instant('Passport'),
			// 			value: 'passport'
			// 		}
			// 	]
			// },
			// gender: {
			// 	default: [
			// 		{
			// 			name: translate.instant('Male'),
			// 			value: 'm'
			// 		},
			// 		{
			// 			name: translate.instant('Female'),
			// 			value: 'f'
			// 		},
			// 		{
			// 			name: translate.instant('Not Declared'),
			// 			value: 'a'
			// 		}
			// 	]
			// },
			inhabitants: {
				default: ['1-1999', '2000-4999', '5000-9999', '10000-19999',
					'20000-59999', '60000-249999', '250000+'].map(x => ({ label: x, value: x }))
			},
			operators: {
				default: ['2-10', '10-50', '50-250', '250-1000',
					'1000-5000', '5000+'].map(x => ({ label: x, value: x }))
			}
		}
	};

	public static media = {
		avatar: {
			singleuser: {
				male: '/media/avatar/png/single_user_male_256x256.png',
				female: '/media/avatar/png/single_user_female_256x256.png',
				notDeclared: '/media/avatar/png/single_user_anonymous_256x256.png'
			},
			company: '/media/avatar/png/company_256x256.png',
			municipality: '/media/avatar/png/municipality_256x256.png',
			npo: '/media/avatar/png/npo_256x256.png',
			campaign: '/media/avatar_empty_org.png', //TODO
			project: '/media/avatar_empty_org.png' //TODO
		},
		coverflow: {
			singleuser: {
				male: '/media/photo_empty.png', //TODO
				female: '/media/photo_empty.png', //TODO
				notDeclared: '/media/photo_empty.png' //TODO
			},
			company: '/media/photo_empty.png', //TODO
			municipality: '/media/photo_empty.png', //TODO
			npo: '/media/photo_empty.png', //TODO
			campaign: '/media/photo_empty.png', //TODO
			project: '/media/photo_empty.png' //TODO
		}
	};

	public static verify = {
		errors: {
			profile: ['birthdate', 'firstname', 'lastname', 'gender', 'fullname', 'vat', 'operators', 'website', 'inhabitants', 'mayor', 'mandateperiod', 'tags', 'referent.firstname', 'referent.lastname', 'referent.idnumber', 'referent.email', 'country'],
			geolocalization: ['countries', 'country', 'city', 'zipcode', 'location', 'street', 'streetnr', 'region']
		}
	};
}

export default AppSettings;