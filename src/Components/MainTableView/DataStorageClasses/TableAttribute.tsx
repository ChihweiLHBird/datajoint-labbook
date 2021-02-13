import TableAttributeType from '../enums/TableAttributeType';

/**
 * Parent class for table attributes, typically never used directly
 */
class TableAttribute {
    attributeName: string;
    attributeType: TableAttributeType;
    stringTypeAttributeLengthInfo?: number;
    enumOptions?: Array<string>;
    decimalNumDigits?: number;
    decimalNumDecimalDigits?: number;
  
    constructor(
      attributeName: string,
      attributeType: TableAttributeType,
      stringTypeAttributeLengthInfo?: number,
      enumOptions?: Array<string>,
      decimalNumDigits?: number,
      decimalNumDecimalDigits?: number
      ) {
      this.attributeName = attributeName;
      this.attributeType = attributeType;
      this.stringTypeAttributeLengthInfo = stringTypeAttributeLengthInfo;
      this.enumOptions = enumOptions;
      this.decimalNumDigits = decimalNumDigits;
      this.decimalNumDecimalDigits = decimalNumDecimalDigits
    }

    /**
     * Function to covert epoch time string back to datajoint time format
     * @param timeString 
     */
    static parseTimeString(timeString: string) {
      const timeNumber = parseInt(timeString)
      let date = new Date(timeNumber * 1000);
      return Math.floor(timeNumber / 86400) * 24 + date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds();
    }

    /**
     * Helper function for converting dateTime string back to string format for table view
     * @param dateTimeString 
     */
    static parseDateTime(dateTimeString: string) {
      let date = new Date(parseInt(dateTimeString) * 1000);
      return date.toUTCString();
    }

    /**
     * Helper function for converting date to Date String
     * @param dateTimeString 
     */
    static parseDate(dateTimeString: string) {
      let date = new Date(parseInt(dateTimeString) * 1000);
      return date.toDateString();
    }

    /**
     * Helper function for converting view purpose dateTime string back to datajoint dateTime YYYY-MM-DD HH:MM:SS
     */
    static parseDateTimeToDJ(UTCdateTimeString: string) {
      let djDateTime = new Date(UTCdateTimeString)?.toISOString()?.split('T').join(' ').split('.')[0]
      return djDateTime;
    }

    /**
     * Helper function for converting view purpose Date String back to datajoint date YYYY-MM-DD
     * @param viewDateString
     */
    static parseDateToDJ(viewDateString: string) {
      let djDate = new Date(viewDateString).toISOString().split('T')[0]
      return djDate;
    }

    /**
     * Helper function to handle the creation of input block based on the corresponding table attribute
     * @param tableAttribute TableAttribute object to be used for extracting type 
     * @param currentValue Current value of the input block
     * @param defaultValue Any default value for input blocks that support it
     * @param handleChange Call back function for when the user make a change to the input block
     */
    static getAttributeInputBlock(tableAttribute: TableAttribute, currentValue: any, defaultValue: string = '', handleChange: any) {
      let type: string = ''
      let typeString: string = ''
      let min: string = '0';
      let max: string = '0';
  
      // Determine type and any other attributes that need to be set based on that
      if (tableAttribute.attributeType === TableAttributeType.TINY) {
        type = 'number';
        typeString = 'tiny';
        min = '128';
        max = '-127';
      }
      else if (tableAttribute.attributeType === TableAttributeType.TINY_UNSIGNED) {
        type = 'number';
        typeString = 'tiny unsigned';
        min = '0';
        max = '255';
      }
      else if (tableAttribute.attributeType === TableAttributeType.SMALL) {
        type = 'number';
        typeString = 'small';
        min = '-32768';
        max = '32767';
      }
      else if (tableAttribute.attributeType === TableAttributeType.SMALL_UNSIGNED) {
        type = 'number';
        typeString = 'small unsigned';
        min = '0';
        max = '65535';
      }
      else if (tableAttribute.attributeType === TableAttributeType.MEDIUM) {
        type = 'number';
        typeString = 'medium';
        min = '-8388608';
        max = '8388607';
      }
      else if (tableAttribute.attributeType === TableAttributeType.MEDIUM_UNSIGNED) {
        type = 'number';
        typeString = 'medium unsigned';
        min = '0';
        max = '16777215';
      }
      else if (tableAttribute.attributeType === TableAttributeType.BIG) {
        type = 'number';
        typeString = 'big';
        min = '-9223372036854775808';
        max = '9223372036854775807';
      }
      else if (tableAttribute.attributeType === TableAttributeType.BIG_UNSIGNED) {
        type = 'number';
        typeString = 'big unsigned';
        min = '0';
        max = '18446744073709551615';
      }
      else if (tableAttribute.attributeType === TableAttributeType.INT) {
        type = 'number';
        typeString = 'tiny';
        min = '-2147483648';
        max = '2147483647';
      }
      else if (tableAttribute.attributeType === TableAttributeType.INT_UNSIGNED) {
        type = 'number';
        typeString = 'tiny';
        min = '0';
        max = '4294967295';
      }
      else if (tableAttribute.attributeType === TableAttributeType.FLOAT) {
        return(
          <div className="fieldUnit" key={JSON.stringify(tableAttribute)}>
            <input type='number' value={currentValue} defaultValue={defaultValue} id={tableAttribute.attributeName} onChange={handleChange.bind(this, tableAttribute.attributeName)}></input>
          </div>
        );
      }
      else if (tableAttribute.attributeType === TableAttributeType.FLOAT_UNSIGNED ) {
        return(
          <div className="fieldUnit" key={JSON.stringify(tableAttribute)}>
            <input type='number' value={currentValue} min='0' defaultValue={defaultValue} id={tableAttribute.attributeName} onChange={handleChange.bind(this, tableAttribute.attributeName)}></input>
          </div>
        );
      }
      else if (tableAttribute.attributeType === TableAttributeType.DECIMAL) {
        // Check that decimalNumdigits, and decimalNumDecimalDigits are not undefined
        if (tableAttribute.decimalNumDigits === undefined || tableAttribute.decimalNumDecimalDigits === undefined) {
          throw Error('Decimal attributes of decimalNumDigits or decimalNumDecimalDigits are undefined');
        }
  
        // Generate max number input for the given params
        let maxValueString: string = '';
        let stepValueString : string = '0.';
        // Deal with the leading numbers before the decimal point
        for (let i = 0; i < tableAttribute.decimalNumDigits - tableAttribute.decimalNumDecimalDigits; i++) {
          maxValueString += '9'
        }
        maxValueString += '.'
        
        for (let i = 0; i < tableAttribute.decimalNumDecimalDigits; i++) {
          maxValueString += '9'
        }
  
        for (let i = 0; i < tableAttribute.decimalNumDecimalDigits - 1; i++) {
          stepValueString += '0'
        }
        stepValueString += '1'
  
        return(
          <div className="fieldUnit" key={JSON.stringify(tableAttribute)}>
            <input type='number' value={currentValue} step={stepValueString} min={('-' + maxValueString)} max={maxValueString} defaultValue={defaultValue} id={tableAttribute.attributeName} onChange={handleChange.bind(this, tableAttribute.attributeName)}></input>
          </div>
        );
      }
      else if (tableAttribute.attributeType === TableAttributeType.BOOL) {
        if (defaultValue === '') {
          defaultValue = 'false'
        }
        return(
          <div className="fieldUnit" key={JSON.stringify(tableAttribute)}>
            <select defaultValue={defaultValue}>
              <option selected={!currentValue} value='false'></option>
              <option selected={currentValue} value='true'></option>
            </select>
          </div>
        );
      }
      else if (tableAttribute.attributeType === TableAttributeType.CHAR) {
        return (
          <div className="fieldUnit" key={JSON.stringify(tableAttribute)}>
            <input type='text' value={currentValue} defaultValue={defaultValue} id={tableAttribute.attributeName} onChange={handleChange.bind(this, tableAttribute.attributeName)}></input>
          </div>
        );
      }
      else if (tableAttribute.attributeType === TableAttributeType.VAR_CHAR) {
        return (
          <div className="fieldUnit" key={JSON.stringify(tableAttribute)}>
            <input type='text' value={currentValue} defaultValue={defaultValue} id={tableAttribute.attributeName} onChange={handleChange.bind(this, tableAttribute.attributeName)}></input>
          </div>
        );
      }
      else if (tableAttribute.attributeType === TableAttributeType.UUID) {
        return (
          <div className="fieldUnit" key={JSON.stringify(tableAttribute)}>
            <input type='text' value={currentValue} defaultValue={defaultValue} id={tableAttribute.attributeName} onChange={handleChange.bind(this, tableAttribute.attributeName)}></input>
          </div>
        );
      }
      else if (tableAttribute.attributeType === TableAttributeType.DATE) {
        return (
          <div className="fieldUnit" key={JSON.stringify(tableAttribute)}>
            <input type='date' defaultValue={defaultValue} id={tableAttribute.attributeName} onChange={handleChange.bind(this, tableAttribute.attributeName)}></input>
          </div>
        )
      }
      else if (tableAttribute.attributeType === TableAttributeType.DATETIME) {
        return (
          <div className="fieldUnit" key={JSON.stringify(tableAttribute)}>
            <div className="dateTimeFields">
              <input type='date' defaultValue={defaultValue} id={tableAttribute.attributeName + '__date'} onChange={handleChange.bind(this, tableAttribute.attributeName + '__date')}></input>
              <input type='time' step="1" defaultValue={defaultValue} id={tableAttribute.attributeName + '__time'} onChange={handleChange.bind(this, tableAttribute.attributeName + "__time")}></input>
            </div>
          </div>
        );
      }
      else if (tableAttribute.attributeType === TableAttributeType.TIME) {
        return (
          <div className="fieldUnit" key={JSON.stringify(tableAttribute)}>
            <input type='text' defaultValue={defaultValue} id={tableAttribute.attributeName} onChange={handleChange.bind(this, tableAttribute.attributeName)}></input>
          </div>
        );
      }
      else if (tableAttribute.attributeType === TableAttributeType.TIMESTAMP) {
        return (
          <div className="fieldUnit" key={JSON.stringify(tableAttribute)}>
            <div className="dateTimeFields">
              <input type='date' defaultValue={defaultValue} id={tableAttribute.attributeName + '__date'} onChange={handleChange.bind(this, tableAttribute.attributeName + '__date')}></input>
              <input type='time' step="1" defaultValue={defaultValue} id={tableAttribute.attributeName + '__time'} onChange={handleChange.bind(this, tableAttribute.attributeName + "__time")}></input>
            </div>
          </div>
        );
      }
      else if (tableAttribute.attributeType === TableAttributeType.ENUM) {
        return (
          <div className="fieldUnit" key={JSON.stringify(tableAttribute)}>
            <select onChange={handleChange.bind(this, tableAttribute.attributeName)}> {
              tableAttribute.enumOptions?.map((enumOptionString: string) => {
                return(<option selected={currentValue === enumOptionString} key={enumOptionString} value={enumOptionString}>{enumOptionString}</option>);
            })}
            </select>
          </div>
        )
      }
  
      // Handle number return types
      if (type === 'number') {
        return (
        <div className="fieldUnit" key={JSON.stringify(tableAttribute)}>
          <input value={currentValue} type={type} min={min} max={max} defaultValue={defaultValue} id={tableAttribute.attributeName} onChange={handleChange.bind(this, tableAttribute.attributeName)}></input>
        </div>
        )
      }
  
      throw Error('Unsupported Type found for attribute: ' + tableAttribute.attributeName);
    }
  }

export default TableAttribute;