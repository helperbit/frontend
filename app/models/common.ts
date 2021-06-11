import differenceInWeeks from 'date-fns/differenceInWeeks';
import addWeeks from 'date-fns/addWeeks';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Project } from './project';

export type ISODate = string;
export type ObjectId = string;

export type EventTypes = 'earthquake' | 'flood' | 'wildfire' | 'tsunami' | 'eruption' | 'slide' | 'hurricane' | 'drought' | 'populated-events';

export type Tags = 'art' | 'education' | 'environment' | 'health' | 'heritage' | 'human-rights' | 'natural-disaster-prevention'
| 'natural-disaster-recovery' | 'poverty' | 'refugees' | 'sport' | 'wildlife';

export type UserProfileFields = 'mobile' | 'website' | 'country' | 'firstname' | 'lastname' | 'birthdate' | 'gender' | 'language' | 'fullname' | 'telephone' | 'inhabitants' | 'mayor' | 'mandateperiod' | 'vat' | 'operators' | 'tags' | 'referent.firstname' | 'referent.lastname' | 'referent.idnumber' | 'referent.email' | 'photo' | 'biography';

export type Operators = '2-10' | '10-50' | '50-250' | '250-1000' | '1000-5000' | '5000+';

export type UserType = 'singleuser' | 'company' | 'npo' | 'municipality';

export type Inhabitants = '1-1999' | '2000-4999' | '5000-9999' | '10000-19999' | '20000-59999' | '60000-249999' | '250000+';

export type Language = 'en' | 'it' | 'es';

export type LanguageText = 'English' | 'Italian' | 'Spanish';

export type Gender = 'm' | 'f' | 'n';

export type TString = { [key in Language]?: string; };

export type ChangeHistory = {
	changeDate: ISODate;
	content: any;
}[];

export type Point = {
	type: string;
	coordinates: number[];
};

export type Geometry = Point;

export type GeometryFeature = {
	type: string;
	properties: any;
	geometry: Geometry;
};

export type Badge = {
	time: string;
	_id: string;
	code: string;
};

export type GeometryFeatureCollection = {
	type: 'FeatureCollection';
	features: GeometryFeature[];
};


export interface PaginationQuery {
	page?: number;
	sort?: string | 'asc' | 'desc';
	orderby?: string;
	limit?: number;

	name?: string;
	flow?: string | 'in' | 'out';
}

export interface PaginationReply<T> {
	list: T[];
	count: number;
}



export interface ChartDataRaw {
	chart: {
		_id: {
			week: number;
			year: number;
		};
		amount: number;
	}[];
	period: 'week';
}

export interface ChartData {
	data: {
		amount: number;
		date: Date;
	}[];
	minDate: Date;
	maxDate: Date;
}

export function transformChartData(data: ChartDataRaw) {
	const reply: ChartData = {
		data: [],
		minDate: null,
		maxDate: null
	};

	reply.data = [];


	if (data.chart.length == 0)
		return reply;

	reply.data.push({
		amount: 0.0,
		date: addWeeks(new Date(data.chart[0]._id.year, 0, 1), data.chart[0]._id.week - 1)
	});

	for (let i = 0; i < data.chart.length; i++) {
		reply.data.push({
			amount: data.chart[i].amount,
			date: addWeeks(new Date(data.chart[i]._id.year, 0, 1), data.chart[i]._id.week)
		});

		if (i < data.chart.length - 1) {
			const dif = differenceInWeeks(
				addWeeks(new Date(data.chart[i + 1]._id.year, 0, 1), data.chart[i + 1]._id.week),
				addWeeks(new Date(data.chart[i]._id.year, 0, 1), data.chart[i]._id.week)
			);
			if (dif > 1) {
				let y = data.chart[i]._id.year;
				let w = data.chart[i]._id.week;

				for (let j = 0; j < dif - 1; j++) {
					if (w > 54) {
						y += 1;
						w = 0;
					} else {
						w += 1;
					}

					reply.data.push({
						amount: 0.0,
						date: addWeeks(new Date(y, 0, 1), w)
					});
				}
			}
		}
	}

	reply.data.push({
		amount: 0.0,
		date: addWeeks(new Date(data.chart[data.chart.length - 1]._id.year, 0, 1), data.chart[data.chart.length - 1]._id.week + 1)
	});

	reply.minDate = reply.data[0].date;
	reply.maxDate = reply.data[reply.data.length - 1].date;

	return reply;
}


export function unwrap(field: string): (data: Observable<any>) => Observable<any> {
	return map((res) => res[field]);
}
export function unwrapPaginated(field: string): (data: Observable<any>) => Observable<any> {
	return map((res) => ({
		list: res[field],
		count: res.count
	}));
}






export interface RowStyle {
	status: {
		class: {
			label: string;
			icon: string;
		};
		text: string;
	};
	buttons: {
		text: string;
		class: string;
		icon: {
			class: string;
		};
		tooltip: string;
		show: boolean;
		click?: (project: Project) => void;
	}[];
}

export interface RowStyleObject {
	[key: string]: RowStyle;
}