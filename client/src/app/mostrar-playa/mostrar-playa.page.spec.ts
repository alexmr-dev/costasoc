import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MostrarPlayaPage } from './mostrar-playa.page';

describe('MostrarPlayaPage', () => {
  let component: MostrarPlayaPage;
  let fixture: ComponentFixture<MostrarPlayaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MostrarPlayaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
