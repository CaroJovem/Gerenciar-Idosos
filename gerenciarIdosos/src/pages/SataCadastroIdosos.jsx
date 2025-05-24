import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Form, 
  Button, 
  Breadcrumb, 
  Card,
  Alert,
  Modal
} from 'react-bootstrap';
import { 
  PersonFill, 
  HouseFill,
  Hospital
} from 'react-bootstrap-icons';
import { useParams, useNavigate } from 'react-router-dom';
import './SataCadastroIdosos.css';
import {
  validarFormulario,
  validarFormularioInternacao,
  formatarTelefone,
  formatarCPF,
  formatarCEP,
  estadosBrasileiros
} from './validacoes';

const SataCadastroIdosos = () => {
  const { id, acao } = useParams();
  const navigate = useNavigate();
  const estaEditando = !!id;
  const editandoInternacao = acao === 'internacao';
  
  const [formData, setFormData] = useState({
  nome: '',
  dataNascimento: '',
  genero: '',
  rg: '',
  cpf: '',
  cartaoSus: '',
  telefone: '',
  rua: '',
  numero: '',
  complemento: '',
  cidade: '',
  estado: '',
  cep: '',
  dataEntrada: '',
  quarto: '',
  cama: '',
  observacoes: '',
  status: 'nao_internado'
});
  
  const [erros, setErros] = useState({});
  const [errosInternacao, setErrosInternacao] = useState({});
  const [submetido, setSubmetido] = useState(false);
  const [submetidoInternacao, setSubmetidoInternacao] = useState(false);

  useEffect(() => {
    if (estaEditando) {
      const idosos = JSON.parse(localStorage.getItem('idosos')) || [];
      const idosoParaEditar = idosos.find(idoso => idoso.id === parseInt(id));
      
      if (idosoParaEditar) {
        setFormData({
          ...idosoParaEditar
        });
      }
    }
  }, [estaEditando, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let valorFormatado = value;
    if (name === 'cpf') {
      valorFormatado = formatarCPF(value);
    } else if (name === 'telefone') {
      valorFormatado = formatarTelefone(value);
    } else if (name === 'cep') {
      valorFormatado = formatarCEP(value);
    }
    
    setFormData({
      ...formData,
      [name]: valorFormatado
    });
  };

  const calcularIdade = (dataNascimento) => {
    if (!dataNascimento) return 0;
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  const salvarDadosBasicos = () => {
    setSubmetido(true);
    const errosValidacao = validarFormulario(formData);
    setErros(errosValidacao);
    
    if (Object.keys(errosValidacao).length === 0) {
      const idosos = JSON.parse(localStorage.getItem('idosos')) || [];
      const idade = calcularIdade(formData.dataNascimento);

      if (estaEditando) {
        const novosIdosos = idosos.map(idoso => 
          idoso.id === parseInt(id) 
            ? { 
                ...formData,
                id: parseInt(id),
                idade
              } 
            : idoso
        );
        localStorage.setItem('idosos', JSON.stringify(novosIdosos));
      } else {
        const novoIdoso = {
          ...formData,
          id: Date.now(),
          idade
        };
        localStorage.setItem('idosos', JSON.stringify([...idosos, novoIdoso]));
      }
      
      alert(estaEditando ? 'Cadastro atualizado com sucesso!' : 'Cadastro realizado com sucesso!');
      navigate('/');
    }
  };

  const salvarInternacao = () => {
  setSubmetidoInternacao(true);
  const errosValidacao = validarFormularioInternacao(formData);
  setErrosInternacao(errosValidacao);
  
  if (Object.keys(errosValidacao).length === 0) {
    const idosos = JSON.parse(localStorage.getItem('idosos')) || [];
    const novosIdosos = idosos.map(idoso => 
      idoso.id === parseInt(id) 
        ? { 
            ...idoso,
            dataEntrada: formData.dataEntrada,
            quarto: formData.quarto,
            cama: formData.cama,
            observacoes: formData.observacoes,
            status: 'internado'
          } 
        : idoso
    );
    localStorage.setItem('idosos', JSON.stringify(novosIdosos));
    alert('Dados de internação atualizados com sucesso!');
    navigate('/');
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editandoInternacao) {
      salvarInternacao();
    } else {
      salvarDadosBasicos();
    }
  };

  return (
    <Container fluid className="container-principal">
      <Row className="mb-4 linha-cabecalho">
        <Col className="d-flex justify-content-between align-items-center">
          <h2>
            {editandoInternacao ? 'Editar Internação' : 
             estaEditando ? 'Editar Idoso' : 'Cadastro de Idoso'}
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Idosos</Breadcrumb.Item>
            <Breadcrumb.Item active>
              {editandoInternacao ? 'Editar Internação' : 
               estaEditando ? 'Edição' : 'Novo Cadastro'}
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>

      {submetido && Object.keys(erros).length > 0 && (
        <Alert variant="danger" className="mb-4">
          Por favor, corrija os erros no formulário antes de enviar.
        </Alert>
      )}

      {submetidoInternacao && Object.keys(errosInternacao).length > 0 && (
        <Alert variant="danger" className="mb-4">
          Por favor, corrija os erros no formulário de internação antes de enviar.
        </Alert>
      )}

      <Form onSubmit={handleSubmit} noValidate>
        {!editandoInternacao && (
          <>
            <Card className="mb-4 secao-formulario">
              <Card.Header>
                <PersonFill className="me-2" /> Dados Pessoais
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Nome Completo</Form.Label>
                    <Form.Control
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      isInvalid={!!erros.nome}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {erros.nome}
                    </Form.Control.Feedback>
                  </Col>
                  <Col md={3} className="mb-3">
                    <Form.Label>Data de Nascimento</Form.Label>
                    <Form.Control
                      type="date"
                      name="dataNascimento"
                      value={formData.dataNascimento}
                      onChange={handleChange}
                      isInvalid={!!erros.dataNascimento}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {erros.dataNascimento}
                    </Form.Control.Feedback>
                  </Col>
                  <Col md={3} className="mb-3">
                    <Form.Label>Gênero</Form.Label>
                    <Form.Select
                      name="genero"
                      value={formData.genero}
                      onChange={handleChange}
                      isInvalid={!!erros.genero}
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                      <option value="Outro">Outro</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {erros.genero}
                    </Form.Control.Feedback>
                  </Col>
                </Row>
                <Row>
                  <Col md={3} className="mb-3">
                    <Form.Label>RG</Form.Label>
                    <Form.Control
                      type="text"
                      name="rg"
                      value={formData.rg}
                      onChange={handleChange}
                      isInvalid={!!erros.rg}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {erros.rg}
                    </Form.Control.Feedback>
                  </Col>
                  <Col md={3} className="mb-3">
                    <Form.Label>CPF</Form.Label>
                    <Form.Control
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleChange}
                      isInvalid={!!erros.cpf}
                      maxLength="14"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {erros.cpf}
                    </Form.Control.Feedback>
                  </Col>
                  <Col md={3} className="mb-3">
                    <Form.Label>Cartão SUS</Form.Label>
                    <Form.Control
                      type="text"
                      name="cartaoSus"
                      value={formData.cartaoSus}
                      onChange={handleChange}
                      isInvalid={!!erros.cartaoSus}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {erros.cartaoSus}
                    </Form.Control.Feedback>
                  </Col>
                  <Col md={3} className="mb-3">
                    <Form.Label>Telefone</Form.Label>
                    <Form.Control
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      isInvalid={!!erros.telefone}
                      maxLength="15"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {erros.telefone}
                    </Form.Control.Feedback>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="mb-4 secao-formulario">
              <Card.Header>
                <HouseFill className="me-2" /> Endereço
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Rua</Form.Label>
                    <Form.Control
                      type="text"
                      name="rua"
                      value={formData.rua}
                      onChange={handleChange}
                      isInvalid={!!erros.rua}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {erros.rua}
                    </Form.Control.Feedback>
                  </Col>
                  <Col md={2} className="mb-3">
                    <Form.Label>Número</Form.Label>
                    <Form.Control
                      type="text"
                      name="numero"
                      value={formData.numero}
                      onChange={handleChange}
                      isInvalid={!!erros.numero}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {erros.numero}
                    </Form.Control.Feedback>
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Label>Complemento</Form.Label>
                    <Form.Control
                      type="text"
                      name="complemento"
                      value={formData.complemento}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md={5} className="mb-3">
                    <Form.Label>Cidade</Form.Label>
                    <Form.Control
                      type="text"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleChange}
                      isInvalid={!!erros.cidade}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {erros.cidade}
                    </Form.Control.Feedback>
                  </Col>
                  <Col md={3} className="mb-3">
                    <Form.Label>Estado</Form.Label>
                    <Form.Select
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      isInvalid={!!erros.estado}
                      required
                    >
                      <option value="">Selecione</option>
                      {estadosBrasileiros.map(estado => (
                        <option key={estado.sigla} value={estado.sigla}>
                          {estado.nome}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {erros.estado}
                    </Form.Control.Feedback>
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Label>CEP</Form.Label>
                    <Form.Control
                      type="text"
                      name="cep"
                      value={formData.cep}
                      onChange={handleChange}
                      isInvalid={!!erros.cep}
                      maxLength="9"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {erros.cep}
                    </Form.Control.Feedback>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </>
        )}

        {editandoInternacao && (
          <Card className="mb-4 secao-formulario">
            <Card.Header>
              <Hospital className="me-2" /> Dados de Internação
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4} className="mb-3">
                  <Form.Label>Data de Entrada</Form.Label>
                  <Form.Control
                    type="date"
                    name="dataEntrada"
                    value={formData.dataEntrada}
                    onChange={handleChange}
                    isInvalid={!!errosInternacao.dataEntrada}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errosInternacao.dataEntrada}
                  </Form.Control.Feedback>
                </Col>
                <Col md={4} className="mb-3">
                  <Form.Label>Quarto</Form.Label>
                  <Form.Control
                    type="text"
                    name="quarto"
                    value={formData.quarto}
                    onChange={handleChange}
                    isInvalid={!!errosInternacao.quarto}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errosInternacao.quarto}
                  </Form.Control.Feedback>
                </Col>
                <Col md={4} className="mb-3">
                  <Form.Label>Cama</Form.Label>
                  <Form.Control
                    type="text"
                    name="cama"
                    value={formData.cama}
                    onChange={handleChange}
                    isInvalid={!!errosInternacao.cama}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errosInternacao.cama}
                  </Form.Control.Feedback>
                </Col>
              </Row>
              <Row>
                <Col className="mb-3">
                  <Form.Label>Observações</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleChange}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}

        <div className="d-flex justify-content-end gap-2 mb-4">
          <Button 
            variant="secondary" 
            onClick={() => navigate('/')}
          >
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {editandoInternacao ? 'Salvar Internação' : 
             estaEditando ? 'Atualizar Cadastro' : 'Salvar Cadastro'}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default SataCadastroIdosos;