import { AbstractControl } from '@angular/forms';
import * as moment from 'moment';

export class DateValidator {
    static dateValidator(AC: AbstractControl) {
        if (AC && AC.value && !moment(AC.value, 'mm/dd/yyyy', true).isValid()) {
            return null;
        }
        return { 'dateValidator': true };
    }
}
