// JS da Fase 2 - Mercadinho Petrópolis
// - Relógio em tempo real
// - Regras do formulário (mostrar/ocultar endereço conforme serviço)
// - Validação básica e mensagens amigáveis
// - Datas: define mínimo = hoje

(function () {
  'use strict';

  // Util: data "YYYY-MM-DD" local (sem fuso quebrando)
  function hojeISO() {
    const d = new Date();
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  // 1) Relógio em tempo real (funções temporais)
  function atualizaDataHora() {
    const el = document.getElementById('dataHora');
    if (!el) return;
    const agora = new Date();
    // pt-BR com data e hora
    el.textContent = agora.toLocaleString('pt-BR');
  }
  setInterval(atualizaDataHora, 1000);
  atualizaDataHora();

  // 2) Formulário: elementos
  const form = document.getElementById('formCadastro');
  const blocoEndereco = document.getElementById('blocoEndereco');
  const camposEndereco = ['endereco', 'numero', 'bairro', 'cidade', 'cep'].map(id => document.getElementById(id));
  const radiosServico = Array.from(document.querySelectorAll('input[name="servico"]'));
  const campoData = document.getElementById('data');
  const campoCPF = document.getElementById('cpf');
  const mensagem = document.getElementById('mensagem');

  // 2.1) Data mínima = hoje
  if (campoData) {
    campoData.min = hojeISO();
  }

  // 2.2) Mostrar/ocultar endereço conforme serviço
  function alternaEndereco() {
    const servico = radiosServico.find(r => r.checked)?.value;
    const precisaEndereco = servico === 'entrega';

    // Toggle visual
    blocoEndereco.classList.toggle('d-none', !precisaEndereco);
    blocoEndereco.setAttribute('aria-hidden', String(!precisaEndereco));

    // Torna campos obrigatórios apenas quando precisa
    camposEndereco.forEach(campo => {
      if (!campo) return;
      campo.required = precisaEndereco;
      if (!precisaEndereco) campo.value = '';
    });
  }
  radiosServico.forEach(r => r.addEventListener('change', alternaEndereco));

  // 2.3) Validação Bootstrap + regra CPF
  function cpfValido(valor) {
    // Para a Fase 2, validação simples: 11 dígitos numéricos
    return /^\d{11}$/.test(valor);
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      // Validação nativa Bootstrap
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      // Validação CPF específica
      if (!cpfValido(campoCPF.value)) {
        event.preventDefault();
        event.stopPropagation();
        campoCPF.setCustomValidity('CPF deve conter 11 dígitos numéricos.');
      } else {
        campoCPF.setCustomValidity('');
      }

      form.classList.add('was-validated');

      // Se tudo ok, mostra mensagem amigável (sem enviar para servidor)
      if (form.checkValidity()) {
        event.preventDefault();
        const nome = document.getElementById('nome').value.trim();
        const servico = radiosServico.find(r => r.checked)?.value;
        const data = campoData.value;
        const hora = document.getElementById('hora').value;

        mensagem.className = 'alert alert-success';
        mensagem.textContent = `Obrigado, ${nome}! Seu cadastro foi recebido. ${servico === 'entrega' ? 'Entrega' : 'Retirada'} agendada para ${data} às ${hora}.`;
        mensagem.classList.remove('d-none');

        // Opcional: rolar até a mensagem
        mensagem.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Limpa o formulário após alguns segundos
        setTimeout(() => {
          form.reset();
          form.classList.remove('was-validated');
          alternaEndereco();
        }, 2500);
      }
    });

    // Ao resetar, esconde mensagem e endereço
    form.addEventListener('reset', () => {
      mensagem.className = 'alert d-none';
      mensagem.textContent = '';
      alternaEndereco();
    });
  }

  // Inicializa estado
  alternaEndereco();
})();
