import { Option } from "../../types/Option";

export default function formatOptionsString(maxChar: number, options: Option[]) {
  return options
    .map(
      ({ option }) =>
        option.option_name.charAt(0).toUpperCase() +
        option.option_name.slice(1, Math.min(option.option_name.length, maxChar))
    )
    .join(", ");
}
