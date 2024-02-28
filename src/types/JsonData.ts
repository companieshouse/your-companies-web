type JSONValue =
    | string
    | number
    | boolean
    | JSONObject
    | JSONArray;

type JSONArray = Array<JSONValue>

export interface JSONObject {
    [x: string]: JSONValue;
}
