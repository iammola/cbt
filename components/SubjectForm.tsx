import { NextPage } from "next";
import { FormEvent, useState } from "react";

const SubjectForm: NextPage = () => {
    const [name, setName] = useState('');
    const [alias, setAlias] = useState('');
    const [loading, setLoading] = useState(false);
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        try {
        } catch (error) {
            console.log({ error });
        }

        setLoading(false);
    }

    return (
        <>
            <form
                className="flex flex-col gap-7 rounded-3xl shadow-lg p-8 bg-white"
            >
                <h1 className="text-4xl text-gray-800 font-bold tracking-tight text-center pb-4">
                    <span>Create a</span>{' '}
                    <span className="text-blue-500">Subject</span>
                </h1>
                <div className="flex flex-col gap-2.5 w-80">
                    <label
                        htmlFor="name"
                        className="text-sm text-gray-600 font-semibold"
                    >
                        Name
                    </label>
                    <input
                        required
                        id="name"
                        type="text"
                        value={name}
                        onChange={({ target: { value } }) => setName(value)}
                        className="border rounded-md transition-shadow focus:ring-2 focus:ring-blue-400 focus:outline-none p-3 pl-5"
                    />
                </div>
                <div className="flex flex-col gap-2.5 w-80">
                    <label
                        htmlFor="alias"
                        className="text-sm text-gray-600 font-semibold"
                    >
                        Alias
                    </label>
                    <input
                        required
                        id="alias"
                        type="text"
                        value={alias}
                        onChange={({ target: { value } }) => setAlias(value)}
                        className="border rounded-md transition-shadow focus:ring-2 focus:ring-blue-400 focus:outline-none p-3 pl-5"
                    />
                </div>
                <button
                    type="submit"
                >
                    Create Subject
                </button>
            </form>
        </>
    );
}

export default SubjectForm;
