import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaPlayasPage } from './lista-playas.page';

describe('ListaPlayasPage', () => {
  let component: ListaPlayasPage;
  let fixture: ComponentFixture<ListaPlayasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListaPlayasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
