"use client";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { useMemo, useState } from "react";
import { DateRangePicker } from "react-date-range";
import {
  endOfDay,
  endOfMonth,
  format,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";

type Props = {
  onApply: (range: { startDate: Date; endDate: Date }) => void;
};

type RangeItem = {
  startDate: Date;
  endDate: Date;
  key: string;
};

export default function DateRangeFilter({ onApply }: Props) {
  const [open, setOpen] = useState(false);

  const [ranges, setRanges] = useState<RangeItem[]>([
    {
      startDate: subDays(new Date(), 29),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const currentRange = ranges[0];

  const buttonLabel = useMemo(() => {
    return `${format(currentRange.startDate, "M/d/yyyy")} - ${format(
      currentRange.endDate,
      "M/d/yyyy"
    )}`;
  }, [currentRange]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm"
      >
        {buttonLabel}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-[760px] max-w-[calc(100vw-40px)] rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="max-h-[70vh] overflow-auto p-2">
            <DateRangePicker
              onChange={(item: any) => setRanges([item.selection])}
              moveRangeOnFirstSelection={false}
              months={1}
              direction="horizontal"
              ranges={ranges}
              staticRanges={[
                {
                  label: "Today",
                  range: () => ({
                    startDate: startOfDay(new Date()),
                    endDate: endOfDay(new Date()),
                  }),
                  isSelected(range: any) {
                    const defined = this.range();
                    return (
                      range.startDate?.toDateString() ===
                        defined.startDate.toDateString() &&
                      range.endDate?.toDateString() ===
                        defined.endDate.toDateString()
                    );
                  },
                },
                {
                  label: "Yesterday",
                  range: () => ({
                    startDate: startOfDay(subDays(new Date(), 1)),
                    endDate: endOfDay(subDays(new Date(), 1)),
                  }),
                  isSelected(range: any) {
                    const defined = this.range();
                    return (
                      range.startDate?.toDateString() ===
                        defined.startDate.toDateString() &&
                      range.endDate?.toDateString() ===
                        defined.endDate.toDateString()
                    );
                  },
                },
                {
                  label: "Last 7 Days",
                  range: () => ({
                    startDate: startOfDay(subDays(new Date(), 6)),
                    endDate: endOfDay(new Date()),
                  }),
                  isSelected(range: any) {
                    const defined = this.range();
                    return (
                      range.startDate?.toDateString() ===
                        defined.startDate.toDateString() &&
                      range.endDate?.toDateString() ===
                        defined.endDate.toDateString()
                    );
                  },
                },
                {
                  label: "Last 30 Days",
                  range: () => ({
                    startDate: startOfDay(subDays(new Date(), 29)),
                    endDate: endOfDay(new Date()),
                  }),
                  isSelected(range: any) {
                    const defined = this.range();
                    return (
                      range.startDate?.toDateString() ===
                        defined.startDate.toDateString() &&
                      range.endDate?.toDateString() ===
                        defined.endDate.toDateString()
                    );
                  },
                },
                {
                  label: "This Month",
                  range: () => ({
                    startDate: startOfMonth(new Date()),
                    endDate: endOfMonth(new Date()),
                  }),
                  isSelected(range: any) {
                    const defined = this.range();
                    return (
                      range.startDate?.toDateString() ===
                        defined.startDate.toDateString() &&
                      range.endDate?.toDateString() ===
                        defined.endDate.toDateString()
                    );
                  },
                },
                {
                  label: "Last Month",
                  range: () => {
                    const lastMonth = subMonths(new Date(), 1);
                    return {
                      startDate: startOfMonth(lastMonth),
                      endDate: endOfMonth(lastMonth),
                    };
                  },
                  isSelected(range: any) {
                    const defined = this.range();
                    return (
                      range.startDate?.toDateString() ===
                        defined.startDate.toDateString() &&
                      range.endDate?.toDateString() ===
                        defined.endDate.toDateString()
                    );
                  },
                },
              ]}
              inputRanges={[]}
              editableDateInputs
            />
          </div>

          <div className="grid grid-cols-2 gap-2 border-t border-slate-200 bg-white p-3">
            <button
              onClick={() => setOpen(false)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              Cancel
            </button>

            <button
  onClick={() => {
    onApply({
      startDate: currentRange.startDate,
      endDate: currentRange.endDate,
    });
    setOpen(false);
  }}
  className="w-full rounded-lg border border-emerald-700 px-3 py-2 text-sm font-semibold"
  style={{ backgroundColor: "#16a34a", color: "#ffffff" }}
>
  Apply
</button>
          </div>
        </div>
      )}
    </div>
  );
}