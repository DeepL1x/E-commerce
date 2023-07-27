type ObjectType = {
  [key: string]: any
}

function isObject(obj: any): boolean {
  return obj !== null && typeof obj === "object" && !Array.isArray(obj)
}

function getModifiedFields(
  original: ObjectType,
  changed: ObjectType
): ObjectType {
  const modifiedFields: ObjectType = {}

  for (const key in changed) {
    if (changed.hasOwnProperty(key)) {
      if (isObject(changed[key]) && isObject(original[key])) {
        const nestedModified = getModifiedFields(original[key], changed[key])
        if (Object.keys(nestedModified).length > 0) {
          modifiedFields[key] = nestedModified
        }
      } else if (original[key] !== changed[key]) {
        modifiedFields[key] = changed[key]
      }
    }
  }

  return modifiedFields
}

export default getModifiedFields