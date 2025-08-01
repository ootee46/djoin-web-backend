import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import moment from 'moment';

export class CustomValidator {
  static whiteSpace(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    else if (control.value && (control.value as string).trim() === '') {
      return { whiteSpace: true };
    }
    else {
      return null;
    }
  }

  static strongPassword(control: AbstractControl): ValidationErrors | null {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!control.value) {
      return null;
    } else if (!passwordRegex.test(control.value)) {
      return { 'strongPassword': true };
    } else {
      return null;
    }
  }

  static futureDate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    } else if (moment(control.value, 'YYYY-MM-DD').isValid() === false) {
      return { 'futureDate': true };
    }
    else if (moment(control.value, 'YYYY-MM-DD') < moment()) {
      return { 'futureDate': true };
    }
    else {
      return null;
    }
  }

  static timeFormat(control: AbstractControl): ValidationErrors | null {
    const TIME_REGEXP = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!control.value) {
      return null;
    } else if (!TIME_REGEXP.test(control.value)) {
      return { 'timeFormat': true };
    } else {
      return null;
    }
  }

  static username(control: AbstractControl): ValidationErrors | null {
    const USERNAME_REGEXP = /^[a-zA-Z0-9]+([\-._\\]?[a-zA-Z0-9]+)*$/;
    if (!control.value) {
      return null;
    } else if (!USERNAME_REGEXP.test(control.value)) {
      return { 'username': true };
    } else {
      return null;
    }
  }

  static urlValidator(control: AbstractControl): ValidationErrors | null {
    const URL_REGEXP = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    if (!control.value) {
      return null;
    } else if (!URL_REGEXP.test(control.value)) {
      return { 'invalidUrl': true };
    } else {
      return null;
    }
  }

  static maxTimeValidate(startTimeControlName: string, endTimeControlName: string) {
    return (formGroup: FormGroup): any => {
      const startTimeControl = formGroup.get(startTimeControlName);
      const endTimeControl = formGroup.get(endTimeControlName);

      if (!startTimeControl || !endTimeControl || !startTimeControl.value || !endTimeControl.value) {
        return null;
      }

      const TIME_REGEXP = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!TIME_REGEXP.test(startTimeControl.value) || !TIME_REGEXP.test(endTimeControl.value)) {
        return null;
      }
      const startTime = moment(startTimeControl.value, 'HH:mm');
      const endTime = moment(endTimeControl.value, 'HH:mm');
      if (startTime.isSameOrBefore(endTime)) {
        return null;
      }
      return { invalidMaxTime: true };
    };
  }

  static maxDateValidate(startDateControlName: string, endDateControlName: string, returnError: string) {
    return (formGroup: FormGroup): any => {
      const startDateControl = formGroup.get(startDateControlName);
      const endDateControl = formGroup.get(endDateControlName);
      if (!startDateControl || !endDateControl || !startDateControl.value || !endDateControl.value) {
        return null;
      }

      const DATE_REGEXP = /^(19|20)\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$/;
      if (!DATE_REGEXP.test(startDateControl.value) || !DATE_REGEXP.test(endDateControl.value)) {
        return null;
      }
      const startDate = moment(startDateControl.value, 'YYYY-MM-DD');
      const endDate = moment(endDateControl.value, 'YYYY-MM-DD');

      if (startDate.isBefore(endDate)) {
        return null;
      }
      return { [returnError]: true };
    };
  }

}
