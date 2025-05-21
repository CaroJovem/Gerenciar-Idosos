import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Table, 
  Modal, 
  Form,
  InputGroup,
  Alert
} from 'react-bootstrap';
import { 
  PlusCircle, 
  Funnel, 
  Search, 
  Pencil, 
  Trash, 
  Eye 
} from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import './SataListaIdosos.css';

const SataListaIdosos = () => {
  const navigate = useNavigate();
  const [mostrarModalExclusao, setMostrarModalExclusao] = useState(false);
  const [idosoSelecionado, setIdosoSelecionado] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroOrdenacao, setFiltroOrdenacao] = useState('nome_asc');
  const [termoBusca, setTermoBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState(null);

  // Estado inicial vazio - os dados virão do localStorage
  const [idosos, setIdosos] = useState([]);

  // Carrega dados do localStorage ao iniciar
  useEffect(() => {
    try {
      const dadosSalvos = localStorage.getItem('idosos');
      if (dadosSalvos) {
        setIdosos(JSON.parse(dadosSalvos));
      } else {
        // Se não houver dados, inicializa com array vazio
        localStorage.setItem('idosos', JSON.stringify([]));
      }
      setCarregando(false);
    } catch (error) {
      setErroCarregamento('Erro ao carregar dados do localStorage');
      setCarregando(false);
      console.error(error);
    }
  }, []);

  // Salva dados no localStorage sempre que houver alteração
  useEffect(() => {
    if (!carregando) {
      localStorage.setItem('idosos', JSON.stringify(idosos));
    }
  }, [idosos, carregando]);

  const handleExcluirClick = (idoso) => {
    setIdosoSelecionado(idoso);
    setMostrarModalExclusao(true);
  };

  const confirmarExclusao = () => {
    const novosDados = idosos.filter(item => item.id !== idosoSelecionado.id);
    setIdosos(novosDados);
    setMostrarModalExclusao(false);
  };

  const idososFiltrados = idosos.filter(idoso => {
    if (filtroStatus && idoso.status !== filtroStatus) {
      return false;
    }
    
    if (termoBusca) {
      const termo = termoBusca.toLowerCase();
      return (
        idoso.nome.toLowerCase().includes(termo) ||
        idoso.cpf.includes(termo) ||
        idoso.quarto.toLowerCase().includes(termo)
      );
    }
    
    return true;
  });

  const idososOrdenados = [...idososFiltrados].sort((a, b) => {
    switch (filtroOrdenacao) {
      case 'nome_asc':
        return a.nome.localeCompare(b.nome);
      case 'nome_desc':
        return b.nome.localeCompare(a.nome);
      case 'data_asc':
        return new Date(a.dataEntrada.split('/').reverse().join('-')) - 
               new Date(b.dataEntrada.split('/').reverse().join('-'));
      case 'data_desc':
        return new Date(b.dataEntrada.split('/').reverse().join('-')) - 
               new Date(a.dataEntrada.split('/').reverse().join('-'));
      case 'idade_asc':
        return a.idade - b.idade;
      case 'idade_desc':
        return b.idade - a.idade;
      default:
        return 0;
    }
  });

  if (carregando) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Alert variant="info">Carregando dados...</Alert>
      </Container>
    );
  }

  if (erroCarregamento) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Alert variant="danger">{erroCarregamento}</Alert>
      </Container>
    );
  }

  return (
    <div className="d-flex">
      <div className="conteudo-principal">
        <Container fluid>
          <Row className="mb-4 linha-cabecalho">
            <Col className="d-flex justify-content-between align-items-center">
              <h2>Lista de Idosos Cadastrados</h2>
              <div>
                <Button 
                  variant="primary"
                  onClick={() => navigate('/cadastro')}
                >
                  <PlusCircle className="me-1" /> Novo Idoso
                </Button>
              </div>
            </Col>
          </Row>

          {idosos.length === 0 ? (
            <Alert variant="info">
              Nenhum idoso cadastrado. Clique em "Novo Idoso" para começar.
            </Alert>
          ) : (
            <>
              <Card className="mb-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Filtros e Busca</h5>
                  <Button variant="outline-secondary" size="sm" data-bs-toggle="collapse" data-bs-target="#filtrosCollapse">
                    <Funnel className="me-1" /> Filtros
                  </Button>
                </Card.Header>
                <Card.Body className="collapse show" id="filtrosCollapse">
                  <Row>
                    <Col md={4} className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Form.Select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                        <option value="">Todos</option>
                        <option value="ativo">Ativos</option>
                        <option value="inativo">Inativos</option>
                      </Form.Select>
                    </Col>
                    <Col md={4} className="mb-3">
                      <Form.Label>Ordenar por</Form.Label>
                      <Form.Select value={filtroOrdenacao} onChange={(e) => setFiltroOrdenacao(e.target.value)}>
                        <option value="nome_asc">Nome (A-Z)</option>
                        <option value="nome_desc">Nome (Z-A)</option>
                        <option value="data_asc">Data de Entrada (Mais antigo)</option>
                        <option value="data_desc">Data de Entrada (Mais recente)</option>
                        <option value="idade_asc">Idade (Mais jovem)</option>
                        <option value="idade_desc">Idade (Mais idoso)</option>
                      </Form.Select>
                    </Col>
                    <Col md={4} className="mb-3">
                      <Form.Label>Buscar</Form.Label>
                      <InputGroup>
                        <Form.Control 
                          type="text" 
                          placeholder="Nome, CPF ou quarto..."
                          value={termoBusca}
                          onChange={(e) => setTermoBusca(e.target.value)}
                        />
                        <Button variant="outline-secondary">
                          <Search />
                        </Button>
                      </InputGroup>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card>
                <Card.Body>
                  <div className="table-responsive">
                    <Table striped hover responsive>
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Idade</th>
                          <th>CPF</th>
                          <th>Quarto</th>
                          <th>Data de Entrada</th>
                          <th>Status</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {idososOrdenados.map(idoso => (
                          <tr key={idoso.id}>
                            <td>{idoso.nome}</td>
                            <td>{idoso.idade}</td>
                            <td>{idoso.cpf}</td>
                            <td>{idoso.quarto}</td>
                            <td>{idoso.dataEntrada}</td>
                            <td>
                              <span className={`status-${idoso.status}`}>
                                {idoso.status === 'ativo' ? 'Ativo' : 'Inativo'}
                              </span>
                            </td>
                            <td className="botoes-acao">
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                title="Editar"
                                onClick={() => navigate(`/editar/${idoso.id}`)}
                              >
                                <Pencil />
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm" 
                                title="Excluir"
                                onClick={() => handleExcluirClick(idoso)}
                              >
                                <Trash />
                              </Button>
                              <Button 
                                variant="outline-secondary" 
                                size="sm" 
                                title="Detalhes"
                                onClick={() => navigate(`/detalhes/${idoso.id}`)}
                              >
                                <Eye />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </>
          )}

          <Modal show={mostrarModalExclusao} onHide={() => setMostrarModalExclusao(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmar Exclusão</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Tem certeza que deseja excluir este idoso? Esta ação não pode ser desfeita.</p>
              <p className="fw-bold">{idosoSelecionado?.nome}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setMostrarModalExclusao(false)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={confirmarExclusao}>
                Excluir
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </div>
  );
};

export default SataListaIdosos;