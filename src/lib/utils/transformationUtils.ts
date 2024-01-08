const _ = require("lodash");

export const toCamelCase = (obj: any) => _.transform(obj, (acc: { [x: string]: any; }, value: any, key: any, target: any) => {
    const camelKey = _.isArray(target) ? key : _.camelCase(key);
    acc[camelKey] = _.isObject(value) ? toCamelCase(value) : value;
});
