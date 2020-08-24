import { URLSearchParams } from 'url';

export class URLParams {

  public static getParamsString(query: object): string {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => params.set(key, value));
    return params.toString();
  }

}
