'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Project {
  id: string;
  created_at: string;
  input_image_url: string;
  output_image_url: string;
  prompt: string;
  status: string;
}

export default function GalleryPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Erreur lors du chargement');
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (err) {
      setError('Impossible de charger la galerie');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement de la galerie...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Galerie
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Historique de vos créations
              </p>
            </div>
            <Link
              href="/"
              className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-all font-semibold"
            >
              ← Retour
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-8">
              {error}
            </div>
          )}

          {projects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 dark:text-gray-400 text-xl mb-4">
                Aucun projet pour le moment
              </p>
              <Link
                href="/"
                className="inline-block bg-purple-600 text-white px-8 py-3 rounded-xl hover:bg-purple-700 transition-all font-semibold"
              >
                Créer votre première image
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
                >
                  {/* Images comparison */}
                  <div className="grid grid-cols-2 gap-1 bg-gray-100 dark:bg-gray-700 p-1">
                    <div className="relative">
                      <img
                        src={project.input_image_url}
                        alt="Input"
                        className="w-full h-40 object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        Original
                      </span>
                    </div>
                    <div className="relative">
                      <img
                        src={project.output_image_url}
                        alt="Output"
                        className="w-full h-40 object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                        Généré
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                      <strong>Prompt:</strong> {project.prompt}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(project.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="px-4 pb-4 flex gap-2">
                    <a
                      href={project.output_image_url}
                      download
                      className="flex-1 bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 transition-all text-sm font-semibold"
                    >
                      Télécharger
                    </a>
                    <a
                      href={project.output_image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-all text-sm font-semibold"
                    >
                      Voir
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
