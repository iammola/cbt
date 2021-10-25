import { NextPage } from "next";

const SubjectForm: NextPage = () => {
    return (
        <>
            <form
                className="flex flex-col gap-7 rounded-3xl shadow-lg p-8 bg-white"
            >
                <h1 className="text-4xl text-gray-800 font-bold tracking-tight text-center pb-4">
                    <span>Create a</span>{' '}
                    <span className="text-blue-500">Subject</span>
                </h1>
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
