import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TiendaComponent } from './pages/tienda/tienda.component';
import { ServiciosComponent } from './pages/servicios/servicios.component';
import { SobreNosotrosComponent } from './pages/sobre-nosotros/sobre-nosotros.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { FaqComponent } from './pages/faq/faq.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { PoliticaComponent } from './pages/politica/politica.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tienda', component: TiendaComponent },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'sobre-nosotros', component: SobreNosotrosComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'politica', component: PoliticaComponent },
  { path: '**', redirectTo: '' },
];
