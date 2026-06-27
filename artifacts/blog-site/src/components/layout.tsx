import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { BookOpen, PenTool } from "lucide-react";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <header className="border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center font-serif font-bold text-lg group-hover:bg-foreground transition-colors">
              D
            </div>
            <span className="font-serif font-bold text-xl tracking-tight">The Daily Draft</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link 
              href="/posts" 
              className={`text-sm font-medium transition-colors hover:text-primary ${location === '/posts' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Read
            </Link>
            <Link 
              href="/admin" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <PenTool className="w-4 h-4" />
              Publish
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-border bg-card py-12 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
          <p className="font-serif italic mb-4 text-lg">Ideas worth reading.</p>
          <p>&copy; {new Date().getFullYear()} The Daily Draft. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
