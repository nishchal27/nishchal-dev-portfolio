"use client";

import { TradeoffOption } from "@/data/tradeoffs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ComparisonTableProps {
  options: TradeoffOption[];
}

const scalingLabels = {
  excellent: "Excellent",
  good: "Good",
  fair: "Fair",
  poor: "Poor",
};

export function ComparisonTable({ options }: ComparisonTableProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {options.map((option) => (
        <Card key={option.name}>
          <CardHeader>
            <CardTitle>{option.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold mb-2 text-text-primary">
                Pros
              </h4>
              <ul className="space-y-1">
                {option.pros.map((pro, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-text-secondary flex items-start gap-2"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2 text-text-primary">
                Cons
              </h4>
              <ul className="space-y-1">
                {option.cons.map((con, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-text-secondary flex items-start gap-2"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2 text-text-primary">
                Best For
              </h4>
              <ul className="space-y-1">
                {option.bestFor.map((useCase, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-text-secondary flex items-start gap-2"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                    {useCase}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2 text-text-primary">
                Worst For
              </h4>
              <ul className="space-y-1">
                {option.worstFor.map((useCase, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-text-secondary flex items-start gap-2"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                    {useCase}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2 text-text-primary">
                Scaling Characteristics
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Reads:</span>
                  <span className="text-text-primary">
                    {scalingLabels[option.scaling.reads]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Writes:</span>
                  <span className="text-text-primary">
                    {scalingLabels[option.scaling.writes]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Horizontal:</span>
                  <span className="text-text-primary">
                    {scalingLabels[option.scaling.horizontal]}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
