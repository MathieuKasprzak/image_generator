'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setGeneratedImageUrl('');
      setError('');
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedImage || !prompt) {
      setError('Veuillez sélectionner une image et entrer un prompt');
      return;
    }

    setIsLoading(true);
    setError('');
    setLoadingMessage('Upload de l\'image en cours...');

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('prompt', prompt);

      setLoadingMessage('Génération de l\'image avec l\'IA...');
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la génération');
      }

      const data = await response.json();
      setGeneratedImageUrl(data.outputImageUrl);
      setLoadingMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setLoadingMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-end mb-4">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all text-purple-600 dark:text-purple-400 font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Voir la galerie
              </Link>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Éditeur d'Images IA
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Transformez vos images avec l'intelligence artificielle
            </p>
          </div>

          {/* Main Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mb-8">
            <form onSubmit={handleGenerate} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                  Sélectionner une image
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-purple-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-block"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <svg
                        className="w-16 h-16 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-purple-600 dark:text-purple-400 font-semibold">
                        Cliquez pour choisir une image
                      </span>
                      <span className="text-sm text-gray-500">
                        PNG, JPG, GIF jusqu'à 10MB
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Image Preview */}
              {previewUrl && (
                <div className="rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-auto max-h-96 object-contain bg-gray-50 dark:bg-gray-900"
                  />
                </div>
              )}

              {/* Prompt Input */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                  Décrivez la transformation souhaitée
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ex: Transforme cette image en style aquarelle..."
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all resize-none"
                  rows={4}
                  disabled={isLoading}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              {/* Generate Button */}
              <button
                type="submit"
                disabled={isLoading || !selectedImage || !prompt}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>{loadingMessage || 'Génération en cours...'}</span>
                  </div>
                ) : (
                  '✨ Générer l\'image'
                )}
              </button>
            </form>
          </div>

          {/* Generated Image */}
          {generatedImageUrl && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 animate-fadeIn">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                Image générée
              </h2>
              <div className="rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                <img
                  src={generatedImageUrl}
                  alt="Generated"
                  className="w-full h-auto object-contain bg-gray-50 dark:bg-gray-900"
                />
              </div>
              <div className="mt-6 flex gap-4">
                <a
                  href={generatedImageUrl}
                  download
                  className="flex-1 bg-green-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-green-700 transition-all text-center"
                >
                  📥 Télécharger
                </a>
                <button
                  onClick={() => {
                    setGeneratedImageUrl('');
                    setPreviewUrl('');
                    setSelectedImage(null);
                    setPrompt('');
                  }}
                  className="flex-1 bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-700 transition-all"
                >
                  🔄 Nouvelle image
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </main>
  );
}
