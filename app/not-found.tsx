import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4 text-text-secondary">
            Page Not Found
          </h2>
          <p className="text-text-secondary mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex gap-4 justify-center">
            <Button href="/">Go Home</Button>
            <Button href="/lab" variant="secondary">
              Engineering Lab
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
