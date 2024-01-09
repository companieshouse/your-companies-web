const _ = require("lodash");

export const toCamelCase = (obj: any) => _.transform(obj, (acc: { [x: string]: any; }, value: any, key: any, target: any) => {
    const camelCaseKey = _.isArray(target) ? key : _.camelCase(key);
    acc[camelCaseKey] = _.isObject(value) ? toCamelCase(value) : value;
});
