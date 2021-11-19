import { FunctionComponent, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { SelectorIcon, CheckIcon } from "@heroicons/react/outline";

import { classNames } from "utils";

import type { SelectProps } from "types";

const Select: FunctionComponent<SelectProps> = ({ label, colorPallette, options, selected, className, handleChange }) => {
    const pallette = colorPallette ?? {
        activeCheckIconColor: "fill-amber-600",
        inactiveCheckIconColor: "fill-amber-800",
        activeOptionColor: "text-amber-900 bg-amber-100",
        buttonBorderColor: "focus-visible:border-indigo-500",
        buttonOffsetFocusColor: "focus-visible:ring-offset-yellow-500"
    }

    return (
        <div className={classNames("flex flex-col min-w-[20rem] w-full relative", className)}>
            <Listbox value={selected} onChange={handleChange}>
                <div className="relative">
                    {label !== undefined && (
                        <Listbox.Label className="font-semibold text-sm text-gray-700">
                            {label}
                        </Listbox.Label>
                    )}
                    <Listbox.Button className={classNames("relative w-full mt-2 py-3.5 pl-3 pr-10 text-left sm:text-sm bg-white rounded-lg border shadow-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-2", pallette.buttonOffsetFocusColor, pallette.buttonBorderColor)}>
                        <span className="block truncate">{selected.name}</span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-400">
                            <SelectorIcon
                                className="w-5 h-5"
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
                            <Listbox.Options className="absolute z-20 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {options.map(option => (
                                    <Listbox.Option
                                        value={option}
                                        key={option._id}
                                        className={({ active }) => classNames("cursor-default select-none relative py-2 pl-10 pr-4", {
                                            [pallette.activeOptionColor]: active,
                                            "text-gray-900": !active
                                        })}
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
                                                {selected === true && (
                                                    <span
                                                        className="absolute inset-y-0 left-0 flex items-center pl-3"
                                                    >
                                                        <CheckIcon
                                                            aria-hidden="true"
                                                            className={classNames("w-5 h-5", {
                                                                [pallette.activeCheckIconColor]: active,
                                                                [pallette.inactiveCheckIconColor]: !active
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
                </div>
            </Listbox>
        </div>
    );
}

export default Select;
