import { FormStateInfo, FormStatus, SubmitResult, BaseFormData } from './utils';
import { Resource } from '../core/models/resource.model';

type Constructor<T> = new (...args: any[]) => T;

export class FormHandler<T extends BaseFormData | Resource> {
  
    public formSubmitted: boolean = false;
    public submitAttempted = false;
    public formState: FormStateInfo = {};

    public formData: T;

    

    constructor(dataType: (new (...args: any[]) => T), params?: any) {

      const instance = <T>(
        source: any,
        destinationConstructor: Constructor<T>): T => Object.assign(new destinationConstructor(), source);
      
      this.formData = instance(params ? params : {}, dataType); //new dataType(args);

      if (this.formData instanceof BaseFormData) {
        this.formData.setDefaults();
      }
    }

    /*
    // Utility function
    create<T>(type: (new () => T)): T {
      return new type();
    }
    */

    protected setFormState(newState: FormStateInfo) {
      this.formState = {...this.formState, ...newState };
    }
  
    protected clearFormState() {
      this.formState = {
        type: FormStatus.IDLE,
        message: ''
      };
    }

    submissionSuccess(result: SubmitResult) {
      this.formSubmitted = false;
      this.setFormState({type: FormStatus.SUCCESS, message: result.message});
      result.callback && result.callback();
    }
  
    submissionFail(errorMsg: string) {
      this.formSubmitted = false;
      this.setFormState({type: FormStatus.ERROR, message: errorMsg});
    }
    
    // should be overrided
    submitFunc(): void {}

    submit($event, form: any): void {
  
      $event.preventDefault();
      // $event.stopPropagation();
  
      this.submitAttempted = true;
  
      if (form.valid === false) {
        return;
      }
  
      this.formSubmitted = true;
      this.clearFormState();

      this.submitFunc();
    }
  }