import { ModuleWithProviders, NgModule } from '@angular/core';
import { FileInputComponent } from './file-input.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ConnectionService } from 'app/services/connection.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectiveModule } from 'app/directive/directive.module';
import { FileInputConfig } from './file-input-config.type';
import { FileInputService } from './file-input.service';

@NgModule({
    imports: [
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRippleModule,
        MatProgressBarModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DirectiveModule
    ],
    providers:[
        ConnectionService
    ],
    declarations: [
        FileInputComponent,
    ],
    exports: [
        FileInputComponent,
    ]
})
export class FileInputModule {
    static forRoot(config: FileInputConfig): ModuleWithProviders<FileInputModule> {
        return {
            ngModule: FileInputModule,
            providers: [FileInputService, { provide: 'config', useValue: config }]
        };
    }
}
