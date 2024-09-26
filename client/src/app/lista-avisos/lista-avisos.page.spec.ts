import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaAvisosPage } from './lista-avisos.page';

describe('ListaAvisosPage', () => {
  let component: ListaAvisosPage;
  let fixture: ComponentFixture<ListaAvisosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListaAvisosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
