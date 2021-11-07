import { FunctionComponent } from "react";


import type { AnswerProps } from "types";

    return (
        <>
            <label
                htmlFor={id}
            <input
                required
                type="text"
                value={answer}
                onChange={({ target: { value } }) => handleChange({ answer: value })}
            />
            <span
                onClick={deleteOption}
                className="group relative p-2 rounded-full cursor-pointer text-gray-700 hover:text-gray-600 hover:bg-gray-200"
            >
                <XIcon className="w-5 h-5" />
                <span className="hidden group-hover:inline absolute left-1/2 -top-10 -translate-x-1/2 p-2 rounded-md shadow-md text-xs text-gray-600 bg-white w-max">
                    Delete Option
                </span>
            </span>
        </>
    );
}

export default Answer;
