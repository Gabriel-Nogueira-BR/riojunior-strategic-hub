import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { calcularCronograma, gerarTimeline, gerarGanttBars, PresidenciaEventoInput } from '@/utils/backwardsScheduling';
import CronogramaPreview from './CronogramaPreview';
import type { PresidenciaEvento } from '@/hooks/usePresidenciaEventos';

interface EventoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (input: PresidenciaEventoInput) => Promise<void>;
  eventoEdit?: PresidenciaEvento | null;
  dataReferenciaStatus: string;
}

// Helper: convert number|null to string for input display
const numToStr = (v: number | null | undefined): string => (v != null ? String(v) : '');
// Helper: convert input string to number|null
const strToNum = (v: string): number | null => {
  if (v === '') return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
};

const EventoFormModal = ({ isOpen, onClose, onSave, eventoEdit, dataReferenciaStatus }: EventoFormModalProps) => {
  const [nomeEvento, setNomeEvento] = useState(eventoEdit?.nomeEvento || '');
  const [dataEvento, setDataEvento] = useState<Date | undefined>(
    eventoEdit ? new Date(eventoEdit.dataEvento + 'T12:00:00') : undefined
  );
  const [prazoIdvBrainstorm, setPrazoIdvBrainstorm] = useState(numToStr(eventoEdit?.prazoIdvBrainstorm));
  const [prazoIdvTerceirizada, setPrazoIdvTerceirizada] = useState(numToStr(eventoEdit?.prazoIdvTerceirizada));
  const [prazoPfElaboracao, setPrazoPfElaboracao] = useState(numToStr(eventoEdit?.prazoPfElaboracao));
  const [prazoPfAprovacaoCa, setPrazoPfAprovacaoCa] = useState(numToStr(eventoEdit?.prazoPfAprovacaoCa));
  const [prazoAvisoPrevio, setPrazoAvisoPrevio] = useState(numToStr(eventoEdit?.prazoAvisoPrevio));
  const [prazoColetaPesquisa, setPrazoColetaPesquisa] = useState(numToStr(eventoEdit?.prazoColetaPesquisa));
  const [prazoAberturaCoordenadoria, setPrazoAberturaCoordenadoria] = useState(numToStr(eventoEdit?.prazoAberturaCoordenadoria));
  const [prazoArticulacaoLocal, setPrazoArticulacaoLocal] = useState(numToStr(eventoEdit?.prazoArticulacaoLocal));
  const [saving, setSaving] = useState(false);

  const input: PresidenciaEventoInput | null = useMemo(() => {
    if (!dataEvento || !nomeEvento || !dataReferenciaStatus) return null;
    return {
      nomeEvento,
      dataEvento: format(dataEvento, 'yyyy-MM-dd'),
      dataReferenciaStatus,
      prazoIdvBrainstorm: strToNum(prazoIdvBrainstorm),
      prazoIdvTerceirizada: strToNum(prazoIdvTerceirizada),
      prazoPfElaboracao: strToNum(prazoPfElaboracao),
      prazoPfAprovacaoCa: strToNum(prazoPfAprovacaoCa),
      prazoAvisoPrevio: strToNum(prazoAvisoPrevio),
      prazoColetaPesquisa: strToNum(prazoColetaPesquisa),
      prazoAberturaCoordenadoria: strToNum(prazoAberturaCoordenadoria),
      prazoArticulacaoLocal: strToNum(prazoArticulacaoLocal),
    };
  }, [nomeEvento, dataEvento, dataReferenciaStatus, prazoIdvBrainstorm, prazoIdvTerceirizada, prazoPfElaboracao, prazoPfAprovacaoCa, prazoAvisoPrevio, prazoColetaPesquisa, prazoAberturaCoordenadoria, prazoArticulacaoLocal]);

  const cronograma = useMemo(() => input ? calcularCronograma(input) : null, [input]);
  const timeline = useMemo(() => input && cronograma ? gerarTimeline(input, cronograma) : [], [input, cronograma]);
  const ganttBars = useMemo(() => input && cronograma ? gerarGanttBars(input, cronograma) : [], [input, cronograma]);

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
        </div>

        {/* Prazos */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground text-sm border-b border-border pb-2">Prazos (em dias) — deixe vazio para não incluir no cronograma</h3>
          
          {/* Coordenadoria & Infraestrutura */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">📋 Pré-Planejamento</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">📋 Abertura Coordenadoria</Label>
                <Input type="number" min={1} value={prazoAberturaCoordenadoria} onChange={(e) => setPrazoAberturaCoordenadoria(e.target.value)} placeholder="—" />
                <p className="text-[10px] text-muted-foreground">Dias antes do início do fluxo mais antigo</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">🏗️ Articulação de Local</Label>
                <Input type="number" min={1} value={prazoArticulacaoLocal} onChange={(e) => setPrazoArticulacaoLocal(e.target.value)} placeholder="—" />
                <p className="text-[10px] text-muted-foreground">Dias antes da Elaboração do PF</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">🎨 Brainstorm IDV</Label>
              <Input type="number" min={1} value={prazoIdvBrainstorm} onChange={(e) => setPrazoIdvBrainstorm(e.target.value)} placeholder="—" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">🎨 Terceirizada IDV</Label>
              <Input type="number" min={1} value={prazoIdvTerceirizada} onChange={(e) => setPrazoIdvTerceirizada(e.target.value)} placeholder="—" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">💰 Elaboração PF</Label>
              <Input type="number" min={1} value={prazoPfElaboracao} onChange={(e) => setPrazoPfElaboracao(e.target.value)} placeholder="—" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">💰 Aprovação CA</Label>
              <Input type="number" min={1} value={prazoPfAprovacaoCa} onChange={(e) => setPrazoPfAprovacaoCa(e.target.value)} placeholder="—" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">🤝 Aviso Prévio</Label>
              <Input type="number" min={1} value={prazoAvisoPrevio} onChange={(e) => setPrazoAvisoPrevio(e.target.value)} placeholder="—" />
              <p className="text-[10px] text-muted-foreground">Dias antes do lançamento da pesquisa</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">🤝 Coleta da Pesquisa</Label>
              <Input type="number" min={1} value={prazoColetaPesquisa} onChange={(e) => setPrazoColetaPesquisa(e.target.value)} placeholder="—" />
              <p className="text-[10px] text-muted-foreground">Duração da pesquisa (fim = Marco Zero)</p>
            </div>
          </div>
        </div>

        {/* Preview do Cronograma — Gantt */}
        {cronograma && input && (
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground text-sm border-b border-border pb-2">📋 Preview do Cronograma (Fluxos Paralelos)</h3>
            <CronogramaPreview timeline={timeline} cronograma={cronograma} dataEvento={input.dataEvento} ganttBars={ganttBars} />
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
