import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaRecursosPage } from './lista-recursos.page';

describe('ListaRecursosPage', () => {
  let component: ListaRecursosPage;
  let fixture: ComponentFixture<ListaRecursosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListaRecursosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
