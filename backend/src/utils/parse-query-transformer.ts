// parse-nested-query.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import * as qs from 'qs';

@Injectable()
export class ParseNestedQueryPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'query' && value && typeof value === 'object') {
      const parsed = qs.parse(value);
      return this.convertTypes(parsed);
    }
    return value;
  }

  private convertTypes(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((v) => this.convertTypes(v));
    }
    if (obj !== null && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, this.convertTypes(v)]),
      );
    }
    if (typeof obj === 'string') {
      obj = obj.trim();
      if (/^\d+$/.test(obj)) return Number(obj);
      if (/^\d+\.\d+$/.test(obj)) return parseFloat(obj);
      if (obj === 'true') return true;
      if (obj === 'false') return false;
    }
    return obj;
  }
}
