import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';


import { IonicModule } from '@ionic/angular';
import { TempPageRoutingModule } from './temp-routing.module';
import { TempPage } from './temp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TempPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [TempPage]
})
export class TempPageModule {}
