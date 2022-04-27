import { Injectable } from '@nestjs/common';

@Injectable() // inject service
export class CommonService {
  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
}
