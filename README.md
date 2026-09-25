# 🌟 Lumi e a Floresta Estelar

> Um jogo web 2D poético e aconchegante com foco em exploração, plataforma suave, coleta de estrelas e transformação mágica do mundo.

O título público do jogo é **Lumi e a Floresta Estelar**. Para o GitHub, o nome curto recomendado é `lumi-starbound-forest`.

---

## ✨ Conceito & História

A protagonista é **Lumi**, uma pequena gata preta/chumbo com grandes olhos expressivos, uma capa azul esvoaçante e um pingente em formato de estrela no peito. 

Ao despertar em uma floresta mágica e silenciosa após as estrelas desaparecerem do firmamento, Lumi descobre que fragmentos dessas estrelas caíram entre a vegetação. Sua missão é explorar o cenário, reunir os fragmentos e devolver a luz e a vida à floresta ancestral.

- **Atmosfera**: Curiosidade, tranquilidade, magia, conto de fadas e sensação palpável de progresso.
- **Sem combate ou punição**: Uma experiência relaxante focada no prazer da exploração.
- **Sem Game Over**: Ao cair na água ou em fendas, Lumi dissolve em partículas de poeira estelar e reaparece imediatamente no último santuário seguro (checkpoint).

---

## 🎮 Controles

### Computador (Teclado)
- **A / D** ou **Setas Esquerda / Direita**: Movimentar Lumi (andar e correr)
- **Espaço / W / Seta para Cima**: Pular (com altura variável e assistência de salto)
- **S / Seta para Baixo + Pulo**: Descer de plataformas translúcidas (one-way platforms)
- **Esc**: Abrir menu de Configurações e Acessibilidade

### Celular & Tablet (Touchscreen)
- **Botões direcionais (◀ / ▶)**: Movimentação suave
- **Botão de Pulo (▲)**: Salto com toque responsivo e suporte multi-touch

---

## 🌌 Mecânica Central: A Transformação da Floresta

Conforme Lumi recupera os fragmentos perdidos, o mundo se transforma em tempo real:
- **0% — Floresta Escura & Silenciosa**: Tons frios de azul-marinho, escuridão calma e som ambiente minimalista.
- **25% — Cogumelos Bioluminescentes**: Cogumelos ganham brilho dourado e ciano; primeiros vagalumes começam a dançar no ar.
- **50% — Desabrochar da Flora**: Flores mágicas se abrem pelo caminho, plantas adquirem aura radiante e esporos mágicos flutuam.
- **75% — Constelações no Céu**: O céu noturno ganha vida com constelações sutis conectadas por linhas de luz e a iluminação global aquece o cenário.
- **100% — Despertar Pleno**: A floresta inteira pulsa com starlight radiante, preparando o clímax na **Árvore Ancestral**.

---

## 🗺️ Estrutura do Mapa

Uma fase contínua, densa e repleta de segredos detalhados:
1. **Início da Floresta**: Primeiro despertar de Lumi, vegetação suave e primeiros fragmentos.
2. **Área dos Cogumelos Luminosos**: Cogumelos elásticos que lançam Lumi a grandes alturas e galhos no dossel florestal (*Esconde a Estrela Secreta #1*).
3. **Pequena Ponte de Madeira**: Ponte rústica em arco sobre um desfiladeiro com lanternas acesas (*Viga oculta sob a ponte esconde a Estrela Secreta #2*).
4. **Riacho Encantado**: Cachoeira ao fundo, pedras de travessia e troncos flutuantes sobre a água cristalina.
5. **Clareira das Flores**: Prado florido com ruínas de pedra ancestral (*Topo do arco em ruínas esconde a Estrela Secreta #3*).
6. **Árvore Ancestral**: O grande santuário final onde Lumi devolve a luz recolhida.

---

## 🌳 O Clímax Final

Ao reunir as **20 estrelas principais** e alcançar o pedestal da Árvore Ancestral:
1. Lumi se aproxima do tronco sagrado.
2. Os fragmentos coletados saem em espiral do seu pingente estelar.
3. As estrelas circundam a copa da árvore, fazendo-a explodir em luz dourada e azul celeste.
4. As flores ao redor florescem instantaneamente.
5. A câmera sobe para o firmamento enquanto as constelações renascem.
6. A mensagem poética surge:
   > *“The forest remembers its light.”*
7. Tela final com estatísticas e opções:
   - `[Jogar novamente]` (Reiniciar jornada)
   - `[Explorar a floresta]` (Modo livre com a floresta 100% desperta e iluminada)

---

## ♿ Acessibilidade & Configurações

Acessível através do botão de engrenagem (**⚙️**) no topo da tela:
- **Reduzir Movimento**: Suaviza efeitos e animações dinâmicas de interface.
- **Desligar Tremor de Tela (Screen Shake)**: Desativa tremores de impacto na câmera.
- **Alto Contraste**: Aumenta saturação e contraste dos elementos interativos e plataformas.
- **Controle de Volume da Música**: Ajuste fino da trilha ambiente sintetizada.
- **Controle de Volume dos Efeitos**: Ajuste de passos, saltos e sinos mágicos.

---

## 🛠️ Arquitetura & Organização

Projeto 100% modular, sem dependências externas ou bundlers pesados, funcionando de forma nativa e imediata em qualquer navegador:

```
Lumi&TheLostStars_TheGame/
├── index.html                  # Estrutura semântica e montagem de módulos
├── README.md                   # Documentação completa
├── css/
│   ├── main.css                # Layout do canvas, iluminação e viewport
│   ├── hud.css                 # Contadores, barra de progresso e botões touch
│   └── modal.css               # Modais de acessibilidade e tela de finalização
└── js/
    ├── main.js                 # Inicialização, redimensionamento e loop
    ├── engine/
    │   ├── Game.js             # Orquestrador do estado de jogo
    │   ├── Camera.js           # Câmera com lerp, lookahead e sequências cinemáticas
    │   ├── Input.js            # Gerenciador de teclado e multi-touch
    │   └── Physics.js          # Colisão AABB, plataformas one-way e cogumelos elásticos
    ├── entities/
    │   ├── Lumi.js             # Gatinha protagonista: física da capa, olhos e estados
    │   ├── Star.js             # Estrelas normais (⭐) e cristais secretos (✦)
    │   ├── Checkpoint.js       # Santuários com runas mágicas
    │   └── ParticleSystem.js   # Partículas de brilho, água, respawn e espirais
    ├── world/
    │   ├── LevelData.js        # Geometria do mapa, posições das estrelas e zonas
    │   ├── WorldRenderer.js    # Renderizador canvas 2D, água animada e iluminação
    │   ├── EnvironmentFX.js    # Parallax, grama interativa, vagalumes e criaturas
    │   └── TransformationSystem.js # Evolução visual progressiva da floresta
    ├── audio/
    │   └── SoundManager.js     # Sintetizador procedural em Web Audio API
    └── ui/
        ├── HUD.js              # Atualização de placares e avisos
        ├── SettingsModal.js    # Painel de acessibilidade
        ├── EndingScreen.js     # Cutscene da Árvore Ancestral e cartões
        └── TouchControls.js    # Vínculo dos botões touch na tela
```

---

## 🚀 Como Executar

O jogo foi construído para rodar diretamente em qualquer navegador moderno:

1. **Abrir diretamente**: Basta dar um duplo clique em `index.html`.
2. **Ou via servidor local (recomendado)**:
   ```bash
   cd "Lumi&TheLostStars_TheGame"
   python3 -m http.server 8000
   ```
   Acesse no navegador: `http://localhost:8000`

---
*Criado com carinho para Lumi e a Floresta Estelar.*
