import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayasPage } from './playas.page';

describe('PlayasPage', () => {
  let component: PlayasPage;
  let fixture: ComponentFixture<PlayasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PlayasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
