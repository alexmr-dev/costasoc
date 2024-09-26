import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarAvisoPage } from './editar-aviso.page';

describe('EditarAvisoPage', () => {
  let component: EditarAvisoPage;
  let fixture: ComponentFixture<EditarAvisoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditarAvisoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
