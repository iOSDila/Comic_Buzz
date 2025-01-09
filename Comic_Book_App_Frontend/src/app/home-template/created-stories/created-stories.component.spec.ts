import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedStoriesComponent } from './created-stories.component';

describe('CreatedStoriesComponent', () => {
  let component: CreatedStoriesComponent;
  let fixture: ComponentFixture<CreatedStoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatedStoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatedStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
