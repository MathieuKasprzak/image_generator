import AuthForm from '@/components/AuthForm';

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Inscription
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Créez votre compte et commencez à créer
          </p>
        </div>
        <AuthForm mode="signup" />
      </div>
    </main>
  );
}
