// VARIÁVEIS DO JOGO
let objetoSorteado = null;
let palavraOriginal = null;
let palavraAtual = null;
let erros = 0;
const chancesMaximas = 6;
let letrasErradas = [] // Alterado para let para poder ser reatribuído

// ELEMENTOS HTML
const paragrafoDaDica = document.getElementById('paragrafo-da-dica');
const palavraEscondida = document.getElementById('palavra-escondida');
const letrasErradasNaTela = document.getElementById('letras-erradas')
const botaoAdivinhar = document.getElementById('botao-adivinhar');
const inputDoJogador = document.getElementById('palpite-do-jogador');
const imagemForca = document.getElementById('imagem-forca');
const mensagemFinal = document.getElementById('mensagem-final');
const botaoReiniciar = document.getElementById('botao-reiniciar'); // Seleciona o novo botão

// =================================================================
// FUNÇÃO QUE INICIA O JOGO
// =================================================================
async function iniciarJogo() {
  try {
    const resposta = await fetch('palavras.json');
    if (!resposta.ok) {
      throw new Error(`Erro ao carregar o arquivo: ${resposta.status}`);
    }
    const listaDeObjetos = await resposta.json();

    const indiceAleatorio = Math.floor(Math.random() * listaDeObjetos.length);
    objetoSorteado = listaDeObjetos[indiceAleatorio];

    palavraOriginal = objetoSorteado.word;
    palavraAtual = "-".repeat(palavraOriginal.length);

    paragrafoDaDica.textContent = objetoSorteado.hint;
    palavraEscondida.textContent = palavraAtual;

    erros = 0;
    letrasErradas = []; // Limpa o array de letras erradas da partida anterior
    // A linha abaixo estava incorreta e foi removida: letrasErradasNaTela = []
    imagemForca.src = `forca-${erros}.jpg`;
    mensagemFinal.textContent = ''; // Limpa a mensagem final
    letrasErradasNaTela.textContent = '';
    botaoAdivinhar.disabled = false; // Habilita o botão de adivinhar
    inputDoJogador.disabled = false; // Habilita o input
    botaoReiniciar.hidden = true; // Esconde o botão de reiniciar
    inputDoJogador.value = '';

  } catch (erro) {
    console.error('Ocorreu um erro:', erro);
  }
}

// =================================================================
// EVENTO DE CLIQUE DO BOTÃO
// =================================================================
botaoAdivinhar.addEventListener('click', function () {
  const letraAdivinhada = inputDoJogador.value.toUpperCase();
  inputDoJogador.value = '';

  if (palavraOriginal.includes(letraAdivinhada)) {
    console.log('Parabéns! Você acertou a letra!');

    let novaPalavraAtualizada = '';
    for (let i = 0; i < palavraOriginal.length; i++) {
      if (palavraOriginal[i] === letraAdivinhada) {
        novaPalavraAtualizada += letraAdivinhada;
      } else {
        novaPalavraAtualizada += palavraAtual[i];
      }
    }
    palavraAtual = novaPalavraAtualizada;
    palavraEscondida.textContent = palavraAtual;

    if (palavraAtual === palavraOriginal) {
      mensagemFinal.textContent = 'VOCÊ VENCEU! Parabéns!';
      console.log('VOCÊ VENCEU!');
      botaoAdivinhar.disabled = true; // Desabilita o botão de adivinhar
      inputDoJogador.disabled = true; // Desabilita o input
      botaoReiniciar.hidden = false; // Mostra o botão de reiniciar
    }

  } else {

    letrasErradas.push(letraAdivinhada)
    letrasErradasNaTela.textContent = letrasErradas.join(', ')
    erros++;
    console.log(`Que pena, a letra não está na palavra. Erros: ${erros}/${chancesMaximas}`);

    imagemForca.src = `forca-${erros}.jpg`;

    if (erros >= chancesMaximas) {
      mensagemFinal.textContent = `VOCÊ PERDEU! A palavra era: ${palavraOriginal}`;
      console.log('VOCÊ PERDEU!');
      botaoAdivinhar.disabled = true; // Desabilita o botão de adivinhar
      inputDoJogador.disabled = true; // Desabilita o input
      botaoReiniciar.hidden = false; // Mostra o botão de reiniciar

    }

  }

});

// =================================================================
// FUNÇÃO QUE REINICIA O JOGO
// =================================================================
botaoReiniciar.addEventListener('click', function () {
  iniciarJogo(); // Basta chamar a função de inicialização novamente!
});

// =================================================================
// INÍCIO DO JOGO
// =================================================================
iniciarJogo();