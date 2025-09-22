import moment from 'moment';

export const SplitArrayToExcelLineWithNumber = (data: string[]) => {
  let result = '';
  data.forEach((element, index) => {
    result += `${index + 1}. ${element}\r\n`;
  });
  //remove last \r\n
  result = result.slice(0, -2);
  return result;
};



export const TrimObjectifExist = (obj: any): any => {
  if (typeof obj !== 'object') return obj;
  // trim each property if it is a string
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'string') obj[key] = obj[key].trim();
  });
  return obj;
}

export const TrimArrayObjectifExist = (arr: any[]): any => {
  if (!Array.isArray(arr)) return arr;
  // trim each property if it is a string
  arr.forEach((obj) => {
    if (Array.isArray(obj)) return TrimArrayObjectifExist(obj);
    if (typeof obj === 'object') {
      Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'string') obj[key] = obj[key].trim();
      });
    }
  });
  return arr;
}

export const isExistData = (data: any): boolean => {
  if (data === null || data === undefined || data === '' || data === 'undefined' || data === 'null') {
    return false;
  }
  return true;
}

export const ShowApiErrorMessage = (error: any): string => {
  let errorMessage = 'Validation error';
  if (error?.error?.messages) {
    if (Array.isArray(error.error.messages)) {
      errorMessage = error.error.messages.join('<br>');
    }
    else {
      errorMessage = error.error.messages;
    }
  }
  return errorMessage;
}

export const EmptyIfNull = (value: any): any => {
  if (value === null || value === undefined) {
    return '';
  }
  return value;
}

export const EmptyArrayIfNull = (value: any): any => {
  if (value === null || value === undefined) {
    return [];
  }
  return value;
}

export const ZeroIfNull = (value: any): any => {
  if (value === null || value === undefined) {
    return 0;
  }
  return value;
}

export const IsAnyValueNull = (value: any): boolean => {
  if (!Array.isArray(value)) return false;
  let isNull = false;
  value.forEach((element) => {
    if (element === null || element === undefined) {
      isNull = true;
    }
  });
  return isNull;
}

export const LowerCaseString = (value: string | null): string | null => {
  if (!value) return null;
  return value.toLowerCase();
}

export const DateFormatIfValue = (value: any, format: string): any => {
  if (!value) return '';
  return moment(value).format(format);
}

export const IfTrueValueReturn = (value: any, trueValue: any, falseValue: any): any => {
  if (value) return trueValue;
  return falseValue;
}

