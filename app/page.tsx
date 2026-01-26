import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/portfolio/hero";
import { About } from "@/components/portfolio/about";
import { Skills } from "@/components/portfolio/skills";
import { Projects } from "@/components/portfolio/projects";
import { EngineeringSystems } from "@/components/portfolio/engineering-systems";
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
        <Projects projects={portfolioData.projects} />
        <EngineeringSystems projects={portfolioData.projects} />
        <About bio={portfolioData.bio} />
        <Skills skills={portfolioData.skills} />
      </main>
      <Footer />
    </>
  );
}
