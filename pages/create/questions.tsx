import { NextPage } from "next";



const CreateQuestions: NextPage = () => {
    return (
        <section className="flex flex-col items-center justify-center gap-2 w-screen">
            <div className="flex items-center justify-start gap-2 text-gray-400 pt-7 pb-2 px-10 w-full text-sm font-medium">
                <span>2021/2022 Third Term</span>
                <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                <span>Key Stage 1</span>
                <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                <span>Civic Education</span>
                <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">Questions</span>
            </div>
        </section>
    );
}

export default CreateQuestions;
