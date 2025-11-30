import { Todos } from "./todos";

export default async function Page() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-2 pb-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200 mb-4">
          <span className="text-3xl">✓</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
          My Todos
        </h1>
        <p className="text-slate-500 text-lg">
          Stay organized, get things done
        </p>
      </div>

      {/* Todo List Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <Todos />
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-slate-400 pt-4">
        Your todos are saved automatically ✨
      </p>
    </div>
  );
}
