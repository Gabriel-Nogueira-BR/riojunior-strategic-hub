export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      anuidades: {
        Row: {
          ano: number
          created_at: string
          data_pagamento: string | null
          data_vencimento: string
          ej_id: string
          id: string
          juros_percentual: number | null
          status: string
          valor: number
          valor_juros: number | null
        }
        Insert: {
          ano: number
          created_at?: string
          data_pagamento?: string | null
          data_vencimento: string
          ej_id: string
          id?: string
          juros_percentual?: number | null
          status: string
          valor: number
          valor_juros?: number | null
        }
        Update: {
          ano?: number
          created_at?: string
          data_pagamento?: string | null
          data_vencimento?: string
          ej_id?: string
          id?: string
          juros_percentual?: number | null
          status?: string
          valor?: number
          valor_juros?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "anuidades_ej_id_fkey"
            columns: ["ej_id"]
            isOneToOne: false
            referencedRelation: "ejs"
            referencedColumns: ["id"]
          },
        ]
      }
      ciclos: {
        Row: {
          ano: number
          created_at: string
          data_fim: string | null
          data_inicio: string | null
          id: string
          nome: string
          numero: number
          tipo: string
          updated_at: string
        }
        Insert: {
          ano?: number
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          id?: string
          nome: string
          numero?: number
          tipo: string
          updated_at?: string
        }
        Update: {
          ano?: number
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          id?: string
          nome?: string
          numero?: number
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      contratos: {
        Row: {
          ano: number
          created_at: string
          ej_colaboradora_id: string | null
          ej_id: string
          id: string
          nome: string
          tem_colaboracao: boolean
          updated_at: string
          valor: number
          valor_ej: number
        }
        Insert: {
          ano?: number
          created_at?: string
          ej_colaboradora_id?: string | null
          ej_id: string
          id?: string
          nome: string
          tem_colaboracao?: boolean
          updated_at?: string
          valor?: number
          valor_ej?: number
        }
        Update: {
          ano?: number
          created_at?: string
          ej_colaboradora_id?: string | null
          ej_id?: string
          id?: string
          nome?: string
          tem_colaboracao?: boolean
          updated_at?: string
          valor?: number
          valor_ej?: number
        }
        Relationships: [
          {
            foreignKeyName: "contratos_ej_colaboradora_id_fkey"
            columns: ["ej_colaboradora_id"]
            isOneToOne: false
            referencedRelation: "ejs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_ej_id_fkey"
            columns: ["ej_id"]
            isOneToOne: false
            referencedRelation: "ejs"
            referencedColumns: ["id"]
          },
        ]
      }
      documentos: {
        Row: {
          created_at: string
          descricao: string | null
          etapa: number
          id: string
          nome: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          etapa: number
          id?: string
          nome: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          etapa?: number
          id?: string
          nome?: string
        }
        Relationships: []
      }
      ejs: {
        Row: {
          cluster: number
          cnpj: string
          created_at: string
          faturamento_atual: number
          faturamento_meta: number
          faturamento_q1: number | null
          faturamento_q2: number | null
          faturamento_q3: number | null
          faturamento_q4: number | null
          id: string
          localizacao: string
          nome: string
          regiao: string
          updated_at: string
        }
        Insert: {
          cluster: number
          cnpj: string
          created_at?: string
          faturamento_atual?: number
          faturamento_meta?: number
          faturamento_q1?: number | null
          faturamento_q2?: number | null
          faturamento_q3?: number | null
          faturamento_q4?: number | null
          id?: string
          localizacao: string
          nome: string
          regiao: string
          updated_at?: string
        }
        Update: {
          cluster?: number
          cnpj?: string
          created_at?: string
          faturamento_atual?: number
          faturamento_meta?: number
          faturamento_q1?: number | null
          faturamento_q2?: number | null
          faturamento_q3?: number | null
          faturamento_q4?: number | null
          id?: string
          localizacao?: string
          nome?: string
          regiao?: string
          updated_at?: string
        }
        Relationships: []
      }
      entregas_documentos: {
        Row: {
          created_at: string
          data_entrega: string | null
          documento_id: string
          ej_id: string
          entregue: boolean
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_entrega?: string | null
          documento_id: string
          ej_id: string
          entregue?: boolean
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_entrega?: string | null
          documento_id?: string
          ej_id?: string
          entregue?: boolean
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "entregas_documentos_documento_id_fkey"
            columns: ["documento_id"]
            isOneToOne: false
            referencedRelation: "documentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entregas_documentos_ej_id_fkey"
            columns: ["ej_id"]
            isOneToOne: false
            referencedRelation: "ejs"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos: {
        Row: {
          created_at: string
          data_fim: string
          data_inicio: string
          diretorias: string[] | null
          id: string
          nome: string
          pauta: string | null
          tipo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_fim: string
          data_inicio: string
          diretorias?: string[] | null
          id?: string
          nome: string
          pauta?: string | null
          tipo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_fim?: string
          data_inicio?: string
          diretorias?: string[] | null
          id?: string
          nome?: string
          pauta?: string | null
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      faturamento_mensal: {
        Row: {
          ano: number
          created_at: string
          ej_id: string
          id: string
          mes: number
          meta_mes: number
          updated_at: string
          valor: number
        }
        Insert: {
          ano: number
          created_at?: string
          ej_id: string
          id?: string
          mes: number
          meta_mes?: number
          updated_at?: string
          valor?: number
        }
        Update: {
          ano?: number
          created_at?: string
          ej_id?: string
          id?: string
          mes?: number
          meta_mes?: number
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "faturamento_mensal_ej_id_fkey"
            columns: ["ej_id"]
            isOneToOne: false
            referencedRelation: "ejs"
            referencedColumns: ["id"]
          },
        ]
      }
      key_results: {
        Row: {
          atual: number
          created_at: string
          descricao: string | null
          id: string
          meta: number
          objetivo_id: string
          tipo_metrica: string
          titulo: string
          unidade: string | null
          updated_at: string
        }
        Insert: {
          atual?: number
          created_at?: string
          descricao?: string | null
          id?: string
          meta: number
          objetivo_id: string
          tipo_metrica: string
          titulo: string
          unidade?: string | null
          updated_at?: string
        }
        Update: {
          atual?: number
          created_at?: string
          descricao?: string | null
          id?: string
          meta?: number
          objetivo_id?: string
          tipo_metrica?: string
          titulo?: string
          unidade?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "key_results_objetivo_id_fkey"
            columns: ["objetivo_id"]
            isOneToOne: false
            referencedRelation: "objetivos"
            referencedColumns: ["id"]
          },
        ]
      }
      objetivos: {
        Row: {
          ciclo_id: string | null
          created_at: string
          descricao: string | null
          diretoria: string | null
          id: string
          nivel: string
          objetivo_pai_id: string | null
          okr_estrategica_id: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          ciclo_id?: string | null
          created_at?: string
          descricao?: string | null
          diretoria?: string | null
          id?: string
          nivel: string
          objetivo_pai_id?: string | null
          okr_estrategica_id?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          ciclo_id?: string | null
          created_at?: string
          descricao?: string | null
          diretoria?: string | null
          id?: string
          nivel?: string
          objetivo_pai_id?: string | null
          okr_estrategica_id?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "objetivos_ciclo_id_fkey"
            columns: ["ciclo_id"]
            isOneToOne: false
            referencedRelation: "ciclos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objetivos_objetivo_pai_id_fkey"
            columns: ["objetivo_pai_id"]
            isOneToOne: false
            referencedRelation: "objetivos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objetivos_okr_estrategica_id_fkey"
            columns: ["okr_estrategica_id"]
            isOneToOne: false
            referencedRelation: "okrs_estrategicas"
            referencedColumns: ["id"]
          },
        ]
      }
      okrs_estrategicas: {
        Row: {
          ano: number
          created_at: string
          descricao: string | null
          id: string
          titulo: string
          updated_at: string
        }
        Insert: {
          ano?: number
          created_at?: string
          descricao?: string | null
          id?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          ano?: number
          created_at?: string
          descricao?: string | null
          id?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      presidencia_eventos: {
        Row: {
          created_at: string
          data_abertura_coordenadoria: string | null
          data_articulacao_local: string | null
          data_evento: string
          data_idv_inicio_brainstorm: string | null
          data_idv_inicio_terceirizada: string | null
          data_marco_zero: string | null
          data_pesquisa_aviso_previo: string | null
          data_pesquisa_lancamento: string | null
          data_pesquisa_limite_coleta: string | null
          data_pf_aprovacao_ca: string | null
          data_pf_inicio_elaboracao: string | null
          data_referencia_status: string
          dia_status_sebrae: string
          id: string
          nome_evento: string
          periodicidade: string
          prazo_abertura_coordenadoria: number
          prazo_articulacao_local: number
          prazo_aviso_previo: number
          prazo_coleta_pesquisa: number
          prazo_idv_brainstorm: number
          prazo_idv_terceirizada: number
          prazo_pesquisa_conselheiros: number
          prazo_pf_aprovacao_ca: number
          prazo_pf_elaboracao: number
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_abertura_coordenadoria?: string | null
          data_articulacao_local?: string | null
          data_evento: string
          data_idv_inicio_brainstorm?: string | null
          data_idv_inicio_terceirizada?: string | null
          data_marco_zero?: string | null
          data_pesquisa_aviso_previo?: string | null
          data_pesquisa_lancamento?: string | null
          data_pesquisa_limite_coleta?: string | null
          data_pf_aprovacao_ca?: string | null
          data_pf_inicio_elaboracao?: string | null
          data_referencia_status?: string
          dia_status_sebrae?: string
          id?: string
          nome_evento: string
          periodicidade?: string
          prazo_abertura_coordenadoria?: number
          prazo_articulacao_local?: number
          prazo_aviso_previo?: number
          prazo_coleta_pesquisa?: number
          prazo_idv_brainstorm?: number
          prazo_idv_terceirizada?: number
          prazo_pesquisa_conselheiros?: number
          prazo_pf_aprovacao_ca?: number
          prazo_pf_elaboracao?: number
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_abertura_coordenadoria?: string | null
          data_articulacao_local?: string | null
          data_evento?: string
          data_idv_inicio_brainstorm?: string | null
          data_idv_inicio_terceirizada?: string | null
          data_marco_zero?: string | null
          data_pesquisa_aviso_previo?: string | null
          data_pesquisa_lancamento?: string | null
          data_pesquisa_limite_coleta?: string | null
          data_pf_aprovacao_ca?: string | null
          data_pf_inicio_elaboracao?: string | null
          data_referencia_status?: string
          dia_status_sebrae?: string
          id?: string
          nome_evento?: string
          periodicidade?: string
          prazo_abertura_coordenadoria?: number
          prazo_articulacao_local?: number
          prazo_aviso_previo?: number
          prazo_coleta_pesquisa?: number
          prazo_idv_brainstorm?: number
          prazo_idv_terceirizada?: number
          prazo_pesquisa_conselheiros?: number
          prazo_pf_aprovacao_ca?: number
          prazo_pf_elaboracao?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      tipos_evento: {
        Row: {
          cor: string
          created_at: string
          id: string
          nome: string
        }
        Insert: {
          cor?: string
          created_at?: string
          id?: string
          nome: string
        }
        Update: {
          cor?: string
          created_at?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      tipos_transacao: {
        Row: {
          created_at: string
          id: string
          nome: string
          tipo: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          tipo: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          tipo?: string
        }
        Relationships: []
      }
      transacoes: {
        Row: {
          categoria: string
          created_at: string
          custo_embutido: number | null
          data: string
          descricao: string
          ej_id: string | null
          id: string
          is_recorrente: boolean
          juros_aplicados: number | null
          parceiro_nome: string | null
          recorrencia_meses: number | null
          status: string
          tipo: string
          updated_at: string
          valor: number
        }
        Insert: {
          categoria: string
          created_at?: string
          custo_embutido?: number | null
          data: string
          descricao: string
          ej_id?: string | null
          id?: string
          is_recorrente?: boolean
          juros_aplicados?: number | null
          parceiro_nome?: string | null
          recorrencia_meses?: number | null
          status: string
          tipo: string
          updated_at?: string
          valor: number
        }
        Update: {
          categoria?: string
          created_at?: string
          custo_embutido?: number | null
          data?: string
          descricao?: string
          ej_id?: string | null
          id?: string
          is_recorrente?: boolean
          juros_aplicados?: number | null
          parceiro_nome?: string | null
          recorrencia_meses?: number | null
          status?: string
          tipo?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "transacoes_ej_id_fkey"
            columns: ["ej_id"]
            isOneToOne: false
            referencedRelation: "ejs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
