
export const MISSING_VALUE = "missing-value";

export function isBlank(value: String) : Boolean {
    return value === null || value === undefined || value === "";
}
