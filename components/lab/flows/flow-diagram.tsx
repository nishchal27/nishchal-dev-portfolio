"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, AlertCircle } from "lucide-react";
import { FlowStep } from "@/data/flows";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FlowDiagramProps {
  steps: FlowStep[];
}

export function FlowDiagram({ steps }: FlowDiagramProps) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [showEdgeCases, setShowEdgeCases] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Flow Steps</h3>
        <button
          onClick={() => setShowEdgeCases(!showEdgeCases)}
          className="text-sm text-accent hover:underline"
        >
          {showEdgeCases ? "Hide" : "Show"} Edge Cases
        </button>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const isActive = activeStep === index;
          const isCompleted = activeStep !== null && activeStep > index;

          return (
            <div key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setActiveStep(isActive ? null : index)}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold transition-colors ${
                    isActive
                      ? "bg-accent border-accent text-white"
                      : isCompleted
                      ? "bg-accent/20 border-accent text-accent"
                      : "bg-surface border-border text-text-secondary"
                  }`}
                >
                  {step.id}
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={`w-0.5 h-16 ${
                      isCompleted ? "bg-accent" : "bg-border"
                    }`}
                  />
                )}
              </div>

              <div className="flex-1 pb-16">
                <Card
                  className={`cursor-pointer transition-all ${
                    isActive ? "border-accent shadow-lg" : "hover:border-accent/50"
                  }`}
                  onClick={() => setActiveStep(isActive ? null : index)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                        {step.component && (
                          <CardDescription className="mt-1 font-mono text-xs">
                            {step.component}
                          </CardDescription>
                        )}
                      </div>
                      <ChevronRight
                        className={`h-5 w-5 text-text-secondary transition-transform ${
                          isActive ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                  </CardHeader>
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CardContent className="space-y-4">
                          <p className="text-sm text-text-secondary">
                            {step.description}
                          </p>

                          {step.edgeCases && step.edgeCases.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-orange-500" />
                                Edge Cases
                              </h4>
                              <ul className="space-y-1">
                                {step.edgeCases.map((edgeCase, idx) => (
                                  <li
                                    key={idx}
                                    className="text-sm text-text-secondary flex items-start gap-2"
                                  >
                                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                                    {edgeCase}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {step.failureHandling && (
                            <div>
                              <h4 className="text-sm font-semibold text-text-primary mb-2">
                                Failure Handling
                              </h4>
                              <p className="text-sm text-text-secondary">
                                {step.failureHandling}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
