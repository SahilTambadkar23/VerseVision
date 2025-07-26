import { PoemGenerator } from '@/components/poem-generator';
import { Logo } from '@/components/icons/logo';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-4">
          <Logo className="h-10 w-10 text-primary" />
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">
            VerseVision
          </h1>
        </div>
        <p className="mt-2 text-muted-foreground">
          Transform your photos into evocative poetry.
        </p>
      </header>
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PoemGenerator />
      </main>
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-muted-foreground text-sm">
        <p>Created By Sahil Tambadkar</p>
      </footer>
    </div>
  );
}
