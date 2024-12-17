import { OptionOption } from "../../backend/categories/CategoryOptions";

export default function formatOptionsString(maxChar: number, options: OptionOption[]) {
  return options
    .map(
      ({ option }) =>
        option.option_name.charAt(0).toUpperCase() +
        option.option_name.slice(1, Math.min(option.option_name.length, maxChar))
    )
    .join(", ");
}
