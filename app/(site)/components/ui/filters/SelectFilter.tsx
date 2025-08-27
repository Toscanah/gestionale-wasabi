import { ElementType, useMemo } from "react";
import { Fragment } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Circle } from "@phosphor-icons/react"; // Circle for single mode indicator
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import WasabiPopover from "../popover/WasabiPopover";
import FilterTrigger from "./common/FilterTrigger";

type CommandOption = {
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  count?: number;
};

type CommandGroupType = {
  label?: string;
  options: CommandOption[];
};

interface WasabiSelectPropsMulti {
  mode: "multi";
  selectedValues: string[];
  onChange: (next: string[]) => void;
}

interface WasabiSelectPropsTransient {
  mode: "transient";
  onChange: (next: string | null) => void;
}

interface WasabiSelectPropsSingle {
  mode: "single";
  selectedValue: string | null;
  onChange: (next: string | null) => void;
}

type WasabiSelectProps = (
  | WasabiSelectPropsSingle
  | WasabiSelectPropsMulti
  | WasabiSelectPropsTransient
) & {
  title: string;
  groups: CommandGroupType[];
  inputPlaceholder?: string;
  showInput?: boolean;
  contentClassName?: string;
  triggerClassName?: string;
  triggerIcon?: ElementType;
  disabled?: boolean;
};

export default function SelectFilter(props: WasabiSelectProps) {
  const {
    mode,
    groups,
    title,
    contentClassName,
    inputPlaceholder,
    triggerClassName,
    showInput = true,
    triggerIcon,
    disabled,
  } = props;

  const normalizedSelection = (
    mode === "multi" ? props.selectedValues : mode === "single" ? [props.selectedValue] : []
  ).filter(Boolean);

  const allOptions = useMemo(() => groups.flatMap((g) => g.options), [groups]);

  const handleOptionSelect = (option: CommandOption) => {
    if (mode === "single" || mode === "transient") {
      props.onChange(option.value);
      return;
    }

    const current = props.selectedValues;
    const next = current.includes(option.value)
      ? current.filter((v) => v !== option.value)
      : [...current, option.value];

    props.onChange(next);
  };

  const handleReset = () => {
    if (mode === "single" || mode === "transient") {
      props.onChange(null);
    } else {
      props.onChange([]);
    }
  };

  const selectedLabels = allOptions.filter((o) => normalizedSelection.includes(o.value));

  return (
    <WasabiPopover
      contentClassName={`p-0 ${contentClassName || ""}`}
      trigger={
        <FilterTrigger
          onClear={handleReset}
          disabled={disabled}
          triggerIcon={triggerIcon}
          title={title}
          labels={selectedLabels.map((o) => o.label)}
          className={triggerClassName}
        />
      }
    >
      <Command>
        {showInput && (
          <CommandInput className="h-10" placeholder={inputPlaceholder || "Cerca..."} />
        )}
        <CommandList>
          <CommandEmpty>Nessun risultato trovato.</CommandEmpty>

          {groups.map((group, groupIdx) => (
            <Fragment key={groupIdx}>
              <CommandGroup heading={group.label}>
                {group.options.map((option, optionIdx) => {
                  const isSelected = normalizedSelection.includes(option.value);
                  return (
                    <CommandItem
                      key={optionIdx}
                      onSelect={() => handleOptionSelect(option)}
                      className="w-full flex gap-2 items-center"
                    >
                      {mode === "multi" ? (
                        <Checkbox checked={isSelected} />
                      ) : mode === "single" ? (
                        <Circle weight={isSelected ? "fill" : "regular"} />
                      ) : (
                        <></>
                      )}
                      {option.icon && <option.icon />}
                      {option.label}
                      {option.count && <span className="ml-auto font-mono">{option.count}</span>}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {groupIdx < groups.length - 1 && <CommandSeparator />}
            </Fragment>
          ))}
        </CommandList>
      </Command>
    </WasabiPopover>
  );
}
