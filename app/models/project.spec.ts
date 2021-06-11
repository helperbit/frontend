import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProjectService } from './project';
import { CurrencyService } from 'app/services/currency';
import { DonationService } from './donation';
import { UserService } from './user';

describe('ProjectService', () => {
	let projectService: ProjectService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule
			],
			providers: [
				ProjectService,
				UserService,
				CurrencyService,
				DonationService
			]
		});
		projectService = TestBed.get(ProjectService);
	});

	it('should istantiate', () => {
		expect(projectService).toBeDefined();
	});


	// it('should get home list', (done) => {
	// 	projectService.getHomeList().subscribe(data => {
	// 		console.log('test',data);
	// 		done();
	// 	});
	// });
});
