import { Construction } from 'lucide-react';

interface PlaceholderViewProps {
  title: string;
  description: string;
}

const PlaceholderView = ({ title, description }: PlaceholderViewProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <Construction size={40} className="text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground text-center max-w-md mb-8">{description}</p>
      <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent text-sm font-medium border border-accent/20">
        <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
        Em desenvolvimento
      </div>
    </div>
  );
};

export default PlaceholderView;
