// src/app/page.tsx
import Link from "next/link";
import Navbar from "./components/Navbar.tsx/page";

export default function HomePage() {
  return (

    <div className=" bg-white">
        <Navbar/>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-700 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Aprende habilidades para el
              <span className="block text-yellow-300">futuro digital</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Cursos en vivo y on-demand de instructores expertos. 
              Domina las habilidades más demandadas del mercado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/courses" 
                className="bg-yellow-400 text-purple-900 px-8 py-4 rounded-lg text-lg font-bold hover:bg-yellow-300 transition-colors"
              >
                Explorar Cursos
              </Link>
              <Link 
                href="/auth/register" 
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-white hover:text-purple-900 transition-colors"
              >
                Crear Cuenta Gratis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías Populares */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Categorías Populares</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "💻", title: "Programación", courses: "1,200 cursos" },
              { icon: "🎨", title: "Diseño UX/UI", courses: "850 cursos" },
              { icon: "📊", title: "Marketing Digital", courses: "950 cursos" },
              { icon: "📱", title: "Desarrollo Móvil", courses: "700 cursos" },
            ].map((category, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
                <div className="text-3xl mb-4">{category.icon}</div>
                <h3 className="font-semibold mb-2">{category.title}</h3>
                <p className="text-gray-600 text-sm">{category.courses}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cursos Destacados */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Cursos Destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  {/* Imagen placeholder - luego reemplazar con imágenes reales */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-500">Imagen del curso</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">Curso de Desarrollo Web Full Stack</h3>
                  <p className="text-gray-600 text-sm mb-4">Aprende React, Node.js y MongoDB desde cero</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-purple-700">$49.99</span>
                    <span className="text-yellow-400">★★★★★</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link 
              href="/courses" 
              className="text-purple-700 font-semibold hover:text-purple-900"
            >
              Ver todos los cursos →
            </Link>
          </div>
        </div>
      </section>

      {/* Por Qué Elegirnos */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">¿Por qué elegirnos?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-semibold mb-2">Aprendizaje Práctico</h3>
              <p className="text-gray-600">Proyectos reales que puedes agregar a tu portafolio</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">👨‍🏫</div>
              <h3 className="font-semibold mb-2">Instructores Expertos</h3>
              <p className="text-gray-600">Profesionales con experiencia en la industria</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="font-semibold mb-2">Acceso Ilimitado</h3>
              <p className="text-gray-600">Aprende a tu ritmo, cuando quieras</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Comienza tu journey de aprendizaje hoy
          </h2>
          <p className="text-xl mb-8">
            Únete a miles de estudiantes que están transformando sus carreras
          </p>
          <Link 
            href="/auth/register" 
            className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg text-lg font-bold hover:bg-yellow-300 transition-colors"
          >
            Comenzar Ahora - Gratis
          </Link>
        </div>
      </section>

      {/* Footer Simple */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-2xl font-bold mb-4">🎓 EduPlatform</p>
            <p className="text-gray-400">Transformando la educación online</p>
            <div className="mt-6 flex justify-center space-x-6">
              <Link href="/about" className="text-gray-400 hover:text-white">Nosotros</Link>
              <Link href="/contact" className="text-gray-400 hover:text-white">Contacto</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white">Términos</Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white">Privacidad</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}