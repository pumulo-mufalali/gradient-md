"use client";

import { useState } from "react";
import { useToast } from "../_components/toast";

interface Facility {
  name: string;
  address: string;
  phone: string;
  type: string;
  emergencyServices: boolean;
  rating: string | null;
}

export default function FacilitiesPage() {
  const [zipCode, setZipCode] = useState("");
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    const zip = zipCode.trim();
    if (!/^\d{5}$/.test(zip)) {
      toast("Please enter a valid 5-digit US ZIP code.", "warning");
      return;
    }

    setIsLoading(true);
    setSearched(false);

    try {
      const response = await fetch(`/api/facilities?zip=${zip}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Lookup failed");
      }

      setFacilities(data.facilities);
      setSearched(true);

      if (data.facilities.length === 0) {
        toast(
          "No facilities found for this ZIP code. Try a nearby area.",
          "info"
        );
      }
    } catch (error) {
      console.error("Facility search error:", error);
      toast("Unable to look up facilities. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-custom py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 px-3 py-1 text-xs font-medium text-[var(--color-primary)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            CMS Hospital Data
          </div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
            Find Nearby <span className="gradient-text">Facilities</span>
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-[var(--color-muted)] md:text-base">
            Search for hospitals and medical facilities near you using data from
            the Centers for Medicare & Medicaid Services.
          </p>
        </div>

        {/* Search */}
        <div className="glass-card mb-8 p-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <label htmlFor="zip-input" className="sr-only">
                ZIP Code
              </label>
              <input
                id="zip-input"
                type="text"
                inputMode="numeric"
                maxLength={5}
                value={zipCode}
                onChange={(e) =>
                  setZipCode(e.target.value.replace(/\D/g, "").slice(0, 5))
                }
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter US ZIP code (e.g., 10001)"
                className="w-full rounded-lg border border-[var(--color-card-border)] bg-[var(--color-background)] px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isLoading || zipCode.length !== 5}
              className="btn-primary text-sm"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Searching...
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  Search
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Emergency numbers */}
        <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800/30 dark:bg-red-900/10">
          <h2 className="mb-2 text-sm font-semibold text-red-800 dark:text-red-300">
            Emergency Contacts
          </h2>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              { label: "Emergency", number: "911" },
              { label: "Poison Control", number: "1-800-222-1222" },
              { label: "Suicide & Crisis", number: "988" },
            ].map((item) => (
              <div
                key={item.number}
                className="flex items-center gap-2 rounded-md bg-white/60 px-3 py-2 dark:bg-white/5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 text-red-600 dark:text-red-400"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-red-600 dark:text-red-400">
                    {item.label}
                  </p>
                  <a
                    href={`tel:${item.number}`}
                    className="text-sm font-semibold text-red-800 dark:text-red-300"
                  >
                    {item.number}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        {searched && facilities.length > 0 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold">
              {facilities.length} Facility{facilities.length !== 1 && "ies"}{" "}
              Found
            </h2>
            <div className="flex flex-col gap-3">
              {facilities.map((facility, i) => (
                <div key={i} className="glass-card p-5">
                  <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold">{facility.name}</h3>
                      <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                        {facility.type}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {facility.emergencyServices && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700 dark:bg-red-900/20 dark:text-red-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                          </svg>
                          ER
                        </span>
                      )}
                      {facility.rating && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-muted-bg)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-foreground)]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="1"
                            className="text-amber-500"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                          {facility.rating}/5
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="shrink-0"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>{facility.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="shrink-0 text-[var(--color-muted)]"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <a
                        href={`tel:${facility.phone}`}
                        className="text-[var(--color-primary)] hover:underline"
                      >
                        {facility.phone}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {searched && facilities.length === 0 && !isLoading && (
          <div className="glass-card flex flex-col items-center py-12 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-3 text-[var(--color-muted)]"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <h2 className="mb-1 text-base font-semibold">
              No Facilities Found
            </h2>
            <p className="text-sm text-[var(--color-muted)]">
              Try a different or nearby ZIP code.
            </p>
          </div>
        )}

        {/* Loading skeletons */}
        {isLoading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-5">
                <div className="mb-3 h-4 w-48 animate-pulse rounded bg-[var(--color-muted-bg)]" />
                <div className="mb-2 h-3 w-32 animate-pulse rounded bg-[var(--color-muted-bg)]" />
                <div className="h-3 w-64 animate-pulse rounded bg-[var(--color-muted-bg)]" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
