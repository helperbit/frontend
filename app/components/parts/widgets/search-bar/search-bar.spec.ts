import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MoneyPipe } from 'app/shared/filters/money';
import { TranslateModule } from '@ngx-translate/core';
import { SearchBarComponent } from './search-bar';
import { MockUtilsService } from 'app/shared/helpers/mocks';
import { UtilsService } from 'app/services/utils';
import { CountryPipe } from 'app/shared/filters/country';
import { CropPipe } from 'app/shared/filters/crop';
import { StranslatePipe } from 'app/shared/filters/stranslate';
import { FormsModule } from '@angular/forms';
import { MediaPipe } from 'app/shared/filters/media';
import { AvatarPipe } from 'app/shared/filters/avatar';
import { UsertypePipe } from 'app/shared/filters/usertype';
import { AppRoutingModule } from 'app/app.routing';
import { MetaModule } from 'ng2-meta';
import { RouterTestingModule } from '@angular/router/testing';
import AppSettings from 'app/app.settings';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


describe('SearchBarComponent (isolated test)', () => {
	let component: SearchBarComponent;

	beforeEach(() => {
		component = new SearchBarComponent(null, null);
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});

	it('should run search reset', () => {
		component.searchReset();
		expect(component.searchQuery).toBe('');
		expect(component.searchResults).toEqual([]);
	});
});



describe('SearchBarComponent (shallow test)', () => {
	let component: SearchBarComponent;
	let fixture: ComponentFixture<SearchBarComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SearchBarComponent, MoneyPipe, CountryPipe, CropPipe, StranslatePipe,
				MediaPipe, AvatarPipe, UsertypePipe],
			providers: [
				{ provide: UtilsService, useClass: MockUtilsService }
			],
			// schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslateModule.forRoot(), FormsModule, RouterTestingModule]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SearchBarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});

	it('should not display search result on initialization', () => {
		expect(fixture.nativeElement.querySelector('.dropdown-search').style.display).toBe('none');
	});

	it('should display dropdown on search', () => {
		component.search('hfdsggfsudighfds');
		fixture.detectChanges();
		expect(fixture.nativeElement.querySelector('.dropdown-search').style.display).toBe('block');
	});

	it('should display dropdown on search input', () => {
		expect(fixture.nativeElement.querySelector('.dropdown-search').style.display).toBe('none');
		const inp = fixture.nativeElement.querySelector('#search');
		inp.value = 'dsfhdsfs';
		inp.dispatchEvent(new Event('input'));
		fixture.detectChanges();
		expect(fixture.nativeElement.querySelector('.dropdown-search').style.display).toBe('block');
	});

	it('should display results on search input', () => {
		const inp = fixture.nativeElement.querySelector('#search');
		inp.value = 'user_result';
		inp.dispatchEvent(new Event('input'));
		fixture.detectChanges();
		expect(fixture.nativeElement.querySelector('.dropdown-search').style.display).toBe('block');
		expect(fixture.nativeElement.querySelectorAll('.result').length).toBe(1);
	});
});



describe('SearchBarComponent (integrated test)', () => {
	let component: SearchBarComponent;
	let fixture: ComponentFixture<SearchBarComponent>;
	let httpMock: HttpTestingController;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SearchBarComponent, MoneyPipe, CountryPipe, CropPipe, StranslatePipe,
				MediaPipe, AvatarPipe, UsertypePipe],
			providers: [
				UtilsService
			],
			imports: [HttpClientTestingModule, TranslateModule.forRoot(), FormsModule, AppRoutingModule, MetaModule.forRoot()]
		}).compileComponents();
		httpMock = TestBed.get(HttpTestingController);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SearchBarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});

	it('should find Helperbit user and show results', () => {
		const inp = fixture.nativeElement.querySelector('#search');
		inp.value = 'helperbit';
		inp.dispatchEvent(new Event('input'));
		fixture.detectChanges();

		httpMock.expectOne(AppSettings.apiUrl + '/search?q=helperbit').flush({ results: [{
			type: 'user', 
			time: '', 
			id: 'helperbit', 
			mainInfo: 'Helperbit',
			secondaryInfo: '',
			tertiaryInfo: '',
			media: ''
		}]});
		fixture.detectChanges();

		expect(fixture.nativeElement.querySelector('.dropdown-search').style.display).toBe('block');
		expect(fixture.nativeElement.querySelectorAll('.result').length).toBeGreaterThan(0);
	});
});
