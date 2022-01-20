import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linebreaks'
})
export class LinebreaksPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    // console.log(value);
    // const str = value.replace(/\\n/g, '<br />');
    const str = value.replace(/\n/g, '<br />');
    // console.log(str);
    return str;
  }

}
