import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaSocorristasPage } from './lista-socorristas.page';

describe('ListaSocorristasPage', () => {
  let component: ListaSocorristasPage;
  let fixture: ComponentFixture<ListaSocorristasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListaSocorristasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
