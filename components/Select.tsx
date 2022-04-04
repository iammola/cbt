import { FunctionComponent, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { SelectorIcon, CheckIcon } from "@heroicons/react/outline";

import { classNames } from "utils";

import type { SelectProps } from "types";

const Select: FunctionComponent<SelectProps> = ({
  label,
  colorPallette,
  options,
  selected,
  className,
  handleChange,
}) => {
  const pallette = colorPallette ?? {
    activeCheckIconColor: "stroke-amber-600",
    inactiveCheckIconColor: "stroke-amber-800",
    activeOptionColor: "text-amber-900 bg-amber-100",
    buttonBorderColor: "focus-visible:border-indigo-500",
    buttonOffsetFocusColor: "focus-visible:ring-offset-yellow-500",
  };

  return (
    <div className={classNames("relative flex w-full min-w-0 flex-col sm:min-w-[13rem] lg:min-w-[20rem]", className)}>
      <Listbox
        value={selected}
        onChange={handleChange}
      >
        {label !== undefined && <Listbox.Label className="text-sm font-semibold text-gray-700">{label}</Listbox.Label>}
        <Listbox.Button
          className={classNames(
            "relative mt-2 w-full cursor-pointer rounded-lg border bg-white py-3.5 pl-3 pr-10 text-left text-xs shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 sm:text-sm",
            pallette.buttonOffsetFocusColor,
            pallette.buttonBorderColor
          )}
        >
          <span className="block truncate">{selected.name}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <SelectorIcon
              className="h-5 w-5 stroke-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        {options !== undefined && (
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((option) => (
                <Listbox.Option
                  value={option}
                  key={option._id}
                  className={({ active, selected }) =>
                    classNames("relative cursor-default select-none py-2 pr-4", {
                      [pallette.activeOptionColor]: active,
                      "text-gray-900": !active,
                      "pl-4 md:pl-7 lg:pl-10": !selected,
                      "pl-10": selected,
                    })
                  }
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={classNames("block truncate", {
                          "font-medium": selected,
                          "font-normal": !selected,
                        })}
                      >
                        {option.name}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <CheckIcon
                            aria-hidden="true"
                            className={classNames("h-5 w-5", {
                              [pallette.activeCheckIconColor]: active,
                              [pallette.inactiveCheckIconColor]: !active,
                            })}
                          />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        )}
      </Listbox>
    </div>
  );
};

export default Select;
