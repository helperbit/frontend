import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FaqComponent } from './faq';
import { SeoFooterComponent } from 'app/components/parts/seofooter/seofooter';
import { TranslatedComponent } from 'app/shared/components/translated/translated';

describe('FaqComponent (isolated test)', () => {
	let component: FaqComponent;

	beforeEach(() => {
		component = new FaqComponent();
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});
});


describe('FaqComponent (shallow test)', () => {
	let component: FaqComponent;
	let fixture: ComponentFixture<FaqComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [FaqComponent, SeoFooterComponent, TranslatedComponent],
			providers: [],
			imports: [TranslateModule.forRoot()]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FaqComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});
});

