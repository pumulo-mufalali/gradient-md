import { DrugChecker } from "../_components/drug-checker";

export default function InteractionsPage() {
  return (
    <div className="container-custom py-16">
      <div className="mb-20 text-center">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">Drug Interaction Checker</h1>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[var(--color-muted)]">
          Check for potential interactions between your medications using
          NIH/FDA data.
        </p>
      </div>
      <DrugChecker />
    </div>
  );
}
