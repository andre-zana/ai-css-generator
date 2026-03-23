function saudacaoPorHorario() {
  const hora = new Date().getHours(); // 0..23

  if (hora >= 5 && hora < 12) return "Bom dia";
  if (hora >= 12 && hora < 18) return "Boa tarde";
  if (hora >= 18 && hora < 24) return "Boa noite";
  return "Boa noite";
}

document.addEventListener("DOMContentLoaded", () => {
  const saudacao = saudacaoPorHorario(); // variável com valor dinâmico

  const textarea = document.getElementById("entrada"); // pega o elemento
  if (textarea) {
    textarea.placeholder = `${saudacao}. Como posso ajudar você hoje?`;
  }
});

let botao = document.querySelector(".botao-gerar");
const apiKey = "API_KEY_AQUI";
let endereco = "https://api.groq.com/openai/v1/chat/completions";

async function gerarCodigo() {
  let txtUser = document.querySelector(".caixa-texto").value;
  let blocoCodigo = document.querySelector(".bloco-codigo");
  let resultadoCodigo = document.querySelector(".resultado-codigo");

  try {
    let resposta = await fetch(endereco, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer API_KEY_AQUI`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          {
            role: "system",
            content:
              "Você é um gerador de código HTML e CSS. Responda SOMENTE com código puro. NUNCA use crases, markdown ou explicações. Formato: primeiro <style> com o CSS, depois o HTML. Siga EXATAMENTE o que o usuário pedir. Se pedir algo quicando, use translateY no @keyframes. Se pedir algo girando, use rotate.",
          },
          {
            role: "user",
            content: txtUser,
          },
        ],
      }),
    });

    if (!resposta.ok) {
      throw new Error("Erro na requisição");
    }

    let dados = await resposta.json();
    let resultado = dados.choices[0].message.content;

    blocoCodigo.textContent = resultado;
    resultadoCodigo.srcdoc = resultado;

    document.querySelector(".resultado").classList.add("visivel");
  } catch (erro) {
    console.error("Erro: ", erro);
    alert("Ocorreu um erro ao gerar o código. Por favor, tente novamente.");
  }
}
botao.addEventListener("click", gerarCodigo);
