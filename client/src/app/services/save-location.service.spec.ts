import { TestBed } from '@angular/core/testing';

import { SaveLocationService } from './save-location.service';

describe('SaveLocationService', () => {
	let service: SaveLocationService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(SaveLocationService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
