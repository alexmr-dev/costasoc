import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarRecursoBanderasPage } from './editar-recurso-banderas.page';

describe('EditarRecursoBanderasPage', () => {
  let component: EditarRecursoBanderasPage;
  let fixture: ComponentFixture<EditarRecursoBanderasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditarRecursoBanderasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
