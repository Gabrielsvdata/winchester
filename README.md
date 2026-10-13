# WINCHESTER: O Negócio da Família

Fan game beat 'em up em pixel art, no estilo Golden Axe / Mega Drive, inspirado na série Supernatural. Roda direto no navegador, no computador e no celular.

**▶ Jogar:** [winchester-mu.vercel.app](https://winchester-mu.vercel.app/). Também aparece nos projetos do [portfólio do autor](https://github.com/Gabrielsvdata/Portfolio).

![Tela inicial do jogo](winchester.png)

> Projeto acadêmico e sem fins lucrativos. Personagens inspirados em *Supernatural*, de Eric Kripke. Sem relação oficial com a série ou com seus donos.

## O jogo

1. **Tela inicial:** o Impala na estrada à noite, com chuva, relâmpagos e o logo piscando como luz com mau contato.
2. **Abertura "A estrada até aqui":** 6 cenas animadas contam a origem dos Winchester: o incêndio de 1983 em Lawrence, os olhos amarelos, a vida na estrada, Stanford e a pista de Jericho.
3. **Escolha do caçador:** Dean ou Sam, cada um com força, velocidade, tiro e magia diferentes.
4. **Capítulo 1, Jericho:** estrada na mata, ponte e o quintal da casa da Constance, com rolagem lateral e paradas para enfrentar ondas de espíritos.
5. **Chefe:** a Mulher de Branco, com investida, grito duplo, teletransporte e invocação de vítimas.

### Mecânicas

| Mecânica | Como funciona |
|---|---|
| Combo | 3 golpes; o terceiro derruba |
| Voadora | Ataque durante o pulo |
| Corrida e ombrada | Toque duas vezes para o lado e ataque |
| Tiro | Espingarda de sal grosso (Dean) ou pistola com bala de ferro (Sam), com recarga |
| Magia | Usa os sacos de sal juntados (até 4). Dean derrama um **círculo de sal** no chão; Sam solta uma **onda psíquica** |
| Itens | Sacos de sal, torta e hambúrguer, que saem das latas de lixo e dos inimigos |
| Vidas | 3 vidas e tela de "Continuar?" com contagem regressiva |

### Inimigos

- **Espíritos das vítimas:** somem com efeito de falha na imagem e reaparecem atrás do jogador.
- **Espíritos que gritam:** atacam de longe com ondas de som que precisam ser puladas.
- **A Mulher de Branco:** chefe com padrões de ataque e armadura durante os golpes.

## Controles

| Ação | Teclado | Celular | Gamepad |
|---|---|---|---|
| Mover | Setas ou WASD | Analógico | Analógico ou direcional |
| Atacar | J ou Z | ATACAR | X |
| Pular | K, X ou Espaço | PULO | A |
| Tiro | L ou C | TIRO | B |
| Magia | I ou V | MAGIA | Y |
| Pausa | Esc ou P | Botão II | Start |

## Como foi feito

Tudo em um único arquivo HTML, sem engine, sem bibliotecas e sem imagens.

- **Gráficos:** HTML5 Canvas em 320×224, a resolução do Mega Drive, ampliado sem suavização. Os personagens são bonecos com esqueleto (quadril, joelhos, ombros, cotovelos) desenhados pixel a pixel a cada quadro, com contorno, rotação ao cair e efeito de falha nos fantasmas.
- **Cenário:** camadas com parallax geradas por código: céu com lua, morros, árvores, a casa e o chão com estrada, ponte e quintal.
- **Combate:** máquina de estados por personagem, caixas de acerto com profundidade (eixo y) e altura (eixo z), pausa no impacto, quique ao cair e um sistema que limita quantos inimigos atacam ao mesmo tempo.
- **Áudio:** Web Audio API. Efeitos e música da fase são sintetizados em tempo real, com onda de pulso no estilo NES e Mega Drive. A introdução da tela inicial (`audio/abertura.mp3`) é uma progressão de acordes arranjada no estilo YM2612: guitarras FM com saturação, órgão por síntese aditiva, baixo com estalo e bateria no estilo do canal DAC.
- **Entrada:** teclado, toque (analógico e botões) e Gamepad API.
- **Textos:** a fonte de pixel não tem maiúsculas acentuadas, então os acentos são desenhados à mão por cima das letras.

## Arquivos

```
winchester/
├── index.html        # o jogo inteiro (HTML, CSS e JavaScript)
├── audio/
│   ├── abertura.mp3  # introdução da tela inicial
│   └── LEIA-ME.txt
├── winchester.png    # captura da tela inicial
└── README.md
```

## Rodar localmente

Não precisa instalar nada. Sirva a pasta com qualquer servidor estático:

```bash
npx serve .
# ou
python3 -m http.server 8000
```

Abra o endereço mostrado no terminal. O `index.html` também abre direto no navegador, mas aí a introdução em MP3 não carrega e o jogo usa a trilha sintetizada.

## Deploy na Vercel

1. Em [vercel.com](https://vercel.com), clique em **Add New → Project** e importe este repositório.
2. Em **Framework Preset**, deixe **Other**. Não há comando de build: a Vercel publica os arquivos como estão.
3. Clique em **Deploy**. Cada push na `main` publica uma nova versão.

## Próximos passos

- Capítulo 2: ninho de vampiros, com John Winchester e o Colt.
- Capítulo 3: demônios no ferro-velho do Bobby, com a chegada do Castiel.
- Capítulo 4: Azazel no Portão do Diabo.
- Fase de estrada com o Impala como montaria.

## Autor

**Gabriel Silvano** · [GitHub](https://github.com/Gabrielsvdata) · [LinkedIn](https://linkedin.com/in/gabriel-silvano-vieira)
