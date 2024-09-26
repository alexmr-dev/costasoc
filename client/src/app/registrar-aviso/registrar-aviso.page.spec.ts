import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarAvisoPage } from './registrar-aviso.page';

describe('RegistrarAvisoPage', () => {
  let component: RegistrarAvisoPage;
  let fixture: ComponentFixture<RegistrarAvisoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RegistrarAvisoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
