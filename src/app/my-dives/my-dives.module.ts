import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyDivesPageRoutingModule } from './my-dives-routing.module';

import { MyDivesPage } from './my-dives.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyDivesPageRoutingModule
  ],
  declarations: [MyDivesPage]
})
export class MyDivesPageModule {}
