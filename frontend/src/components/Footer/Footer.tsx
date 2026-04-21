import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#3d6b8a] text-white px-8 md:px-16 lg:px-24 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
          {/* Left: Logo + contact */}
          <div>
            <Image
              src="/easyemail-logo.png"
              alt="easyemAll logo"
              width={160}
              height={40}
              className="mb-4"
            />
            <p className="text-sm text-white/80">
              Contacto:{" "}
              <a
                href="mailto:info@easyemail.ai"
                className="text-orange-400 hover:underline"
              >
                info@easyemail.ai
              </a>
            </p>
          </div>

          {/* Right: Nav links in two columns */}
          <div className="flex gap-16 md:gap-24">
            <ul className="flex flex-col gap-4 text-sm text-white/90">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-white transition-colors">
                  Q&A
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-white transition-colors">
                  ¿Qué es easyemail?
                </Link>
              </li>
            </ul>
            <ul className="flex flex-col gap-4 text-sm text-white/90">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white transition-colors">
                  Atención al cliente
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 pt-6 text-center">
          <p className="text-sm text-white/70">
            © 2025 easyEmail – Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
