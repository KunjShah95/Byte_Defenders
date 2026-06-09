import { useNavigate } from "react-router-dom";
import { Button } from '@/components/common/Button';
import { AuroraBackground } from '@/components/aceternity/AuroraBackground';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <AuroraBackground className="min-h-screen flex items-center justify-center">
      <div className="relative z-10 text-center px-6">
        <div className="mb-8">
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 border border-primary/20 mb-6 rotate-12">
            <span className="text-5xl font-bold text-gradient">404</span>
          </div>
        </div>
        <h1 className="mb-4 text-6xl font-bold text-foreground">Lost in Thought</h1>
        <p className="mb-8 text-xl text-muted-foreground font-light max-w-lg mx-auto">
          This page doesn't exist. Even our AI agents couldn't find it.
        </p>
        <Button size="lg" onClick={() => navigate('/')} className="bg-primary hover:bg-primary/90">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return Home
        </Button>
      </div>
    </AuroraBackground>
  );
};

export default NotFound;
