import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilUsuarioMostrarPage } from './perfil-usuario-mostrar.page';

describe('PerfilUsuarioMostrarPage', () => {
  let component: PerfilUsuarioMostrarPage;
  let fixture: ComponentFixture<PerfilUsuarioMostrarPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PerfilUsuarioMostrarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
