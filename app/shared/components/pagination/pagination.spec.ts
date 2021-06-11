import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { PaginationComponent } from './pagination';


describe('PaginationComponent (isolated test)', () => {
	let component: PaginationComponent;

	beforeEach(() => {
		component = new PaginationComponent();
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});

	it('should set handlers', () => {
		component.registerOnChange(()=>{});
		expect(component.onChangeHandler).toBeDefined();
		component.registerOnTouched(()=>{});
		expect(component.onTouchedHandler).toBeDefined();
	});

	it('should set disabled', () => {
		component.setDisabledState(true);
		expect(component.disabled).toBeTrue();
		component.setDisabledState(false);
		expect(component.disabled).toBeFalse();
	});
});



describe('PaginationComponent (shallow test)', () => {
	let component: PaginationComponent;
	let fixture: ComponentFixture<PaginationComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PaginationComponent],
			// schemas: [NO_ERRORS_SCHEMA],
			imports: []
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PaginationComponent);
		component = fixture.componentInstance;
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});

	it('should visualize correct number of pages (no boundary)', () => {
		component.itemsPerPage = 25;
		component.totalItems = 100;
		component.maxSize = 4;
		
		component.writeValue(1);
		component.ngOnChanges();
		fixture.detectChanges();
		expect(fixture.debugElement.nativeElement.querySelectorAll('li').length).toBe(4);
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.active').length).toBe(1);

		component.itemsPerPage = 25;
		component.totalItems = 200;
		component.writeValue(1);
		component.ngOnChanges();
		fixture.detectChanges();
		expect(fixture.debugElement.nativeElement.querySelectorAll('li').length).toBe(5); //?
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.active').length).toBe(1);
	});

	it('should visualize boundary links', () => {
		component.itemsPerPage = 25;
		component.totalItems = 800;
		component.boundaryLinks = true;
		component.maxSize = 4;
		
		component.writeValue(1);
		component.ngOnChanges();
		fixture.detectChanges();
		expect(fixture.debugElement.nativeElement.querySelectorAll('li').length).toBe(9); //?
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.active').length).toBe(1);
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.pagination-first').length).toBe(2);
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.pagination-last').length).toBe(2);
	});

	it('should change page on click', (done) => {
		component.change.subscribe(l => {
			fixture.detectChanges();
			expect(component.currentPage).toBe(2);	
			expect(component.value).toBe(2);	
			done();
		});

		component.itemsPerPage = 25;
		component.totalItems = 100;
		component.maxSize = 4;
		
		component.writeValue(1);
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.currentPage).toBe(1);

		fixture.debugElement.nativeElement.querySelectorAll('a')[1].dispatchEvent(new MouseEvent('click'));
		fixture.detectChanges();
	});
});

