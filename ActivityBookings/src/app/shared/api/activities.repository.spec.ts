import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Activity, NULL_ACTIVITY } from '@domain/activity.type';
import { ActivitiesRepository } from './activities.repository';

const baseUrl = 'http://localhost:3000/activities';
const activities: Activity[] = [
  { ...NULL_ACTIVITY, id: 1 },
  { ...NULL_ACTIVITY, id: 2 },
];
describe('The ActivitiesRepository service', () => {
  let repository: ActivitiesRepository;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ActivitiesRepository],
    });
    repository = TestBed.inject(ActivitiesRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });
  it('should be created', () => {
    expect(repository).toBeTruthy();
  });
  it('should get all activities from the API', () => {
    // Act
    repository.getActivities$().subscribe((response) => {
      // Assert
      expect(response).toEqual(activities);
    });
    // Arrange
    const request = httpMock.expectOne(baseUrl);
    request.flush(activities);
    // Assert
    expect(request.request.method).toBe('GET');
  });
  it('should get an activity by its slug from the API', () => {
    const slug = 'activity-slug';
    const activity: Activity = { ...NULL_ACTIVITY, id: 1, slug };
    // Act
    repository.getActivityBySlug$(slug).subscribe((response) => {
      // Assert
      expect(response).toEqual(activity);
    });
    const request = httpMock.expectOne(`${baseUrl}?slug=${slug}`);
    request.flush([activity]);
  });
  it('should return NULL_ACTIVITY if the slug is not defined', () => {
    repository.getActivityBySlug$(undefined).subscribe((response) => {
      expect(response).toEqual(NULL_ACTIVITY);
    });
  });
  it('should return NULL_ACTIVITY if the activity is not found', () => {
    const slug = 'not-found-activity-slug';
    repository.getActivityBySlug$(slug).subscribe((response) => {
      expect(response).toEqual(NULL_ACTIVITY);
    });
    const request = httpMock.expectOne(`${baseUrl}?slug=${slug}`);
    request.flush([]);
  });
  it('should update an activity in the API', () => {
    const activity: Activity = { ...NULL_ACTIVITY, id: 1 };
    repository.putActivity$(activity).subscribe((response) => {
      expect(response).toEqual(activity);
    });
    const request = httpMock.expectOne(`${baseUrl}/${activity.id}`);
    request.flush(activity);
    expect(request.request.method).toBe('PUT');
  });
  afterEach(() => {
    httpMock.verify();
  });
});
