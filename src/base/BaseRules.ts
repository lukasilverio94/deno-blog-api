import requestCheck from 'npm:request-check';
import { throwlhos } from "../globals/Throwlhos.ts";
import { IThrowlhos } from 'npm:throwlhos';
import is from '@zarco/isness';

export type Validator = (...args: ICheckObj[]) => void

export interface ICheckObj {
  // deno-lint-ignore no-explicit-any
  [key: string]: any
  isRequiredField?: boolean
}

export interface IInvalidField {
  // deno-lint-ignore no-explicit-any
  value: any
  // deno-lint-ignore no-explicit-any
  field: any
  message: string
}


export class BaseRules {
    protected rc;

    constructor() {
        this.rc = requestCheck.default();
        this.rc.setRequiredMessage("Field is required");

        this.rc.addRule('pagination', {
                validator: (value: any) => typeof value === 'object' && is.number(value.page) && is.number(value.limit),
                  message: 'Invalid pagination value! It must be an object with the properties "page" and "limit".',
              
     });
    }

    validate = (...args: ICheckObj[]): void => {
        try {
            const arrayOfInvalid = this.rc.check(...args);
            if (arrayOfInvalid?.length) {
                const joinedFieldNames = arrayOfInvalid.map((e: IInvalidField) => e.field).join(', ');
                throw throwlhos.err_badRequest(
                    `Fields ${joinedFieldNames} invalids (${arrayOfInvalid.length})`,
                    arrayOfInvalid,
                    {
                        key: 'rules.baseRules.invalidFields',
                        options: {
                        joinedFieldNames,
                        length: arrayOfInvalid.length,
                        },
                    },
                )
            }            
        } catch (err: any) {
            console.warn(err); 
           throw {
                code: 422,
                message: err.message ?? err,
                status: err.status,
                errors: err.errors,
                i18n: err.i18n
            } as IThrowlhos    
        }
    } 
}