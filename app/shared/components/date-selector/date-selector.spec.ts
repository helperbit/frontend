import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DateSelectorComponent, getDateFromDateSelectorModel, getDateSelectorModelFromDate } from './date-selector';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockTranslateService } from 'app/shared/helpers/mocks';


describe('DateSelectorComponent (isolated test)', () => {
	let component: DateSelectorComponent;

	beforeEach(() => {
		component = new DateSelectorComponent(new MockTranslateService as any, null);
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});
});

describe('DateSelectorComponent (conversion functions)', () => {
	const testData = [
		{ year: 1905, month: 1, day: 6 },
		{ year: 1975, month: 11, day: 31 },
		{ year: 2019, month: 2, day: 12 }
	];

	it('should run a two-way conversion', () => {
		for (let d of testData) {
			expect(getDateSelectorModelFromDate(getDateFromDateSelectorModel(d))).toEqual(d);
		}
	});

	it('should transform dict to Date', () => {
		for (let j of testData) {
			const dateO: Date = getDateFromDateSelectorModel(j);
			expect(dateO.getFullYear()).toBe(j.year);
			expect(dateO.getMonth()).toBe(j.month);
			expect(dateO.getDate()).toBe(j.day);
		}
	});

	it('should transform Date to dict', () => {
		for (let d of testData) {
			const dateO: Date = new Date(`${d.year}-${d.month + 1}-${d.day}`);
			expect(getDateSelectorModelFromDate(dateO)).toEqual(d);
		}
	});
});

describe('DateSelectorComponent (shallow test)', () => {
	let component: DateSelectorComponent;
	let fixture: ComponentFixture<DateSelectorComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DateSelectorComponent],
			providers: [
				{ provide: TranslateService, useClass: MockTranslateService }
			],
			// schemas: [NO_ERRORS_SCHEMA],
			imports: [FormsModule, ReactiveFormsModule, TranslateModule.forRoot()]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DateSelectorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		component.name = 'test';
		component.ngOnChanges({});
		fixture.detectChanges();
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});

	it('should have 3 selects, only year selectable', async () => {
		expect(fixture.debugElement.nativeElement.querySelectorAll('select').length).toBe(3);
		expect(fixture.debugElement.nativeElement.querySelectorAll('select:disabled').length).toBe(2);
	});

	it('should be able to select a date and read the correct model value', (done) => {
		component.registerOnChange((date) => {
			expect(date.year).toBe(1905);
			expect(date.month).toBe(1);
			expect(date.day).toBe(2);
			done();
		});

		// Select year
		const selects = fixture.debugElement.nativeElement.querySelectorAll('select');
		selects[0].value = selects[0].options[5].value;
		selects[0].dispatchEvent(new Event('change'));
		fixture.detectChanges();
		expect(fixture.debugElement.nativeElement.querySelectorAll('select:disabled').length).toBe(1);

		// Select month
		selects[1].value = selects[1].options[1].value;
		selects[1].dispatchEvent(new Event('change'));
		fixture.detectChanges();
		expect(fixture.debugElement.nativeElement.querySelectorAll('select:disabled').length).toBe(0);

		// Select day
		selects[2].value = selects[2].options[1].value;
		selects[2].dispatchEvent(new Event('change'));
		fixture.detectChanges();
	});

	it('should be able to set a model value and read the correct view value', async () => {
		component.writeValue({ year: 2011, month: 5, day: 7 });
		fixture.detectChanges();

		expect(fixture.debugElement.nativeElement.querySelectorAll('select:disabled').length).toBe(0);
		const selects = fixture.debugElement.nativeElement.querySelectorAll('select');
		expect(selects[0].value).toBe('2011');
		expect(selects[1].value).toBe('5');
		expect(selects[2].value).toBe('7');
	});
});

