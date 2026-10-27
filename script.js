
const missoes = [
    {
        grupo: "CH ou X?",
        figura: "🌧️",
        alt: "Chuva",
        instrucao: "Quando cai água do céu, é...",
        correta: "chuva",
        opcoes: ["chuva", "xuva", "chua", "xuvar"],
        explicacao: "CHUVA é escrita com CH. Ler e praticar ajuda a lembrar!",
        nivel: 1
    },
    {
        grupo: "CH ou X?",
        figura: "☕",
        alt: "Xícara",
        instrucao: "Uma...",
        correta: "xícara",
        opcoes: ["chícara", "xícara", "xikara", "chicara"],
        explicacao: "XÍCARA é escrita com X. Algumas palavras precisam ser memorizadas pela leitura.",
        nivel: 1
    },
    {
        grupo: "S ou Ç?",
        figura: "🍬",
        alt: "Açúcar",
        instrucao: "O que pode deixar o suco docinho?",
        correta: "açúcar",
        opcoes: ["açúcar", "asúcar", "açucar", "assúcar"],
        explicacao: "AÇÚCAR é escrita com Ç e leva acento no Ú.",
        nivel: 1
    },
    {
        grupo: "S ou Ç?",
        figura: "❤️",
        alt: "Coração",
        instrucao: "O nosso...",
        correta: "coração",
        opcoes: ["coraçãu", "coraçâo", "coração", "corasão"],
        explicacao: "CORAÇÃO é escrita com Ç e termina com ÃO.",
        nivel: 1
    },
    {
        grupo: "G ou J?",
        figura: "🦒",
        alt: "Girafa",
        instrucao: "Uma...",
        correta: "girafa",
        opcoes: ["jirafa", "girafa", "girrafa", "girapha"],
        explicacao: "GIRAFA começa com G. Antes de I, o G tem som parecido com J.",
        nivel: 2
    },
    {
        grupo: "G ou J?",
        figura: "🪟",
        alt: "Janela",
        instrucao: "Podemos olhar pela...",
        correta: "janela",
        opcoes: ["ganela", "janella", "janela", "janéla"],
        explicacao: "JANELA começa com J. A leitura ajuda a guardar a forma correta das palavras.",
        nivel: 2
    },
    {
        grupo: "R ou RR?",
        figura: "🚗",
        alt: "Carro",
        instrucao: "Um...",
        correta: "carro",
        opcoes: ["caro", "carro", "carru", "caxro"],
        explicacao: "CARRO tem RR. CARO, com um R, é outra palavra!",
        nivel: 2
    },
    {
        grupo: "R ou RR?",
        figura: "🐶",
        alt: "Cachorro",
        instrucao: "Um...",
        correta: "cachorro",
        opcoes: ["cachoro", "caxorro", "cachorro", "cachorroo"],
        explicacao: "CACHORRO tem RR no meio da palavra para representar o som forte.",
        nivel: 2
    },
    {
        grupo: "Revisão",
        figura: "📦",
        alt: "Caixa",
        instrucao: "Guardamos objetos em uma...",
        correta: "caixa",
        opcoes: ["caicha", "caixa", "caxa", "caiça"],
        explicacao: "CAIXA é escrita com X. O som que ouvimos nem sempre indica qual letra usar.",
        nivel: 3
    },
    {
        grupo: "Revisão",
        figura: "🦋",
        alt: "Borboleta",
        instrucao: "Uma...",
        correta: "borboleta",
        opcoes: ["bolboleta", "borboleta", "borboleta", "borboleta"],
        explicacao: "BORBOLETA é escrita com R. Continue praticando!",
        nivel: 3
    }
];

const $ = (seletor) => document.querySelector(seletor);

let indice = 0;
let pontos = 0;
let acertos = 0;
let respondida = false;
let somLigado = false;
let audioContext = null;

// Alterna entre a tela inicial, o jogo e o resultado.
function mostrarTela(id) {
    document.querySelectorAll(".tela").forEach(tela => {
        tela.classList.remove("ativa");
    });

    $("#" + id).classList.add("ativa");
}

// Embaralha as alternativas.
function embaralhar(lista) {
    const copia = [...lista];

    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [copia[i], copia[j]] = [copia[j], copia[i]];
    }

    return copia;
}

// Atualiza a pontuação no cabeçalho.
function atualizarPontos() {
    $("#pontos-topo").textContent = pontos;
}

// Produz sons simples usando o navegador.
function tocarNota(frequencia, duracao = 0.12) {
    if (!somLigado) return;

    try {
        audioContext = audioContext ||
            new (window.AudioContext || window.webkitAudioContext)();

        const oscilador = audioContext.createOscillator();
        const volume = audioContext.createGain();

        oscilador.frequency.value = frequencia;

        volume.gain.setValueAtTime(
            0.08,
            audioContext.currentTime
        );

        volume.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + duracao
        );

        oscilador.connect(volume);
        volume.connect(audioContext.destination);

        oscilador.start();
        oscilador.stop(audioContext.currentTime + duracao);
    } catch (erro) {
        // O jogo continua funcionando mesmo se o som falhar.
    }
}

// Começa uma nova partida.
function iniciarJogo() {
    indice = 0;
    pontos = 0;
    acertos = 0;

    atualizarPontos();
    mostrarTela("tela-jogo");
    carregarMissao();
}

// Mostra a missão atual.
function carregarMissao() {
    respondida = false;

    const missao = missoes[indice];

    $("#numero-missao").textContent =
        `Missão ${indice + 1} de ${missoes.length}`;

    $("#nivel").textContent = `Nível ${missao.nivel}`;

    $("#barra-preenchida").style.width =
        `${(indice / missoes.length) * 100}%`;

    $("#barra").setAttribute("aria-valuenow", indice);

    $("#categoria").textContent = missao.grupo;
    $("#figura").textContent = missao.figura;
    $("#figura").setAttribute("aria-label", missao.alt);

    $("#instrucao").textContent = missao.instrucao;

    $("#retorno").className = "retorno";
    $("#retorno").textContent = "";

    $("#continuar").hidden = true;

    const areaOpcoes = $("#opcoes");
    areaOpcoes.innerHTML = "";

    // Remove alternativas repetidas e embaralha as restantes.
    const opcoesUnicas = [...new Set(missao.opcoes)];

    embaralhar(opcoesUnicas).forEach(opcao => {
        const botao = document.createElement("button");

        botao.type = "button";
        botao.className = "opcao";
        botao.textContent = opcao;

        botao.addEventListener("click", () => {
            verificarResposta(botao, opcao);
        });

        areaOpcoes.appendChild(botao);
    });
}

// Verifica se a criança escolheu a palavra correta.
function verificarResposta(botaoEscolhido, resposta) {
    if (respondida) return;

    respondida = true;

    const missao = missoes[indice];
    const acertou = resposta === missao.correta;

    document.querySelectorAll(".opcao").forEach(botao => {
        botao.disabled = true;

        if (botao.textContent === missao.correta) {
            botao.classList.add("correta");
        }
    });

    const retorno = $("#retorno");

    retorno.classList.add(
        "mostrar",
        acertou ? "acerto" : "erro"
    );

    if (acertou) {
        pontos += 10;
        acertos++;

        retorno.innerHTML =
            `<strong>🎉 Muito bem! Você acertou!</strong>
            ${missao.explicacao}`;

        tocarNota(660);

        setTimeout(() => {
            tocarNota(880);
        }, 100);

    } else {
        botaoEscolhido.classList.add("errada");

        retorno.innerHTML =
            `<strong>💛 Boa tentativa!</strong>
            A palavra correta é
            <b>${missao.correta.toLocaleUpperCase("pt-BR")}</b>.
            ${missao.explicacao}`;

        tocarNota(300);
    }

    atualizarPontos();

    $("#continuar").textContent =
        indice === missoes.length - 1
            ? "Ver meu resultado 🏆"
            : "Próxima missão ➜";

    $("#continuar").hidden = false;
    $("#continuar").focus();
}

// Exibe o resultado ao final das missões.
function finalizarJogo() {
    $("#barra-preenchida").style.width = "100%";

    $("#barra").setAttribute(
        "aria-valuenow",
        missoes.length
    );

    $("#pontos-final").textContent = pontos;

    $("#acertos-final").textContent =
        `${acertos}/${missoes.length}`;

    if (acertos === missoes.length) {
        $("#trofeu").textContent = "🏆";

        $("#titulo-final").textContent =
            "Incrível! Você arrasou!";

        $("#mensagem-final").textContent =
            "Você acertou todas as missões!";

    } else if (acertos >= 6) {
        $("#trofeu").textContent = "🌟";

        $("#titulo-final").textContent =
            "Muito bem!";

        $("#mensagem-final").textContent =
            "Você está aprendendo bastante. Continue praticando!";

    } else {
        $("#trofeu").textContent = "🌱";

        $("#titulo-final").textContent =
            "Boa tentativa!";

        $("#mensagem-final").textContent =
            "Aprender leva tempo. Jogue novamente e pratique!";
    }

    mostrarTela("tela-final");
}

// Botão para iniciar o jogo.
$("#comecar").addEventListener("click", iniciarJogo);

// Botão para jogar novamente.
$("#jogar-novamente").addEventListener("click", iniciarJogo);

// Avança para a próxima missão.
$("#continuar").addEventListener("click", () => {
    if (indice < missoes.length - 1) {
        indice++;
        carregarMissao();
    } else {
        finalizarJogo();
    }
});

// Liga ou desliga os efeitos sonoros.
$("#botao-som").addEventListener("click", () => {
    somLigado = !somLigado;

    $("#botao-som").textContent =
        somLigado ? "🔊 Som" : "🔇 Som";

    $("#botao-som").setAttribute(
        "aria-pressed",
        String(somLigado)
    );

    if (somLigado) {
        tocarNota(660);
    }
});
