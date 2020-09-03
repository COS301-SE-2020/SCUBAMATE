import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpgradeInstructorPageRoutingModule } from './upgrade-instructor-routing.module';

import { UpgradeInstructorPage } from './upgrade-instructor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpgradeInstructorPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [UpgradeInstructorPage]
})
export class UpgradeInstructorPageModule {}
