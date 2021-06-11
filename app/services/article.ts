import getUnixTime from 'date-fns/getUnixTime';
import addHours from 'date-fns/addHours';
import { TranslateService, TranslateParser } from '@ngx-translate/core';
import { UtilsService } from './utils';
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';


interface ArticlePhrase {
	text: {
		en: string;
		it?: string;
		es?: string;
	};
	conditions: {
		field: string;
		min?: number;
		max?: number;
	}[];
}

interface ArticleData {
	title: ArticlePhrase;
	phrases: ArticlePhrase[];
}

@Injectable()
export class ArticleService {
	articles: {
		flood: ArticleData;
		earthquake: ArticleData;
		wildfire: ArticleData;
	};

	constructor(
		private translateParser: TranslateParser,
		private datePipe: DatePipe,
		private translate: TranslateService,
		private utilsService: UtilsService
	) {
		this.articles = {
			'flood': require('../assets/data/articles/flood.json'),
			'earthquake': require('../assets/data/articles/earthquake.json'),
			'wildfire': require('../assets/data/articles/wildfire.json'),
		};
	}

	/* Return a list of matching phrases */
	findMatchingPhrases(phrases, fields) {
		const matchConditions = function (conditions, fields) {
			const matchCondition = function (condition, fields) {
				if ('notpresent' in condition && condition.notpresent && fields[condition.field] !== null)
					return false;
				if (('equal' in condition) && (fields[condition.field] === null || fields[condition.field] != condition.equal))
					return false;
				if (('notequal' in condition) && (fields[condition.field] === null || fields[condition.field] == condition.notequal))
					return false;
				if (('min' in condition) && (fields[condition.field] === null || fields[condition.field] < condition.min))
					return false;
				if (('max' in condition) && (fields[condition.field] === null || fields[condition.field] >= condition.max))
					return false;

				return true;
			};

			for (let j = 0; j < conditions.length; j++) {
				if (!matchCondition(conditions[j], fields)) {
					return false;
				}
			}
			return true;
		};

		const l = [];

		for (let i = 0; i < phrases.length; i++) {
			const ph = phrases[i];
			if (matchConditions(ph.conditions, fields))
				l.push(ph);
		}

		return l;
	}

	choose(choices) {
		const index = Math.floor(Math.random() * choices.length);
		return choices[index];
	}

	/* TODO Convert event.lastshakedate to correct timezone */

	generateEventArticle(event: any) {
		/* Transform hour in localtime */
		if ('timezone' in event && event.timezone)
			event.lastshakedate = getUnixTime(addHours(new Date(event.lastshakedate), event.timezone)) + '000';
		else
			event.lastshakedate = getUnixTime(new Date(event.lastshakedate)) + '000';

		const fields: any = {
			title: '',
			mag: event.maxmagnitude,
			country: this.utilsService.getCountryOfISO(event.affectedcountries[0]),
			region: event.affectedregions[0] || '',
			apop: event.population.affected,
			acit: event.affectedcities,
			deaths: event.population.deaths,
			displaced: event.population.displaced,
			wounded: event.population.wounded,

			typicaldepth: event.typicaldepth,
			tsunami: event.tsunami,
			issea: event.issea,
			shakes: event.shakes,

			date: this.datePipe.transform(event.lastshakedate, 'longDate'),
			timetext: '',
			time: this.datePipe.transform(event.lastshakedate, 'shortTime'),
			halftimetext: '',

			depthtext: '',
			depth: event.epicenter.coordinates[2],
			faultdistance: event.faultdistance,
			plateprimary: event.plateprimary,
			platesecondary: event.platesecondary,

			capital: event.capital.name,
			capitaldist: Math.floor(event.capital.distance / 10) * 10,
			capitalpop: event.capital.population,

			histyeardiff: event.historical.yeardiff,
			histdate: event.historical.date,
			histdeaths: event.historical.deaths,
			histdestroyed: event.historical.destroyedhouse,
			histmag: event.historical.magnitude,
			histcost: event.historical.damagecost,

			ncitydist: Math.floor(event.nearcity.distance / 10) * 10,
			ncity: event.nearcity.name,
			ncitydir: event.nearcity.direction,
			ncitypop: event.nearcity.population
		};

		/* Depth */
		if (event.epicenter.coordinates[2] < 60) fields.depthtext = this.translate.instant("a shallow");
		else if (event.epicenter.coordinates[2] < 300) fields.depthtext = this.translate.instant("an intermediate");
		else if (event.epicenter.coordinates[2] >= 300) fields.depthtext = this.translate.instant("a deep");

		/* Evalute daytime */
		const hours = new Date(event.lastshakedate).getHours();
		if (hours <= 4) {
			fields.timetext = this.translate.instant("in the night");
			fields.halftimetext = this.translate.instant("tonight");
		}
		else if (hours > 4 && hours <= 13) {
			fields.timetext = this.translate.instant("in the morning");
			fields.halftimetext = this.translate.instant("today");
		}
		else if (hours > 13 && hours <= 18) {
			fields.timetext = this.translate.instant("in the afternoon");
			fields.halftimetext = this.translate.instant("today");
		}
		else if (hours > 18) {
			fields.timetext = this.translate.instant("in the evening");
			fields.halftimetext = this.translate.instant("tonight");
		}

		const template = this.articles[event.type];
		const lang = 'en'; // force english this.translate.currentLang;

		/* Generate the title */
		const tit = this.choose(this.findMatchingPhrases(template.title, fields));
		fields.title = this.translate.instant(tit.text[lang] || tit.text['en']);
		fields.title = this.translateParser.interpolate(fields.title, fields);

		/* Custom article override */
		let body = "";
		if (event.article && event.article[lang]) {
			body = this.translate.instant(event.article[lang]);
			body = this.translateParser.interpolate(body, fields);

			return { title: fields.title, body: body, template: template };
		}

		/* Generate the article */

		for (let i = 0; i < template.phrases.length; i++) {
			const phs = this.findMatchingPhrases(template.phrases[i], fields);

			if (phs.length == 0) continue;

			const ph = this.choose(phs);

			body += this.translateParser.interpolate(
				this.translate.instant(ph.text[lang] || ph.text['en']), fields
			) + ' ';
		}

		return { title: fields.title, body: body, template: template };
	}
}
