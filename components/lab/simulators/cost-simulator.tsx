"use client";

import { useState, useMemo, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { debounce } from "@/lib/rate-limit";

interface SimulatorInput {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}

function SimulatorInput({ label, value, min, max, step, unit, onChange }: SimulatorInput) {
  const [localValue, setLocalValue] = useState(value);
  const debouncedOnChange = useMemo(() => debounce(onChange, 300), [onChange]);

  // Sync local value with prop value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (newValue: number) => {
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <label className="text-text-primary font-medium">{label}</label>
        <span className="text-text-secondary font-mono">
          {localValue.toLocaleString()} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={localValue}
        onChange={(e) => {
          handleChange(Number(e.target.value));
        }}
        className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-accent"
      />
      <div className="flex justify-between text-xs text-text-secondary">
        <span>{min.toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  );
}

interface CostBreakdown {
  component: string;
  cost: number;
  percentage: number;
}

interface CostSimulatorProps {
  title: string;
  description: string;
  inputs: Array<{
    key: string;
    label: string;
    initialValue: number;
    min: number;
    max: number;
    step: number;
    unit: string;
  }>;
  calculate: (values: Record<string, number>) => {
    total: number;
    breakdown: CostBreakdown[];
    chartData: Array<Record<string, number | string>>;
  };
}

export function CostSimulator({ title, description, inputs, calculate }: CostSimulatorProps) {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(inputs.map((input) => [input.key, input.initialValue]))
  );

  const results = useMemo(() => calculate(values), [values, calculate]);

  const updateValue = (key: string, value: number) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-text-secondary">{description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Parameters</CardTitle>
          <CardDescription>Adjust the sliders to see how costs change</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {inputs.map((input) => (
            <SimulatorInput
              key={input.key}
              label={input.label}
              value={values[input.key]}
              min={input.min}
              max={input.max}
              step={input.step}
              unit={input.unit}
              onChange={(value) => updateValue(input.key, value)}
            />
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-accent mb-2">
              ${results.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-text-secondary">
              Estimated monthly cost based on current parameters
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.breakdown.map((item) => (
                <div key={item.component} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-primary">{item.component}</span>
                    <span className="text-text-secondary font-mono">
                      ${item.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="w-full bg-surface rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cost Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={results.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
              <XAxis dataKey="label" stroke="rgb(var(--text-secondary))" />
              <YAxis stroke="rgb(var(--text-secondary))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgb(var(--surface))",
                  border: "1px solid rgb(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="cost"
                stroke="rgb(var(--accent))"
                strokeWidth={2}
                name="Monthly Cost"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
