import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ComparisonTable } from "@/components/lab/tradeoffs/comparison-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tradeoffs } from "@/data/tradeoffs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function TradeoffPage({ params }: PageProps) {
  const { slug } = await params;
  const tradeoff = tradeoffs.find((t) => t.slug === slug);

  if (!tradeoff) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <Link
            href="/lab/tradeoffs"
            className="inline-flex items-center text-sm text-text-secondary hover:text-accent transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tradeoff Explorers
          </Link>

          <div className="mb-12 max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              {tradeoff.title}
            </h1>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-3">Problem</h2>
                <p className="text-text-secondary">{tradeoff.problem}</p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-3">Constraints</h2>
                <ul className="space-y-2">
                  {tradeoff.constraints.map((constraint, idx) => (
                    <li
                      key={idx}
                      className="text-text-secondary flex items-start gap-2"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                      {constraint}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Options Comparison</h2>
            <ComparisonTable options={tradeoff.options} />
          </div>

          <div className="mb-12 max-w-4xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Decision Framework</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary mb-4">
                  {tradeoff.decision.framework}
                </p>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary mb-2">
                      Recommendation
                    </h4>
                    <p className="text-text-secondary">
                      {tradeoff.decision.recommendation}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary mb-2">
                      Reasoning
                    </h4>
                    <p className="text-text-secondary">
                      {tradeoff.decision.reasoning}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scaling Considerations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">{tradeoff.scaling}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
