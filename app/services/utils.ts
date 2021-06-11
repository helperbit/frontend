import { Fees, Prices } from "./currency";
import { TranslateService } from '@ngx-translate/core';
import { GeometryFeatureCollection, ObjectId, unwrap } from "../models/common";
import AppSettings from "../app.settings";
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, refCount, publishReplay } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { FileCustom } from "app/shared/types/input-file";
import { objectToFormData, isEmpty, mimeTypesExtension } from '../shared/helpers/utils';
import { TagsChipsOption, SelectOption } from 'app/shared/ngx-formly/fields/tags/tags';
import { MetaService } from 'ng2-meta';

const countryDict: { [key: string]: string } = require('../assets/data/country.json');
// const countryRegionJSON: CountryRegionJSON = require('../assets/data/country-region.json');

export interface FeedbackData {
	description: string;
	email: string;
	file?: File;
}

export interface ContactData {
	email: string;
	subject: string;
	message: string;
	firstname?: string;
	lastname?: string;
}

export interface QueryResult {
	media: string;
	mainInfo: string;
	secondaryInfo: string;
	tertiaryInfo: string;
	id: string;
	time: string;
	type: 'user' | 'project' | 'donation';
}

export interface BlogPost {
	title: string;
	description: string;
	summary: string;
	date: Date;
	link: string;
}

export interface PlatformInfoBase {
	blockchain: {
		network: 'mainnet' | 'testnet';
		height: number;
	};
	fees: Fees;
	prices: Prices;
	policyversion: {
		terms: number;
		privacy: number;
	};
}

export interface PlatformInfo extends PlatformInfoBase {
	fiatdonation: {
		available: number;
		fixedcost: number;
		fee: number;
		limits: {
			btc: { min: number; max: number };
			eur: { min: number; max: number };
		};
		withdrawcost: number;
	};
	flypme: {
		enabled: boolean;
		limits: { [coin: string]: { max: string; min: string } };
	};
}

export interface CountryRegionJSON { CountryJSON };

export interface CountryJSON {
	[key: string]: {
		name: string;
		regions: string[];
	};
}

@Injectable({
	providedIn: 'root'
})
export class UtilsService {
	public onSnackbar: EventEmitter<{ text: string; timeout: number }> = new EventEmitter();

	private platformInfoBase: Observable<PlatformInfoBase> = null;
	private countryRegion: Observable<CountryRegionJSON> = null;

	constructor(
		private http: HttpClient,
		private route: ActivatedRoute,
		private router: Router,
		private translate: TranslateService,
		private metaService: MetaService
	) {}

	setMeta(title: string, description?: string, image?: string) {
		this.metaService.setTitle(title);
		this.metaService.setTag('og:title', title);
		this.metaService.setTag('twitter:title', title);

		if (description) {
			this.metaService.setTag('description', description);
			this.metaService.setTag('twitter:description', description);
			this.metaService.setTag('og:description', description);	
		}
		if (image) {
			this.metaService.setTag('image', image);
			this.metaService.setTag('twitter:image', image);
			this.metaService.setTag('og:image', image);
			this.metaService.setTag('og:image:secure_url', image);
		}
	}

	buttonsGroupOptions() {
		return {
			fiatCurrency: [
				{
					value: 'EUR',
					label: '\u20AC',
					tooltip: 'Euro'
				},
				{
					value: 'USD',
					label: '\u0024',
					tooltip: this.translate.instant('American Dollars')
				}
			],
			btcCurrency: [
				{
					value: 'BTC',
					label: '\u0E3F',
					tooltip: 'Bitcoin'
				},
				{
					value: 'SAT',
					label: 'SAT',
					tooltip: 'Satoshi'
				},
				{
					value: 'MSAT',
					label: 'MSAT',
					tooltip: 'Milli Satoshi'
				}
			]
		};
	}

	badges() {
		return {
			'friend-locked': {
				name: this.translate.instant('Friend Badge Locked'),
				description: this.translate.instant('Lorem Ipsum Dolor Sit Amet'),
				images: {
					small: '/media/badges/large/png/friend/locked_256x197.png',
					medium: '/media/badges/large/png/friend/locked_512x393.png',
					large: '/media/badges/large/png/friend/locked_1024x786.png'
				}
			},
			'friend': {
				name: this.translate.instant('Friend Badge'),
				description: this.translate.instant('Lorem Ipsum Dolor Sit Amet'),
				images: {
					small: '/media/badges/large/png/friend/default_256x197.png',
					medium: '/media/badges/large/png/friend/default_512x393.png',
					large: '/media/badges/large/png/friend/default_1024x786.png'
				}
			},
			'supporter-locked': {
				name: this.translate.instant('Supporter Badge Locked'),
				description: this.translate.instant('Lorem Ipsum Dolor Sit Amet'),
				images: {
					small: '/media/badges/large/png/supporter/locked_256x197.png',
					medium: '/media/badges/large/png/supporter/locked_512x393.png',
					large: '/media/badges/large/png/supporter/locked_1024x786.png'
				}
			},
			'supporter': {
				name: this.translate.instant('Supporter Badge'),
				description: this.translate.instant('Lorem Ipsum Dolor Sit Amet'),
				images: {
					small: '/media/badges/large/png/supporter/default_256x197.png',
					medium: '/media/badges/large/png/supporter/default_512x393.png',
					large: '/media/badges/large/png/supporter/default_1024x786.png'
				}
			},
			'trust-locked': {
				code: 'trust',
				apiCode: 'trust-locked',
				name: this.translate.instant('Trust Badge Locked'),
				description: this.translate.instant('Lorem Ipsum Dolor Sit Amet'),
				images: {
					small: '/media/badges/large/png/trust/locked_256x197.png',
					medium: '/media/badges/large/png/trust/locked_512x393.png',
					large: '/media/badges/large/png/trust/locked_1024x786.png'
				}
			},
			'trust': {
				name: this.translate.instant('Trust Badge'),
				description: this.translate.instant('Lorem Ipsum Dolor Sit Amet'),
				images: {
					small: '/media/badges/large/png/trust/default_256x197.png',
					medium: '/media/badges/large/png/trust/default_512x393.png',
					large: '/media/badges/large/png/trust/default_1024x786.png'
				}
			},
			'donor-locked': {
				value: 0,
				name: this.translate.instant('Donor Badge Locked'),
				description: this.translate.instant('Lorem Ipsum Dolor Sit Amet'),
				images: {
					small: '/media/badges/large/png/donor/locked_256x197.png',
					medium: '/media/badges/large/png/donor/locked_512x393.png',
					large: '/media/badges/large/png/donor/locked_1024x786.png'
				}
			},
			'donor-bronze': {
				value: 1,
				name: this.translate.instant('Bronze Donor Badge'),
				description: this.translate.instant('Lorem Ipsum Dolor Sit Amet'),
				images: {
					small: '/media/badges/large/png/donor/bronze_256x197.png',
					medium: '/media/badges/large/png/donor/bronze_512x393.png',
					large: '/media/badges/large/png/donor/bronze_1024x786.png'
				}
			},
			'donor-silver': {
				value: 2,
				name: this.translate.instant('Silver Donor Badge'),
				description: this.translate.instant('Lorem Ipsum Dolor Sit Amet'),
				images: {
					small: '/media/badges/large/png/donor/silver_256x197.png',
					medium: '/media/badges/large/png/donor/silver_512x393.png',
					large: '/media/badges/large/png/donor/silver_1024x786.png'
				}
			},
			'donor-gold': {
				value: 3,
				name: this.translate.instant('Gold Donor Badge'),
				description: this.translate.instant('Lorem Ipsum Dolor Sit Amet'),
				images: {
					small: '/media/badges/large/png/donor/gold_256x197.png',
					medium: '/media/badges/large/png/donor/gold_512x393.png',
					large: '/media/badges/large/png/donor/gold_1024x786.png'
				}
			},
			'fundraiser-locked': {
				value: 0,
				code: 'fundraiser',
				apiCode: 'fundraiser-locked',
				name: this.translate.instant('Fundraiser Badge Locked'),
				description: this.translate.instant('Lorem Ipsum Dolor Sit Amet'),
				images: {
					small: '/media/badges/large/png/fundraiser/locked_256x197.png',
					medium: '/media/badges/large/png/fundraiser/locked_512x393.png',
					large: '/media/badges/large/png/fundraiser/locked_1024x786.png'
				}
			},
			'fundraiser-bronze': {
				value: 1,
				name: this.translate.instant('Bronze Fundraiser Badge'),
				description: this.translate.instant('Lorem Ipsum Dolor Sit Amet'),
				images: {
					small: '/media/badges/large/png/fundraiser/bronze_256x197.png',
					medium: '/media/badges/large/png/fundraiser/bronze_512x393.png',
					large: '/media/badges/large/png/fundraiser/bronze_1024x786.png'
				}
			},
			'fundraiser-silver': {
				value: 2,
				name: this.translate.instant('Silver Fundraiser Badge'),
				description: this.translate.instant('Lorem Ipsum Dolor Sit Amet'),
				images: {
					small: '/media/badges/large/png/fundraiser/silver_256x197.png',
					medium: '/media/badges/large/png/fundraiser/silver_512x393.png',
					large: '/media/badges/large/png/fundraiser/silver_1024x786.png'
				}
			},
			'fundraiser-gold': {
				value: 3,
				name: this.translate.instant('Gold Fundraiser Badge'),
				description: this.translate.instant('Lorem Ipsum Dolor Sit Amet'),
				images: {
					small: '/media/badges/large/png/fundraiser/gold_256x197.png',
					medium: '/media/badges/large/png/fundraiser/gold_512x393.png',
					large: '/media/badges/large/png/fundraiser/gold_1024x786.png'
				}
			},
			'ambassador-locked': {
				value: 0,
				name: this.translate.instant('Ambassador Badge Locked'),
				description: this.translate.instant('Lorem Ipsum Dolor Sit Amet'),
				images: {
					small: '/media/badges/large/png/ambassador/locked_256x197.png',
					medium: '/media/badges/large/png/ambassador/locked_512x393.png',
					large: '/media/badges/large/png/ambassador/locked_1024x786.png'
				}
			},
			'ambassador-bronze': {
				value: 1,
				name: this.translate.instant('Bronze Ambassador Badge'),
				description: this.translate.instant('Lorem Ipsum Dolor Sit Amet'),
				images: {
					small: '/media/badges/large/png/ambassador/bronze_256x197.png',
					medium: '/media/badges/large/png/ambassador/bronze_512x393.png',
					large: '/media/badges/large/png/ambassador/bronze_1024x786.png'
				}
			},
			'ambassador-silver': {
				value: 2,
				name: this.translate.instant('Silver Ambassador Badge'),
				description: this.translate.instant('Lorem Ipsum Dolor Sit Amet'),
				images: {
					small: '/media/badges/large/png/ambassador/silver_256x197.png',
					medium: '/media/badges/large/png/ambassador/silver_512x393.png',
					large: '/media/badges/large/png/ambassador/silver_1024x786.png'
				}
			},
			'ambassador-gold': {
				value: 3,
				name: this.translate.instant('Gold Ambassador Badge '),
				description: this.translate.instant('Lorem Ipsum Dolor Sit Amet'),
				images: {
					small: '/media/badges/large/png/ambassador/gold_256x197.png',
					medium: '/media/badges/large/png/ambassador/gold_512x393.png',
					large: '/media/badges/large/png/ambassador/gold_1024x786.png'
				}
			}
		};
	}

	tags() {
		return {
			'art': {
				name: this.translate.instant('Art'),
				iconId: 'paint-brush-and-palette',
				src: AppSettings.baseUrl + '/media/tags/svg/paint-brush-and-palette.svg'
			},
			'education': {
				name: this.translate.instant('Education'),
				iconId: 'mortarboard',
				src: AppSettings.baseUrl + '/media/tags/svg/mortarboard.svg'
			},
			'environment': {
				name: this.translate.instant('Environment'),
				iconId: 'leaf',
				src: AppSettings.baseUrl + '/media/tags/svg/leaf.svg'
			},
			'health': {
				name: this.translate.instant('Health'),
				iconId: 'cardiogram',
				src: AppSettings.baseUrl + '/media/tags/svg/cardiogram.svg'
			},
			'heritage': {
				name: this.translate.instant('Heritage'),
				iconId: 'coliseum',
				src: AppSettings.baseUrl + '/media/tags/svg/coliseum.svg'
			},
			'human-rights': {
				name: this.translate.instant('Human Rights'),
				iconId: 'auction',
				src: AppSettings.baseUrl + '/media/tags/svg/auction.svg'
			},
			'natural-disaster-prevention': {
				name: this.translate.instant('Natural Disaster Prevention'),
				iconId: 'security',
				src: AppSettings.baseUrl + '/media/tags/svg/security.svg'
			},
			'natural-disaster-recovery': {
				name: this.translate.instant('Natural Disaster Recovery'),
				iconId: 'volcano',
				src: AppSettings.baseUrl + '/media/tags/svg/volcano.svg'
			},
			'poverty': {
				name: this.translate.instant('Poverty'),
				iconId: 'loan',
				src: AppSettings.baseUrl + '/media/tags/svg/loan.svg'
			},
			'refugees': {
				name: this.translate.instant('Refugees'),
				iconId: 'tent',
				src: AppSettings.baseUrl + '/media/tags/svg/tent.svg'
			},
			'sport': {
				name: this.translate.instant('Sport'),
				iconId: 'podium',
				src: AppSettings.baseUrl + '/media/tags/svg/podium.svg'
			},
			'wildlife': {
				name: this.translate.instant('Wildlife'),
				iconId: 'pawprint',
				src: AppSettings.baseUrl + '/media/tags/svg/pawprint.svg'
			}
		};
	}

	snackbar(message: string, timeout: number = 5000) {
		this.onSnackbar.emit({ text: message, timeout: timeout });
	}

	getFileFromUrl(config: { url: string; fileName: string; id?: string }): Observable<FileCustom> {
		return this.http.get(config.url, { responseType: 'blob' })
			.pipe(map((response: Blob) => {
				const file: any = new File([(response as BlobPart)], config.fileName + '.' + mimeTypesExtension[response.type], { type: response.type });
				if (config.id)
					return { file: file, id: config.id };
				else
					return { file: file };
			}));
	}

	getMediaType(mid: ObjectId): Observable<'pdf' | 'image'> {
		return this.http.get<'pdf' | 'image'>(AppSettings.apiUrl + '/media/' + mid + '/type')
			.pipe(unwrap('type'));
	}

	getSingleCountryGeoJSON(country: string) {
		return this.http.get<GeometryFeatureCollection>('data/countries/' + country + '.geojson?v=1');
		// , { cache: true, ignoreLoadingBar: true }));
	}

	getCountriesGeoJSON(): Observable<GeometryFeatureCollection> {
		return this.http.get<GeometryFeatureCollection>('data/country.geojson?v=1');
		// , { cache: true, ignoreLoadingBar: true }));
	}

	getPlatformInfoBase(ignoreLoadingBar: boolean = true): Observable<PlatformInfoBase> {
		if (!this.platformInfoBase) {
			setTimeout(() => { this.platformInfoBase = null }, 60000);

			this.platformInfoBase = this.http.get<PlatformInfoBase>(AppSettings.apiUrl + '/info/base').pipe(
				publishReplay(1),
				refCount()
			);
		}

		return this.platformInfoBase;
	}

	getPlatformInfo(ignoreLoadingBar: boolean = true): Observable<PlatformInfo> {
		return this.http.get<PlatformInfo>(AppSettings.apiUrl + '/info');
		// , { cache: true, ignoreLoadingBar: ignoreLoadingBar }));
	}

	backRedirect(defaultPath: string): void {
		if (this.route.snapshot.queryParamMap.has('redirect'))
			this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('redirect'));
		else if (defaultPath)
			this.router.navigateByUrl(defaultPath);
	}

	search(query: string): Observable<QueryResult[]> {
		return this.http.get<QueryResult[]>(AppSettings.apiUrl + '/search?q=' + query, 
			{ headers: { ignoreLoadingBar: String(true)}})
			.pipe(unwrap('results'));
	}


	getBlogPosts(): Observable<BlogPost[]> {
		return this.http.get<BlogPost[]>(AppSettings.apiUrl + '/blog/' + this.translate.currentLang)
			.pipe(unwrap('posts'));
		// , { ignoreLoadingBar: true }),
	}

	subscribeEmail(email: string): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/subscribe', { 'email': email });
	}

	sendContact(contactData: ContactData): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/contact', contactData);
	}

	sendFeedback(feedbackData: FeedbackData): Observable<void> {
		if (feedbackData.file) {
			const formData: FormData = new FormData();
			formData.append('file', feedbackData.file);
			objectToFormData(formData, feedbackData);
			return this.http.post<void>(AppSettings.apiUrl + '/feedback', formData);
		} else {
			return this.http.post<void>(AppSettings.apiUrl + '/feedback', feedbackData);
		}
	}

	getCountryOfISO(isocode: string[] | string, what?: 'name' | 'string' | 'flag') {
		if (isEmpty(isocode)) {
			if (what == 'flag')
				return;
			else
				return this.translate.instant('Not declared');
		}

		if (what === undefined || what == 'name') {
			if (isocode !== undefined && isocode !== null && typeof (isocode) == 'object') {
				let s = '';
				for (let i = 0; i < isocode.length; i++) {
					s += this.translate.instant(countryDict[isocode[i]]);
					if (i != isocode.length - 1)
						s += ', ';
				}
				return s;
			}
			else if (typeof (isocode) == 'string') {
				if (isocode === undefined || isocode === null)
					return this.translate.instant('Not declared');

				return this.translate.instant(countryDict[isocode]) ||
					this.translate.instant('Not declared');
			}
		}
		else if (what == 'flag')
			return '/media/countryflags/' + isocode + '.png';
	}

	getSString(sstring: string | object) {
		/* Backward compatibility */
		if (typeof (sstring) == 'string') return sstring;
		if (typeof (sstring) != 'object' || sstring == null) return '';

		const clang = this.translate.currentLang;

		if (clang in sstring && sstring[clang].length > 3)
			return sstring[clang] || '';
		else if ('en' in sstring && sstring['en'].length > 3)
			return sstring['en'] || '';
		else if (Object.keys(sstring).length > 0) {
			for (let i = 0; i < Object.keys(sstring).length; i++) {
				const f = Object.keys(sstring)[i];

				if (sstring[f] && sstring[f].length >= 3)
					return sstring[f];
			}
		}
		else
			return '';
	}

	/**
	 * Initialize the CountryRegion JSON and return it. If already initialize, just return the previous result.
	 * @returns an Observable that emit a CountryRegionJSON
	 */
	getCountryRegionJSON(ignoreLoadingBar: boolean = true): Observable<CountryRegionJSON> {
		if(!this.countryRegion) 
			this.countryRegion = this.http.get<CountryRegionJSON>('data/country-region.json').pipe(
				publishReplay(1),
				refCount()
			);

		return this.countryRegion;
	}

	/**
	 * 
	 * @return an Observable, in case of correct result, i will return a the CountryJSON country object
	 */
	getCountryJSON(countryKey: string): Observable<CountryJSON> {
		return this.getCountryRegionJSON().pipe(map((json: CountryRegionJSON) => json[countryKey]));
	}

	/**
	 * 
	 * @return an Observable, in case of correct result, i will return a the string[] country object
	 */
	getRegionsJSON(countryKey: string): Observable<string[]> {
		return this.getCountryRegionJSON().pipe(map((json: CountryRegionJSON) => json[countryKey].regions));
	}

	/**
	 * 
	 * @return an Observable, in case of correct result, i will return a TagsChipsOption array of countries 
	 */

	getCountryTagsChipsOptions(): Observable<TagsChipsOption[]> {
		return this.getCountryRegionJSON().pipe(map((json: CountryRegionJSON) => {
			const arr: TagsChipsOption[] = [];

			Object.keys(json).forEach((countryKey: string) => {
				arr.push({ display: json[countryKey].name, value: countryKey })
			});

			return arr;
		}));
	}

	/**
	 * @param countryKeys the country keys string array
	 * @return an Observable, in case of correct result, i will return a TagsChipsOption array of countries 
	 */

	getCountryTagsChipsOptionsByCountryKeys(countryKeys: string[]): Observable<TagsChipsOption[]> {
		return this.getCountryRegionJSON().pipe(map((json: CountryRegionJSON) => {
			const arr: TagsChipsOption[] = [];

			for(const countryKey of countryKeys)
				arr.push({ display: json[countryKey].name, value: countryKey })

			return arr;
		}));
	}

	/**
	 * 
	 * @return an Observable, in case of correct result, i will return a SelectOption array of countries 
	 */

	getCountrySelectOptions(): Observable<SelectOption[]> {
		return this.getCountryRegionJSON().pipe(map((json: CountryRegionJSON) => {
			const arr: SelectOption[] = [];

			Object.keys(json).forEach((countryKey: string) => {
				arr.push({ label: json[countryKey].name, value: countryKey })
			});

			return arr;
		}));
	}

	/**
	 * 
	 * @param countryKey the country string key
	 * @return an Observable, in case of correct result, i will return a SelectOption array of regions 
	 */

	getRegionSelectOptions(countryKey: string): Observable<SelectOption[]> {
		return this.getCountryRegionJSON().pipe(map((json: CountryRegionJSON) => {
			const arr: SelectOption[] = [];

			json[countryKey].regions.forEach((regionKey: string) => {
				arr.push({ label: regionKey, value: regionKey })
			});

			return arr;
		}));
	}
}
