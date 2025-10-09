'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Transformez vos images
            <br />
            avec l'IA
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Créez des images époustouflantes en quelques secondes grâce à l'intelligence artificielle
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            {user ? (
              <Link
                href="/dashboard"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-semibold text-lg shadow-lg transform hover:scale-105"
              >
                Accéder au Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-semibold text-lg shadow-lg transform hover:scale-105"
                >
                  Commencer gratuitement
                </Link>
                <Link
                  href="/login"
                  className="bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 px-8 py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-semibold text-lg shadow-lg border-2 border-purple-600 dark:border-purple-400"
                >
                  Se connecter
                </Link>
              </>
            )}
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">
                Création instantanée
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Transformez vos images en quelques secondes avec notre IA avancée
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">
                Styles variés
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Des centaines de styles artistiques à votre disposition
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
              <div className="text-5xl mb-4">💾</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">
                Sauvegarde automatique
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Toutes vos créations sont sauvegardées dans votre galerie
              </p>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-20 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              "Une application incroyable qui m'a fait gagner des heures de travail"
            </p>
            <p className="font-semibold text-gray-800 dark:text-white">
              — Des milliers d'utilisateurs satisfaits
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
