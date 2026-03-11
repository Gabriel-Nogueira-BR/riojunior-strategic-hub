import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { calcularCronograma, gerarTimeline, PresidenciaEventoInput } from '@/utils/backwardsScheduling';
import CronogramaPreview from './CronogramaPreview';
import type { PresidenciaEvento } from '@/hooks/usePresidenciaEventos';

interface EventoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (input: PresidenciaEventoInput) => Promise<void>;
  eventoEdit?: PresidenciaEvento | null;
}

const DIAS_SEMANA = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

const EventoFormModal = ({ isOpen, onClose, onSave, eventoEdit }: EventoFormModalProps) => {
  const [nomeEvento, setNomeEvento] = useState(eventoEdit?.nomeEvento || '');
  const [dataEvento, setDataEvento] = useState<Date | undefined>(
    eventoEdit ? new Date(eventoEdit.dataEvento + 'T12:00:00') : undefined
  );
  const [diaStatusSebrae, setDiaStatusSebrae] = useState(eventoEdit?.diaStatusSebrae || 'Quarta');
  const [prazoIdvBrainstorm, setPrazoIdvBrainstorm] = useState(eventoEdit?.prazoIdvBrainstorm || 14);
  const [prazoIdvTerceirizada, setPrazoIdvTerceirizada] = useState(eventoEdit?.prazoIdvTerceirizada || 21);
  const [prazoPfElaboracao, setPrazoPfElaboracao] = useState(eventoEdit?.prazoPfElaboracao || 14);
  const [prazoPfAprovacaoCa, setPrazoPfAprovacaoCa] = useState(eventoEdit?.prazoPfAprovacaoCa || 7);
  const [prazoPesquisaConselheiros, setPrazoPesquisaConselheiros] = useState(eventoEdit?.prazoPesquisaConselheiros || 14);
  const [saving, setSaving] = useState(false);

  const input: PresidenciaEventoInput | null = useMemo(() => {
    if (!dataEvento || !nomeEvento) return null;
    return {
      nomeEvento,
      dataEvento: format(dataEvento, 'yyyy-MM-dd'),
      diaStatusSebrae,
      prazoIdvBrainstorm,
      prazoIdvTerceirizada,
      prazoPfElaboracao,
      prazoPfAprovacaoCa,
      prazoPesquisaConselheiros,
    };
  }, [nomeEvento, dataEvento, diaStatusSebrae, prazoIdvBrainstorm, prazoIdvTerceirizada, prazoPfElaboracao, prazoPfAprovacaoCa, prazoPesquisaConselheiros]);

  const cronograma = useMemo(() => input ? calcularCronograma(input) : null, [input]);
  const timeline = useMemo(() => input && cronograma ? gerarTimeline(input, cronograma) : [], [input, cronograma]);

  const handleSave = async () => {
    if (!input) return;
    setSaving(true);
    try {
      await onSave(input);
      onClose();
    } catch {
      // toast handled in hook
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose} title={eventoEdit ? 'Editar Evento' : 'Novo Evento com Cronograma Reverso'}>
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <Label>Nome do Evento</Label>
            <Input value={nomeEvento} onChange={(e) => setNomeEvento(e.target.value)} placeholder="Ex: Encontro Regional Sul" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Data do Evento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dataEvento && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataEvento ? format(dataEvento, "dd/MM/yyyy") : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dataEvento} onSelect={setDataEvento} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Dia Status SEBRAE</Label>
              <Select value={diaStatusSebrae} onValueChange={setDiaStatusSebrae}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DIAS_SEMANA.map(d => <SelectItem key={d} value={d}>{d}-feira</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Prazos */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground text-sm border-b border-border pb-2">Prazos (em dias)</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">🎨 Brainstorm IDV</Label>
              <Input type="number" min={1} value={prazoIdvBrainstorm} onChange={(e) => setPrazoIdvBrainstorm(Number(e.target.value))} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">🎨 Terceirizada IDV</Label>
              <Input type="number" min={1} value={prazoIdvTerceirizada} onChange={(e) => setPrazoIdvTerceirizada(Number(e.target.value))} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">💰 Elaboração PF</Label>
              <Input type="number" min={1} value={prazoPfElaboracao} onChange={(e) => setPrazoPfElaboracao(Number(e.target.value))} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">💰 Aprovação CA</Label>
              <Input type="number" min={1} value={prazoPfAprovacaoCa} onChange={(e) => setPrazoPfAprovacaoCa(Number(e.target.value))} />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label className="text-xs">🤝 Pesquisa Conselheiros</Label>
              <Input type="number" min={1} value={prazoPesquisaConselheiros} onChange={(e) => setPrazoPesquisaConselheiros(Number(e.target.value))} />
            </div>
          </div>
        </div>

        {/* Preview do Cronograma */}
        {cronograma && input && (
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground text-sm border-b border-border pb-2">📋 Preview do Cronograma</h3>
            <CronogramaPreview timeline={timeline} cronograma={cronograma} dataEvento={input.dataEvento} />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button onClick={handleSave} disabled={!input || saving} className="flex-1">
            {saving ? 'Salvando...' : eventoEdit ? 'Atualizar' : 'Criar Evento'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EventoFormModal;
