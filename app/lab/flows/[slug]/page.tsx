import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FlowDiagram } from "@/components/lab/flows/flow-diagram";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { flows } from "@/data/flows";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function FlowPage({ params }: PageProps) {
  const { slug } = await params;
  const flow = flows.find((f) => f.slug === slug);

  if (!flow) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <Link
            href="/lab/flows"
            className="inline-flex items-center text-sm text-text-secondary hover:text-accent transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Interactive Flows
          </Link>

          <div className="mb-12 max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              {flow.title}
            </h1>
            <p className="text-lg text-text-secondary">{flow.description}</p>
          </div>

          <div className="mb-12">
            <FlowDiagram steps={flow.steps} />
          </div>

          <div className="max-w-4xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Additional Edge Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {flow.edgeCases.map((edgeCase, idx) => (
                    <li
                      key={idx}
                      className="text-text-secondary flex items-start gap-2"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                      {edgeCase}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Failure Recovery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">{flow.failureRecovery}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
