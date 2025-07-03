import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Subject, of, pipe } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DocumentTypeFormComponent } from './form.component';
import { DocumentTypeService } from '../document-type.service';
import { Overlay } from '@angular/cdk/overlay';
import Swal from 'sweetalert2';
import { SharedModule } from 'app/shared/shared.module';
import { DocumentTypeModel } from 'app/models/document-type.model';
import { InputFormData } from 'app/models/input-form-data';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

describe('DocumentTypeFormComponent', () => {
  let component: DocumentTypeFormComponent;
  let fixture: ComponentFixture<DocumentTypeFormComponent>;
  let dialogRef: MatDialogRef<DocumentTypeFormComponent>;
  let service: DocumentTypeService;
  const input: InputFormData<DocumentTypeModel> = {
    action: 'add',
    data: new DocumentTypeModel({active: true}),
    dataCheck: null
  };

  beforeEach(async(() => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    service = jasmine.createSpyObj('DocumentTypeService',{
      'create': of('mock data'),
    });

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule
        , NoopAnimationsModule
        , MatSlideToggleModule
        , SharedModule
        , MatDialogModule],
      declarations: [DocumentTypeFormComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: input },
        { provide: DocumentTypeService, useValue: service }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call service.create when action is "add"', () => {
    component.action = 'add';
    component.dataForm.setValue({ id: 1, name: 'test', active: true });
    component.saveData();
    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();
    expect(Swal.isVisible()).toBeTruthy();
    setTimeout(() => {
      Swal.close();
    }, 0);
  });
  it('should be name error', () => {
    component.action = 'add';
    component.dataForm.setValue({ id: 1, name: null, active: true });
    expect(component.dataForm.get('name').invalid).toBeTruthy();
  });
  it('should be active error', () => {
    component.action = 'add';
    component.dataForm.setValue({ id: 1, name: 'adfadf', active: null });
    expect(component.dataForm.get('active').invalid).toBeTruthy();
  });

});
