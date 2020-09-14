import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/shared/nav-bar/nav-bar.component';
import { HomeComponent } from './components/home/home/home.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { TreeComponent } from './components/home/tree/tree.component';

@NgModule({
  declarations: [AppComponent, NavBarComponent, HomeComponent, FooterComponent, TreeComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
