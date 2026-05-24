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
|-------|--------------------|
| Email | hero@levelup.finance |
| Senha | levelup123         |

> Você também pode criar uma conta pelo botão **"É um novo aventureiro?"** na tela de login.

---

## Entidades / Funcionalidades

### 1. Transações (Receitas e Gastos)
- Registrar receita via modal no Dashboard (botão `+`)
- Registrar gasto via modal no Dashboard (botão `+`)
- Dados persistidos em `localStorage`
- Histórico exibido na seção "Atividade Recente"
- Saldo, total de receitas e total de gastos calculados dinamicamente

### 2. Dívidas / Monstros (Arena)
- 3 monstros ativos com HP, juros e pagamento mínimo
- Sistema de ataque: deduz o valor pago do HP do monstro
- Validação de pagamento mínimo
- Progresso salvo em `localStorage`
- Monstro derrotado quando HP chega a zero

### 3. Metas de Poupança (Santuário)
- Criar novos "Poços de Mana" (metas)
- Adicionar valores às metas existentes
- Barra de progresso visual (percentual)
- Dados salvos em `localStorage`

---

## Estrutura de pastas

```
levelup-finance/
├── index.html          # Login
├── dashboard.html      # Hub principal com gráfico
├── arena.html          # Gerenciamento de dívidas
├── santuario.html      # Metas de poupança
├── oraculo.html        # Insights e missões semanais
├── cadastro.html       # Onboarding / cadastro
├── css/
│   ├── style.css       # Login
│   ├── dashboard.css   # Dashboard
│   ├── arena.css       # Arena
│   ├── santuario.css   # Santuário
│   ├── oraculo.css     # Oráculo
│   └── cadastro.css    # Cadastro
└── js/
    ├── script.js       # Login
    ├── dashboard.js    # Dashboard + gráfico Chart.js
    ├── arena.js        # Batalha contra dívidas
    ├── santuario.js    # Poços de mana
    ├── oraculo.js      # Missões e insights
    └── cadastro.js     # Onboarding
```

---

## Tecnologias utilizadas
- **HTML5 / CSS3 / JavaScript (ES6+)**
- **Bootstrap 5.3** – Grid e componentes
- **Bootstrap Icons 1.11** – Ícones
- **Chart.js 4.4** – Gráfico de barras no dashboard
- **localStorage** – Persistência de dados no navegador

---

## Observações
- Todos os dados são armazenados localmente no navegador via `localStorage`.
- Não há backend nesta versão (frontend puro).
- Para limpar todos os dados: `localStorage.clear()` no console do navegador.
