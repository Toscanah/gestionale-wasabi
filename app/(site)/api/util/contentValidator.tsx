export default function contentValidator(fn: (...args: any[]) => any, content: any) {
  return true;

  return content.every((item: any, index: number) => {
    return validateType(item, fn.arguments[index]);
  });
}

function validateType(content: any, type: any): boolean {
  if (type === String) {
    return typeof content === "string";
  }

  if (type === Number) {
    return typeof content === "number";
  }

  if (type === Boolean) {
    return typeof content === "boolean";
  }

  if (type === Object) {
    return content !== null && typeof content === "object";
  }

  if (type === Array) {
    return Array.isArray(content);
  }

  if (Array.isArray(type)) {
    if (!Array.isArray(content)) return false;
    return content.every((item: any) => validateType(item, type[0]));
  }

  if (typeof type === "object" && type !== null) {
    return validateObject(content, type);
  }

  if (type.prototype) {
    return content instanceof type;
  }

  return content.constructor.name === type.name;
}

function validateObject(content: any, type: any): boolean {
  if (typeof content !== "object" || content === null) {
    return false;
  }

  for (const key of Object.keys(type)) {
    const expectedType = type[key];
    const actualValue = content[key];

    if (!validateType(actualValue, expectedType)) {
      return false;
    }
  }

  return true;
}
