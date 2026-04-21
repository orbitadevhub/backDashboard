import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import FAQ from "@/components/FAQ/FAQ";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <About />
      <FAQ />
      <Footer />
    </main>
  );
}
