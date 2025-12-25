import { XCircle, Sparkles } from 'lucide-react';
import React from 'react';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  showSparkle?: boolean;
}

const Modal = ({ title, children, onClose, showSparkle }: ModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm animate-fade-in">
    <div className="bg-card rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh] border border-border">
      <div className="flex justify-between items-center p-6 border-b border-border shrink-0 bg-card">
        <h3 className="text-xl font-bold text-card-foreground flex items-center gap-2">
          {showSparkle && <Sparkles className="text-accent" size={20} />}
          {title}
        </h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <XCircle size={24} />
        </button>
      </div>
      <div className="p-6 overflow-y-auto text-card-foreground leading-relaxed grow bg-secondary/30 scrollbar-thin">
        {children}
      </div>
    </div>
  </div>
);

export default Modal;
