import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProjectsShowcase } from "@/components/portfolio/projects-showcase";
import { portfolioData } from "@/data/portfolio";

export const metadata = {
  title: "Projects",
  description: "A showcase of production-ready software projects including SaaS platforms, AI-powered tools, mobile applications, and web platforms.",
};

export default function ProjectsPage() {
  return (
    <>
      <Header />
      <main>
        <ProjectsShowcase projects={portfolioData.projects} />
      </main>
      <Footer />
    </>
  );
}
