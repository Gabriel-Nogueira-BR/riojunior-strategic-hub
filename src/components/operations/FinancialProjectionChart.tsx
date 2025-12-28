import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Loader2 } from 'lucide-react';
import { useTransacoes } from '@/hooks/useTransacoes';
import { formatCurrency } from '@/utils/formatters';

interface FinancialProjectionChartProps {
  selectedYear: number;
}

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const FinancialProjectionChart = ({ selectedYear }: FinancialProjectionChartProps) => {
  const { transacoes, loading } = useTransacoes();

  const chartData = useMemo(() => {
    // Filter transactions for selected year
    const yearTransacoes = transacoes.filter(t => {
      const transactionYear = new Date(t.data).getFullYear();
      return transactionYear === selectedYear;
    });

    // Group by month
    const monthlyData = MONTHS.map((month, index) => {
      const monthTransacoes = yearTransacoes.filter(t => {
        const transactionMonth = new Date(t.data).getMonth();
        return transactionMonth === index;
      });

      const entradasRealizadas = monthTransacoes
        .filter(t => t.tipo === 'entrada' && t.status === 'realizado')
        .reduce((acc, t) => acc + t.valor, 0);

      const saidasRealizadas = monthTransacoes
        .filter(t => t.tipo === 'saida' && t.status === 'realizado')
        .reduce((acc, t) => acc + t.valor, 0);

      const entradasProjetadas = monthTransacoes
        .filter(t => t.tipo === 'entrada' && t.status === 'projetado')
        .reduce((acc, t) => acc + t.valor, 0);

      const saidasProjetadas = monthTransacoes
        .filter(t => t.tipo === 'saida' && t.status === 'projetado')
        .reduce((acc, t) => acc + t.valor, 0);

      return {
        month,
        entradasRealizadas,
        saidasRealizadas,
        entradasProjetadas,
        saidasProjetadas,
        saldoRealizado: entradasRealizadas - saidasRealizadas,
        saldoProjetado: (entradasRealizadas + entradasProjetadas) - (saidasRealizadas + saidasProjetadas),
      };
    });

    // Calculate cumulative balance
    let saldoAcumuladoRealizado = 0;
    let saldoAcumuladoProjetado = 0;

    return monthlyData.map(data => {
      saldoAcumuladoRealizado += data.saldoRealizado;
      saldoAcumuladoProjetado += data.saldoProjetado;

      return {
        ...data,
        saldoAcumuladoRealizado,
        saldoAcumuladoProjetado,
      };
    });
  }, [transacoes, selectedYear]);

  const totals = useMemo(() => {
    const yearTransacoes = transacoes.filter(t => {
      const transactionYear = new Date(t.data).getFullYear();
      return transactionYear === selectedYear;
    });

    const realizadas = yearTransacoes.filter(t => t.status === 'realizado');
    const projetadas = yearTransacoes.filter(t => t.status === 'projetado');

    return {
      entradasRealizadas: realizadas.filter(t => t.tipo === 'entrada').reduce((acc, t) => acc + t.valor, 0),
      saidasRealizadas: realizadas.filter(t => t.tipo === 'saida').reduce((acc, t) => acc + t.valor, 0),
      entradasProjetadas: projetadas.filter(t => t.tipo === 'entrada').reduce((acc, t) => acc + t.valor, 0),
      saidasProjetadas: projetadas.filter(t => t.tipo === 'saida').reduce((acc, t) => acc + t.valor, 0),
    };
  }, [transacoes, selectedYear]);

  const saldoFinalRealizado = totals.entradasRealizadas - totals.saidasRealizadas;
  const saldoFinalProjetado = saldoFinalRealizado + totals.entradasProjetadas - totals.saidasProjetadas;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
          <p className="text-xs text-muted-foreground mb-1">Entradas Realizadas</p>
          <p className="text-xl font-bold text-accent">{formatCurrency(totals.entradasRealizadas)}</p>
        </div>
        <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
          <p className="text-xs text-muted-foreground mb-1">Saídas Realizadas</p>
          <p className="text-xl font-bold text-destructive">{formatCurrency(totals.saidasRealizadas)}</p>
        </div>
        <div className="bg-rio-purple/10 p-4 rounded-lg border border-rio-purple/20">
          <p className="text-xs text-muted-foreground mb-1">Projeção Entradas</p>
          <p className="text-xl font-bold text-rio-purple">{formatCurrency(totals.entradasProjetadas)}</p>
        </div>
        <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
          <p className="text-xs text-muted-foreground mb-1">Saldo Final Projetado</p>
          <p className={`text-xl font-bold ${saldoFinalProjetado >= 0 ? 'text-primary' : 'text-destructive'}`}>
            {formatCurrency(saldoFinalProjetado)}
          </p>
        </div>
      </div>

      {/* Balance Evolution Chart */}
      <div className="card-elevated p-5">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-primary" />
          Evolução do Saldo Acumulado - {selectedYear}
        </h3>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRealizado" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProjetado" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="saldoAcumuladoRealizado" 
                name="Saldo Realizado"
                stroke="hsl(var(--accent))" 
                fillOpacity={1}
                fill="url(#colorRealizado)"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="saldoAcumuladoProjetado" 
                name="Saldo + Projeção"
                stroke="hsl(var(--primary))" 
                fillOpacity={1}
                fill="url(#colorProjetado)"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Breakdown Chart */}
      <div className="card-elevated p-5">
        <h3 className="font-bold text-foreground mb-4">Entradas vs Saídas por Mês</h3>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="entradasRealizadas" 
                name="Entradas Realizadas"
                stroke="hsl(var(--accent))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--accent))' }}
              />
              <Line 
                type="monotone" 
                dataKey="saidasRealizadas" 
                name="Saídas Realizadas"
                stroke="hsl(var(--destructive))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--destructive))' }}
              />
              <Line 
                type="monotone" 
                dataKey="entradasProjetadas" 
                name="Entradas Projetadas"
                stroke="hsl(var(--accent))" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'hsl(var(--accent))', strokeDasharray: '0' }}
              />
              <Line 
                type="monotone" 
                dataKey="saidasProjetadas" 
                name="Saídas Projetadas"
                stroke="hsl(var(--destructive))" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'hsl(var(--destructive))', strokeDasharray: '0' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FinancialProjectionChart;
