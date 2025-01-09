import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableSearch'
})
export class TableSearchPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
      return null;
    }
    else if (!args) {
      return value;
    }
    else {
      return value.filter(user =>
        JSON.stringify(user).trim().toLowerCase().includes(args.trim().toLowerCase())
      );
    }
  }

}
