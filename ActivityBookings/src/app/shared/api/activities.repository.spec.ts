import { TestBed } from '@angular/core/testing';

import { ActivitiesRepository } from './activities.repository';

describe('ActivitiesRepository', () => {
  let service: ActivitiesRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivitiesRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
