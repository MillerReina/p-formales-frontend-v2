import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//Rutas
import { AppRoutingModule } from './app-routing.module';

//Componentes
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/shared/nav-bar/nav-bar.component';
import { HomeComponent } from './components/home/home/home.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { TreeComponent } from './components/home/tree/tree.component';
import { AfdComponent } from './components/home/afd/afd.component';
import { AfndComponent } from './components/home/afnd/afnd.component';
import { ReComponent } from './components/home/re/re.component';
import { HelpComponent } from './components/home/help/help.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    FooterComponent,
    TreeComponent,
    AfdComponent,
    AfndComponent,
    ReComponent,
    HelpComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
