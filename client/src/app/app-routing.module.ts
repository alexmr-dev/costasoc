import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full'
	},
	{
		path: 'perfil',
		loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilPageModule)
	},
	{
		path: 'home',
		loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
	},
	{
		path: 'login',
		loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
	},
	{
		path: 'perfil-usuario-mostrar/:id',
		loadChildren: () => import('./perfil-usuario-mostrar/perfil-usuario-mostrar.module').then(m => m.PerfilUsuarioMostrarPageModule)
	},
	{
		path: 'registrar-aviso',
		loadChildren: () => import('./registrar-aviso/registrar-aviso.module').then(m => m.RegistrarAvisoPageModule)
	},
	{
		path: 'editar-recurso/:id',
		loadChildren: () => import('./editar-recurso/editar-recurso.module').then(m => m.EditarRecursoPageModule)
	},
	{
		path: 'editar-aviso/:id',
		loadChildren: () => import('./editar-aviso/editar-aviso.module').then(m => m.EditarAvisoPageModule)
	},
	{
		path: 'perfil-usuario-mostrar',
		loadChildren: () => import('./perfil-usuario-mostrar/perfil-usuario-mostrar.module').then(m => m.PerfilUsuarioMostrarPageModule)
	},
	{
		path: 'mostrar-playa/:id',
		loadChildren: () => import('./mostrar-playa/mostrar-playa.module').then(m => m.MostrarPlayaPageModule)
	},
	{
		path: 'lista-recursos/:id',
		loadChildren: () => import('./lista-recursos/lista-recursos.module').then(m => m.ListaRecursosPageModule)
	},
	{
		path: 'lista-avisos/:id',
		loadChildren: () => import('./lista-avisos/lista-avisos.module').then(m => m.ListaAvisosPageModule)
	},
	{
		path: 'lista-socorristas/:id',
		loadChildren: () => import('./lista-socorristas/lista-socorristas.module').then(m => m.ListaSocorristasPageModule)
	},
	{
		path: 'lista-playas',
		loadChildren: () => import('./lista-playas/lista-playas.module').then(m => m.ListaPlayasPageModule)
	},
	{
		path: 'editar-recurso-banderas/:id',
		loadChildren: () => import('./editar-recurso-banderas/editar-recurso-banderas.module').then(m => m.EditarRecursoBanderasPageModule)
	}



];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
