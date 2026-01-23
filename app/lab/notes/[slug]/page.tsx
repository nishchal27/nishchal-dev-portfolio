import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notes } from "@/data/notes";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const categoryLabels = {
  "design-decisions": "Design Decisions",
  mistakes: "Mistakes",
  reflections: "Reflections",
};

export default async function NotePage({ params }: PageProps) {
  const { slug } = await params;
  const note = notes.find((n) => n.slug === slug);

  if (!note) {
    notFound();
  }

  // Simple markdown-like parsing (convert **text** to bold, etc.)
  const parseContent = (content: string) => {
    return content.split("\n\n").map((paragraph, idx) => {
      if (paragraph.startsWith("**") && paragraph.endsWith(":**")) {
        const text = paragraph.replace(/\*\*/g, "");
        return (
          <h3 key={idx} className="text-lg font-semibold mt-6 mb-2 text-text-primary">
            {text}
          </h3>
        );
      }
      const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={idx} className="mb-4 text-text-secondary leading-7">
          {parts.map((part, partIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={partIdx} className="text-text-primary font-semibold">
                  {part.replace(/\*\*/g, "")}
                </strong>
              );
            }
            return <span key={partIdx}>{part}</span>;
          })}
        </p>
      );
    });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <Link
            href="/lab/notes"
            className="inline-flex items-center text-sm text-text-secondary hover:text-accent transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Engineering Notes
          </Link>

          <article className="max-w-3xl">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                  {categoryLabels[note.category]}
                </span>
                <span className="text-sm text-text-secondary font-mono">
                  {new Date(note.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                {note.title}
              </h1>
              <p className="text-lg text-text-secondary">{note.excerpt}</p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="prose prose-invert max-w-none">
                  {parseContent(note.content)}
                </div>
              </CardContent>
            </Card>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
