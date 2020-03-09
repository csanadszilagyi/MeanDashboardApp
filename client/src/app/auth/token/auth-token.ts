import { urlBase64Decode } from './helper-functions';

/**
 * Token stored in cookie.
 */
export class AuthJWTCookieToken {

    static NAME = 't_hp';
    
    constructor(protected readonly token: any) {
        
    }

    /*
    private parts(): Array<string> {
      return this.token.split('.');
    }
  
    getSignature(): string {
  
    }
    */
  
    /**
     * Returns payload object
     * @returns any
     */
    getPayload(): any {
  
      if (!this.token) {
        throw new Error('Cannot extract payload from an empty token.');
      }
  
      const parts = this.token.split('.');
  
      // two tokens: header.payload (signature is in another cookie)
      if (parts.length !== 2) {
        throw new Error(`The header-payload part ${this.token} is not valid JWT token part and must consist of two parts.`);
      }
  
      let decoded;
      try {
        decoded = urlBase64Decode(parts[1]);
      } catch (e) {
        throw new Error(`The token ${this.token} is not valid JWT token and cannot be parsed.`);
      }
  
      if (!decoded) {
        throw new Error(`The token ${this.token} is not valid JWT token and cannot be decoded.`);
      }
  
      return JSON.parse(decoded);
    }
  
    /**
     * Returns expiration date
     * @returns Date
     */
    getTokenExpDate(): Date {
      const decoded = this.getPayload();
      if (!decoded.hasOwnProperty('exp')) {
        return null;
      }
  
      const date = new Date(0);
      date.setUTCSeconds(decoded.exp);
  
      return date;
    }
  
    /**
     * Is data expired
     * @returns {boolean}
     */
    isValid(): boolean {
      return !!this.getValue() && (!this.getTokenExpDate() || new Date() < this.getTokenExpDate());
    }

    /**
   * Returns the token value
   * @returns string
   */
    getValue(): string {
        return this.token;
    }

    /**
     * Validate value and convert to string, if value is not valid return empty string
     * @returns {string}
     */
    toString(): string {
        return !!this.token ? this.token : '';
    }
  }