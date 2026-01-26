import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProjectDetail } from "@/components/portfolio/project-detail";
import { BackendProjectDetail } from "@/components/portfolio/backend-project-detail";
import { portfolioData } from "@/data/portfolio";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return portfolioData.projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = portfolioData.projects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.name} | ${project.tagline}`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = portfolioData.projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const isBackendProject = project.category === "Backend";

  return (
    <>
      <Header />
      <main>
        {isBackendProject ? (
          <BackendProjectDetail project={project} />
        ) : (
          <ProjectDetail project={project} />
        )}
      </main>
      <Footer />
    </>
  );
}
