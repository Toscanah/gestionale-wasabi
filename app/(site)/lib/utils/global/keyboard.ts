export function isEnter(e: React.KeyboardEvent<HTMLInputElement>) {
  return e.key === "Enter";
}

export function isArrowUp(e: React.KeyboardEvent<HTMLInputElement>) {
  return e.key === "ArrowUp";
}

export function isArrowDown(e: React.KeyboardEvent<HTMLInputElement>) {
  return e.key === "ArrowDown";
}

export function isArrowLeft(e: React.KeyboardEvent<HTMLInputElement>) {
  return e.key === "ArrowLeft";
}

export function isArrowRight(e: React.KeyboardEvent<HTMLInputElement>) {
  return e.key === "ArrowRight";
}

export function isArrows(e: React.KeyboardEvent<HTMLInputElement>) {
  return isArrowUp(e) || isArrowDown(e) || isArrowLeft(e) || isArrowRight(e);
}

export function isArrowsNotSubmit(e: React.KeyboardEvent<HTMLInputElement>) {
  return isArrowUp(e) || isArrowDown(e) || isArrowLeft(e);
}

export function isSubmit(e: React.KeyboardEvent<HTMLInputElement>) {
  return isEnter(e) || isArrowRight(e);
}
