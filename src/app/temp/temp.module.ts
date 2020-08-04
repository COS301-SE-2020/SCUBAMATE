import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MatStepperModule} from '@angular/material/stepper';
import { IonicModule } from '@ionic/angular';
import { TempPageRoutingModule } from './temp-routing.module';
import { TempPage } from './temp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TempPageRoutingModule,
    ReactiveFormsModule,
    MatStepperModule
  ],
  declarations: [TempPage]
})
export class TempPageModule {}
