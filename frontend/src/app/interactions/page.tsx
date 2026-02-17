import { DrugChecker } from "../_components/drug-checker";

export default function InteractionsPage() {
  return (
    <div className="container-custom py-12 md:py-16">
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
          Drug Interaction Checker
        </h1>
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-[var(--color-muted)] md:text-base">
          Check for potential interactions between your medications using
          NIH/FDA data.
        </p>
      </div>
      <DrugChecker />
    </div>
  );
}
