import { guideContent } from "../utils/guideContent.ts";
export default function Guide() {
  return (
    <div className="h-full">
      <div className="flex items-center gap-2 bg-[#eff3f8] px-[10.5rem] py-2 h-20 justify-between">
        <h1 className="text-3xl font-normal text-slate-600">Guide</h1>
        <p>
          <a href="/">Home</a> / Guide
        </p>
      </div>
      <div className="px-[10.5rem] py-10">
        <div
          className="prose lg:prose-xl justify"
          dangerouslySetInnerHTML={{ __html: guideContent }}
        />
      </div>
    </div>
  );
}
