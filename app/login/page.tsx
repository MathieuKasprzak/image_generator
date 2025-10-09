import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Connexion
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Accédez à votre espace de création
          </p>
        </div>
        <AuthForm mode="signin" />
      </div>
    </main>
  );
}
