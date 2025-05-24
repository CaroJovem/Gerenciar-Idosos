// validacoes.js
export const validarCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;
  
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;
  
  return true;
};

export const validarCartaoSUS = (cartao) => {
  cartao = cartao.replace(/[^\d]+/g, '');
  if (cartao.length !== 15) return false;
  return /^\d{15}$/.test(cartao);
};

export const formatarTelefone = (telefone) => {
  return telefone
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d)(\d{4})$/, '$1-$2');
};

export const formatarCPF = (cpf) => {
  return cpf
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

export const formatarCEP = (cep) => {
  return cep
    .replace(/\D/g, '')
    .replace(/^(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1');
};

export const estadosBrasileiros = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' }
];

export const validarFormulario = (formData) => {
  const erros = {};
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // Validação de Dados Pessoais
  if (!formData.nome.trim()) {
    erros.nome = 'Nome completo é obrigatório';
  } else if (formData.nome.length < 5) {
    erros.nome = 'Nome deve ter pelo menos 5 caracteres';
  }
  
  if (!formData.dataNascimento) {
    erros.dataNascimento = 'Data de nascimento é obrigatória';
  } else {
    const dataNasc = new Date(formData.dataNascimento);
    if (dataNasc > hoje) {
      erros.dataNascimento = 'Data de nascimento não pode ser no futuro';
    }
  }
  
  if (!formData.genero) {
    erros.genero = 'Gênero é obrigatório';
  }
  
  if (!formData.rg.trim()) {
    erros.rg = 'RG é obrigatório';
  } else if (formData.rg.length < 7) {
    erros.rg = 'RG deve ter pelo menos 7 dígitos';
  }
  
  if (!formData.cpf.trim()) {
    erros.cpf = 'CPF é obrigatório';
  } else if (!validarCPF(formData.cpf)) {
    erros.cpf = 'CPF inválido';
  }
  
  if (!formData.cartaoSus.trim()) {
    erros.cartaoSus = 'Cartão SUS é obrigatório';
  } else if (!validarCartaoSUS(formData.cartaoSus)) {
    erros.cartaoSus = 'Cartão SUS inválido';
  }
  
  if (!formData.telefone.trim()) {
    erros.telefone = 'Telefone é obrigatório';
  } else if (formData.telefone.replace(/\D/g, '').length < 10) {
    erros.telefone = 'Telefone inválido';
  }
  
  // Validação de Endereço
  if (!formData.rua.trim()) {
    erros.rua = 'Rua é obrigatória';
  }
  
  if (!formData.numero.trim()) {
    erros.numero = 'Número é obrigatório';
  }
  
  if (!formData.cidade.trim()) {
    erros.cidade = 'Cidade é obrigatória';
  }
  
  if (!formData.estado) {
    erros.estado = 'Estado é obrigatório';
  }
  
  if (!formData.cep.trim()) {
    erros.cep = 'CEP é obrigatório';
  } else if (formData.cep.replace(/\D/g, '').length !== 8) {
    erros.cep = 'CEP inválido';
  }
  
  // Validação de Dados de Internação
  /*if (!formData.dataEntrada) {
    erros.dataEntrada = 'Data de entrada é obrigatória';
  } else {
    const dataEntrada = new Date(formData.dataEntrada);
    if (dataEntrada > hoje) {
      erros.dataEntrada = 'Data de entrada não pode ser no futuro';
    }
  }
  
  if (!formData.quarto) {
    erros.quarto = 'Quarto é obrigatório';
  }
  
  if (!formData.cama) {
    erros.cama = 'Cama é obrigatória';
  }*/
  
  return erros;
};