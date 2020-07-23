import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDivePageRoutingModule } from './edit-dive-routing.module';

import { EditDivePage } from './edit-dive.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditDivePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditDivePage]
})
export class EditDivePageModule {}
