"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { addTodo } from "./actions";

export function Form() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleFormAction = async (formData: FormData) => {
    await addTodo(formData);
    formRef.current?.reset();
  };

  return (
    <form
      action={handleFormAction}
      className="flex items-center gap-4 bg-slate-50/50 px-5 py-4"
      ref={formRef}
    >
      {/* Plus Icon */}
      <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-dashed border-slate-300 text-slate-400">
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>

      {/* Input */}
      <input
        id="description"
        name="description"
        placeholder="Add a new todo..."
        className="flex-1 bg-transparent text-base text-slate-700 transition-colors outline-none placeholder:text-slate-400 focus:placeholder:text-slate-300"
        required
        aria-label="Description of todo"
        type="text"
        autoFocus
      />

      {/* Submit Button */}
      <SubmitButton />
    </form>
  );
}

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-indigo-200 transition-all duration-150 hover:from-indigo-600 hover:to-purple-700 hover:shadow-lg hover:shadow-indigo-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? (
        <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        "Add"
      )}
    </button>
  );
}
