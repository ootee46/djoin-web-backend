import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AttachmentFormComponent } from './form/form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AttachmentConfig } from './attachment-config.type';
import { AttachmentService } from './attachment.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AttachmentComponent } from './attachment.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule
  ],
  declarations: [AttachmentComponent, AttachmentFormComponent],
  exports:[AttachmentComponent]
})
export class AttachmentModule {

    static forRoot(config: AttachmentConfig): ModuleWithProviders<AttachmentModule> {
        return {
            ngModule: AttachmentModule,
            providers: [AttachmentService, {provide: 'config', useValue: config}]
        };
    }
 }
