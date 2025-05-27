import React, { useState, useEffect } from 'react';
import './App.css';

// URL base do backend
const API_URL = 'http://localhost:3001/alunos';

function App() {
  // Estado inicial dos alunos
  const [alunos, setAlunos] = useState([]);
  const [form, setForm] = useState({
    id_aluno: null,
    nome_completo: '',
    usuario_acesso: '',
    senha: '',
    email_aluno: '',
    observacao: '',
  });
  const [editando, setEditando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  // Buscar alunos do backend ao carregar
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setAlunos(data))
      .catch(() => setMensagem('Erro ao buscar alunos.'));
  }, []);

  // Manipulação de campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Validação simples
  const validar = () => {
    if (!form.nome_completo || !form.usuario_acesso || !form.senha || !form.email_aluno) {
      setMensagem('Preencha todos os campos obrigatórios.');
      return false;
    }
    return true;
  };

  // Adicionar ou atualizar aluno
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;
    setMensagem('');
    try {
      if (editando) {
        // Atualizar aluno
        const res = await fetch(`${API_URL}/${form.id_aluno}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Erro ao atualizar aluno.');
        const alunoAtualizado = await res.json();
        setAlunos(alunos.map(a => a.id_aluno === form.id_aluno ? alunoAtualizado : a));
        setMensagem('Aluno atualizado com sucesso!');
      } else {
        // Cadastrar novo aluno
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Erro ao cadastrar aluno.');
        const novoAluno = await res.json();
        setAlunos([...alunos, { ...novoAluno, data_cadastro: new Date().toLocaleString() }]);
        setMensagem('Aluno cadastrado com sucesso!');
      }
      setForm({ id_aluno: null, nome_completo: '', usuario_acesso: '', senha: '', email_aluno: '', observacao: '' });
      setEditando(false);
    } catch (err) {
      setMensagem(err.message);
    }
  };

  // Editar aluno
  const handleEdit = (aluno) => {
    setForm({ ...aluno, senha: '' });
    setEditando(true);
    setMensagem('');
  };

  // Remover aluno
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este aluno?')) {
      try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Erro ao remover aluno.');
        setAlunos(alunos.filter(a => a.id_aluno !== id));
        setMensagem('Aluno removido.');
      } catch (err) {
        setMensagem(err.message);
      }
    }
  };

  return (
    <div className="container">
      <h1>Cadastro de Alunos</h1>
      {mensagem && <div className="mensagem">{mensagem}</div>}
      <form className="formulario" onSubmit={handleSubmit}>
        <div>
          <label>Nome Completo*</label>
          <input name="nome_completo" value={form.nome_completo} onChange={handleChange} required />
        </div>
        <div>
          <label>Usuário de Acesso*</label>
          <input name="usuario_acesso" value={form.usuario_acesso} onChange={handleChange} required />
        </div>
        <div>
          <label>Senha*</label>
          <input name="senha" type="password" value={form.senha} onChange={handleChange} required={!editando} />
        </div>
        <div>
          <label>Email*</label>
          <input name="email_aluno" type="email" value={form.email_aluno} onChange={handleChange} required />
        </div>
        <div>
          <label>Observação</label>
          <input name="observacao" value={form.observacao} onChange={handleChange} />
        </div>
        <button type="submit">{editando ? 'Atualizar' : 'Cadastrar'}</button>
        {editando && <button type="button" onClick={() => { setForm({ id_aluno: null, nome_completo: '', usuario_acesso: '', senha: '', email_aluno: '', observacao: '' }); setEditando(false); setMensagem(''); }}>Cancelar</button>}
      </form>
      <h2>Alunos Cadastrados</h2>
      <table className="tabela">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Usuário</th>
            <th>Email</th>
            <th>Observação</th>
            <th>Data Cadastro</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {alunos.length === 0 ? (
            <tr><td colSpan="6">Nenhum aluno cadastrado.</td></tr>
          ) : (
            alunos.map(aluno => (
              <tr key={aluno.id_aluno}>
                <td>{aluno.nome_completo}</td>
                <td>{aluno.usuario_acesso}</td>
                <td>{aluno.email_aluno}</td>
                <td>{aluno.observacao}</td>
                <td>{aluno.data_cadastro}</td>
                <td>
                  <button onClick={() => handleEdit(aluno)}>Editar</button>
                  <button onClick={() => handleDelete(aluno.id_aluno)} className="remover">Remover</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <p className="info">* Campos obrigatórios</p>
    </div>
  );
}

export default App;
