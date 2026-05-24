# LevelUp Finance 🎮💰

Aplicação frontend gamificada de gestão financeira pessoal.

---

## Como inicializar

### Opção 1 – Abrir direto no navegador
Abra o arquivo `index.html` diretamente no navegador (Chrome, Firefox ou Edge).

> ⚠ Para evitar problemas com CORS ao carregar módulos locais, recomenda-se usar um servidor local.

### Opção 2 – Servidor local com Python (recomendado)
```bash
# Dentro da pasta do projeto:
python3 -m http.server 3000
# Acesse: http://localhost:3000
```

### Opção 3 – Servidor local com Node.js
```bash
npx serve .
# Acesse o endereço exibido no terminal
```

---

## Dados de autenticação de teste

| Campo | Valor              |
|-------|---------------------|
| Email | hero@levelup.finance |
| Senha | levelup123          |

> Você também pode criar uma conta pelo botão **"É um novo aventureiro?"** na tela de login.

---

## Entidades / Funcionalidades

### 1. Transações (Receitas e Gastos) — Dashboard
- Registrar receita via modal (botão `+`)
- Registrar gasto via modal (botão `+`)
- Saldo, receitas e gastos calculados dinamicamente por mês
- Gráfico de barras dos últimos 6 meses atualiza em tempo real
- Missões ativas reativas (progresso calculado automaticamente)
- Seção "Atividade Recente" mostra as últimas 10 transações
- XP e nível do aventureiro crescem com cada transação registrada

### 2. Dívidas / Monstros — Arena
- 3 monstros padrão com HP inicial configurável
- Botão **"NOVA DÍVIDA"** para adicionar quantas dívidas quiser
- Sistema de ataque: deduz o valor pago do HP
- Validação de pagamento mínimo por monstro
- Barra de HP atualiza visualmente após cada ataque
- Monstro derrotado (verde) quando HP chega a zero
- Pagamentos registrados automaticamente no histórico do Dashboard
- Estado persistido entre sessões

### 3. Metas de Poupança — Santuário
- Criar novos "Poços de Mana" (metas de poupança)
- Adicionar mana (depósitos) às metas existentes
- Remover metas com botão de exclusão
- Barras de progresso visuais (percentual e volume)
- Totais consolidados atualizados automaticamente
- Depósitos registrados no Dashboard como receita

### 4. Insights e Missões — Oráculo
- Insights gerados dinamicamente com base nos seus dados reais
- Taxa de economia calculada sobre receitas totais
- Comparativo de gastos mês atual vs. mês anterior
- Categoria de maior gasto identificada automaticamente
- Missões semanais com checkboxes persistidos
- XP disponível decresce conforme missões são completadas

---

## Estrutura de pastas

```
levelup/
├── index.html          # Login
├── dashboard.html      # Hub principal com gráfico
├── arena.html          # Gerenciamento de dívidas
├── santuario.html      # Metas de poupança
├── oraculo.html        # Insights e missões semanais
├── cadastro.html       # Cadastro
├── css/
│   ├── style.css
│   ├── dashboard.css
│   ├── arena.css
│   ├── santuario.css
│   ├── oraculo.css
│   └── cadastro.css
└── js/
    ├── script.js
    ├── dashboard.js
    ├── arena.js
    ├── santuario.js
    ├── oraculo.js
    └── cadastro.js
```

---

## Tecnologias utilizadas
- **HTML5 / CSS3 / JavaScript (ES6+)**
- **Bootstrap 5.3** — Grid e componentes
- **Bootstrap Icons 1.11** — Ícones
- **Chart.js 4.4** — Gráfico de barras dinâmico no dashboard
- **localStorage** — Persistência de dados no navegador

---

## Observações
- Todos os dados são armazenados localmente no navegador via `localStorage`.
- Não há backend nesta versão (frontend puro — entrega para avaliação FIAP).
- Para limpar todos os dados: abra o console do navegador e execute `localStorage.clear()`.
- As chaves do localStorage usam o prefixo `luf_` para evitar conflitos.
