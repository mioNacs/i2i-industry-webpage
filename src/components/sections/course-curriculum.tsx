import { Module } from "@/lib/contentful/types/courses";
import { HiChevronDown, HiDocumentText } from "react-icons/hi";
import SectionHeader from "@/components/ui/section-header";

export default function CourseCurriculum({ modules }: { modules: Module[] }) {
    const mergedData = combineWeeklyToMonthly(modules)
    const totalTopics = modules.map(e => e.data.length).reduce((c, p) => c + p, 0);

    return (
        <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-12">
            <div className="flex flex-col md:flex-row items-end justify-between gap-4 mb-4">
                <SectionHeader 
                    title="Curriculum"
                    className="mb-[-12]"
                    align="left"
                />
                <span className='lowercase text-gray-600 text-sm font-medium pb-4 tracking-wide'>
                    <span className="font-bold text-primary">{totalTopics}</span> teaching points included in this program.
                </span>
            </div>
            
            <div className='w-full flex flex-col gap-4 font-sans'>
                {
                    mergedData.map((e, i) =>
                        <div key={i} className="collapse collapse-arrow bg-white border-2 border-black hover:border-gray-100 rounded-xl hover:shadow-md transition-all duration-300 group">
                            <input type="checkbox" className="peer" defaultChecked={i === 0} />
                            <div className="collapse-title flex items-center gap-4 py-4 pr-12 group-hover:text-primary transition-colors">
                                <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                                    {i + 1}
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 flex-1">
                                    <span className='font-bold text-lg text-gray-800 group-hover:text-primary transition-colors'>Module {i + 1}</span>
                                    <span className='hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-gray-300'></span>
                                    <span className='text-sm font-medium text-gray-500'>{e.data.length} Topics</span>
                                </div>
                            </div>
                            <div className="collapse-content bg-gray-50/50 peer-checked:bg-white transition-colors">
                                <ul className='grid grid-cols-1 md:grid-cols-2 gap-3 py-4 px-2 md:px-4'>
                                    {
                                        e.data.map((data, idx) =>
                                            <li key={`${e.name} - ${idx}`} className='flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700'>
                                                <HiDocumentText className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                                                <span>{data}</span>
                                            </li>
                                        )
                                    }
                                </ul>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

function combineWeeklyToMonthly(modules: Module[]): Module[] {
    if (!modules || modules.length < 4) {
        return modules;
    }

    const dataPoints = modules.map(e => e.data).flat()
    const chunkSize = 8;
    const totalLength = dataPoints.length;
    const numCompleteChunks = Math.floor(totalLength / chunkSize);

    const newModules: Module[] = [];

    for (let i = 0; i < numCompleteChunks; i++) {
        const startIndex = i * chunkSize;
        newModules.push({
            name: i < modules.length ? modules[i].name : `Module ${i + 1}`,
            data: dataPoints.slice(startIndex, startIndex + chunkSize)
        });
    }

    const remainingStart = numCompleteChunks * chunkSize;
    if (remainingStart < totalLength) {
        newModules.push({
            name: numCompleteChunks < modules.length ? modules[numCompleteChunks].name : `Module ${numCompleteChunks + 1}`,
            data: dataPoints.slice(remainingStart)
        });
    }

    return newModules;
}
