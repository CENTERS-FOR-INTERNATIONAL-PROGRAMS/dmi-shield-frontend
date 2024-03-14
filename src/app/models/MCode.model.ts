import ts from "typescript";
import { KeyValue } from "./KeyValue.model";

export interface IMCode {
  mcode_raw: string;
  mcode_seeded: string;
  mcode_result: any;
  mcode_default: any;
  mcode_error_default: any;
  mcode_parent: any;
  mcode_params: any;
  mcode_fields: string[];
}

export class MCode {
  IMCodeInstance: IMCode = {
    mcode_raw: "",
    mcode_seeded: "",
    mcode_result: null,
    mcode_default: null,
    mcode_error_default: null,
    mcode_parent: null,
    mcode_params: null,
    mcode_fields: []
  };

  constructor(IMCodeNew: IMCode) {
    this.IMCodeInstance = IMCodeNew;
    this.seedInstance();
  }

  private seedInstance() {
    if (this.IMCodeInstance.mcode_raw != null) {
      const mfield_match_rejex = /{(.*?)}/;
      this.IMCodeInstance.mcode_seeded = this.IMCodeInstance.mcode_raw;

      let mcode_match: any = null;

      do {
        mcode_match = this.IMCodeInstance.mcode_raw.match(mfield_match_rejex);

        if (mcode_match != null) {
          this.IMCodeInstance.mcode_raw = this.IMCodeInstance.mcode_raw.replace(mcode_match[0], "~");
          this.IMCodeInstance.mcode_fields.push(mcode_match[1]);
        }
      } while (mcode_match != null);

      if (this.IMCodeInstance.mcode_fields.length > 0) {
        this.IMCodeInstance.mcode_fields.forEach((mcode_field: string) => {
          this.IMCodeInstance.mcode_seeded = this.IMCodeInstance.mcode_seeded.replace('{' + mcode_field + '}', this.IMCodeInstance.mcode_parent + "['" + mcode_field + "']");
        });
      }

      this.IMCodeInstance.mcode_result = this.IMCodeInstance.mcode_error_default;
    } else {
      this.IMCodeInstance.mcode_result = this.IMCodeInstance.mcode_default;
    }
  }

  evaluateInstance(meval_type: string, meval_params: any): Promise<any> {
    if (this.IMCodeInstance.mcode_seeded != "") {
      let field_logic_code: string = `({
        evaluateBoolean: (`+ this.IMCodeInstance.mcode_params + `): string => {
            let mcode_result = false;

            if(`+ this.IMCodeInstance.mcode_seeded + `) {
              mcode_result = true;
            }

            return Promise.resolve(mcode_result); 
          },
          
          evaluateString: (`+ this.IMCodeInstance.mcode_params + `): string => {
            let mcode_result = `+ this.IMCodeInstance.mcode_seeded + `;
            return Promise.resolve(mcode_result); 
          }
        })`;
      try {
        eval(ts.transpile(field_logic_code))[meval_type](meval_params).then((logic_result: boolean) => {
          if (this.IMCodeInstance.mcode_result !== logic_result) {
            this.IMCodeInstance.mcode_result = logic_result;
          }

          return Promise.resolve(true);
        });
      } catch (err: any) {
        // TODO! Handle errors
        this.IMCodeInstance.mcode_result = this.IMCodeInstance.mcode_error_default;
      }
    }

    return Promise.resolve(false);
  }
}