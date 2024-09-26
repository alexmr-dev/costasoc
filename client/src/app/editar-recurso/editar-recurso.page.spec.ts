import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarRecursoPage } from './editar-recurso.page';

describe('EditarRecursoPage', () => {
  let component: EditarRecursoPage;
  let fixture: ComponentFixture<EditarRecursoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditarRecursoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
