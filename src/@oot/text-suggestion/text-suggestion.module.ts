import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TextSuggestionComponent } from './text-suggestion.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        MatAutocompleteModule
    ],
    declarations: [TextSuggestionComponent],
    exports: [TextSuggestionComponent]
})
export class TextSuggestionModule { }
