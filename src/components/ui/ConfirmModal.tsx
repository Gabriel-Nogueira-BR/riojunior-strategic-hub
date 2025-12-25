import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({ title, message, onConfirm, onCancel }: ConfirmModalProps) => (
  <Modal title={title} onClose={onCancel}>
    <div className="text-center py-4">
      <div className="bg-destructive/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="text-destructive" size={32} />
      </div>
      <h3 className="text-lg font-bold text-card-foreground mb-2">Você tem certeza?</h3>
      <p className="text-muted-foreground mb-6">{message}</p>
      <div className="flex justify-center gap-3">
        <button 
          onClick={onCancel} 
          className="btn-secondary"
        >
          Cancelar
        </button>
        <button 
          onClick={onConfirm} 
          className="px-4 py-2.5 bg-destructive text-destructive-foreground font-bold rounded-lg hover:opacity-90 transition-all shadow-md"
        >
          Sim, Excluir
        </button>
      </div>
    </div>
  </Modal>
);

export default ConfirmModal;
