import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/portfolio/hero";
import { About } from "@/components/portfolio/about";
import { Skills } from "@/components/portfolio/skills";
import { Projects } from "@/components/portfolio/projects";
import { portfolioData } from "@/data/portfolio";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero
          name={portfolioData.name}
          title={portfolioData.title}
          tagline={portfolioData.tagline}
        />
        <About bio={portfolioData.bio} />
        <Skills skills={portfolioData.skills} />
        <Projects projects={portfolioData.projects} />
      </main>
      <Footer />
    </>
  );
}
