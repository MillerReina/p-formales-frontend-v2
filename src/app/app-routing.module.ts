import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Componentes
import { HomeComponent } from './components/home/home/home.component';
import { TreeComponent } from './components/home/tree/tree.component';
import { AfdComponent } from './components/home/afd/afd.component';
import { AfndComponent } from './components/home/afnd/afnd.component';
import { ReComponent } from './components/home/re/re.component';
import { HelpComponent } from './components/home/help/help.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'afd', component: AfdComponent },
  { path: 'afnd', component: AfndComponent },
  { path: 'tree', component: TreeComponent },
  { path: 're', component: ReComponent },
  { path: 'help', component: HelpComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
