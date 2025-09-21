import { ElementRef, ElementType, forwardRef, useMemo } from "react";
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
import WasabiPopover from "../../wasabi/WasabiPopover";
import FilterTrigger from "../common/FilterTrigger";

export type CommandOption = {
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  count?: number;
};

export type CommandGroupType = {
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  label?: string;
  options: CommandOption[];
};

interface WasabiSelectPropsMulti {
  mode: "multi";
  selectedValues: string[];
  onChange: (updatedValues: string[]) => void;
}

interface WasabiSelectPropsTransient {
  mode: "transient";
  onChange: (updatedValue: string) => void;
}

interface WasabiSelectPropsSingle {
  mode: "single";
  selectedValue: string;
  onChange: (updatedValue: string) => void;
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
  shouldClear?: boolean;
  allLabel?: string;
  trigger?: (selected: CommandOption | undefined) => React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const WasabiSelect = forwardRef<ElementRef<typeof WasabiPopover>, WasabiSelectProps>(
  (props, ref) => {
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
      shouldClear = true,
      trigger,
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
      const updatedValues = current.includes(option.value)
        ? current.filter((v) => v !== option.value)
        : [...current, option.value];

      props.onChange(updatedValues);
    };

    const handleReset = () => {
      if (mode === "single" || mode === "transient") {
        props.onChange("");
      } else {
        props.onChange([]);
      }
    };

    const selectedLabels =
      mode === "multi" && props.allLabel && normalizedSelection.length === allOptions.length
        ? [{ label: props.allLabel, value: "ALL" }]
        : allOptions.filter((o) => normalizedSelection.includes(o.value));

    return (
      <WasabiPopover
        ref={ref}
        open={props.open}
        onOpenChange={props.onOpenChange}
        contentClassName={`p-0 ${contentClassName || ""}`}
        trigger={
          trigger ? (
            trigger(selectedLabels[0] ?? undefined)
          ) : (
            <FilterTrigger
              onClear={mode == "transient" ? undefined : shouldClear ? handleReset : undefined}
              disabled={disabled}
              triggerIcon={triggerIcon}
              title={title}
              values={selectedLabels.map((o) => o.label)}
              className={triggerClassName}
            />
          )
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
                <CommandGroup
                  heading={
                    <div className="flex gap-2 items-center">
                      {group.icon && <group.icon className="h-4 w-4" />} {group.label}
                    </div>
                  }
                >
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
);

WasabiSelect.displayName = "WasabiSelect";

export default WasabiSelect;
