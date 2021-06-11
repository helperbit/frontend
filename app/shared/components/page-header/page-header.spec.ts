import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { PageHeaderComponent } from './page-header';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockActivatedRoute } from 'app/shared/helpers/mocks';
import { ActivatedRoute } from '@angular/router';

describe('PageHeaderComponent (isolated test)', () => {
	let component: PageHeaderComponent;

	beforeEach(() => {
		component = new PageHeaderComponent(null);
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});
});



describe('PageHeaderComponent (shallow test)', () => {
	let component: PageHeaderComponent;
	let fixture: ComponentFixture<PageHeaderComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PageHeaderComponent],
			providers: [
				{ provide: ActivatedRoute, useClass: MockActivatedRoute }
			],
			imports: [],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PageHeaderComponent);
		component = fixture.componentInstance;
		component.config = {
			description: {
				title: 'test title',
				subTitle: 'test subtitle'
			},
			info: {
				boxes: [
					{ title: 't1', subTitle: 's1' },
					{ title: 't2', subTitle: 's2' },
					{ title: 't3', subTitle: 's3' },
					{ title: 't4', subTitle: 's4' }
				]
			}
		}
		fixture.detectChanges();
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});

	it('should have 4 boxes', () => {
		expect(fixture.nativeElement.querySelectorAll('.info').length).toBe(4);
	});

	it('should have title and subtitle', () => {
		expect(fixture.nativeElement.innerHTML).toContain(component.config.description.title);
		expect(fixture.nativeElement.innerHTML).toContain(component.config.description.subTitle);
	});
});

