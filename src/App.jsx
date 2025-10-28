import React, { useEffect, useState } from "react";
import logo from "./assets/logo.png";
import picanhaImg from "./assets/picanha.png";
import alcatraImg from "./assets/alcatra.png";
import frangoImg from "./assets/frango.png";

export default function App() {
// produtos iniciais
const [produtos, setProdutos] = useState([
{
id: 1,
nome: "Picanha",
descricao: "Corte nobre e suculento, ideal para churrascos e grelhados.",
precoDe: 74.99,
precoPor: 69.99,
imagem: picanhaImg,
tipo: "primeira",
},
{
id: 2,
nome: "Alcatra",
descricao: "Carne macia e versátil, perfeita para bifes e assados.",
precoDe: 54.99,
precoPor: 49.99,
imagem: alcatraImg,
tipo: "primeira",
},
{
id: 3,
nome: "Frango Assado",
descricao: "Frango dourado e temperado, pronto para servir e saborear.",
precoDe: 44.99,
precoPor: 39.99,
imagem: frangoImg,
tipo: "segunda",
},
]);

const usuariosValidos = ["marcia", "kellisson", "teste"];
const [usuario, setUsuario] = useState(null);
const [loginData, setLoginData] = useState({ nome: "", senha: "" });
const [path, setPath] = useState(window.location.pathname || "/");
const [filtro, setFiltro] = useState("todos");

useEffect(() => {
const onPop = () => setPath(window.location.pathname);
window.addEventListener("popstate", onPop);
return () => window.removeEventListener("popstate", onPop);
}, []);

const navigate = (to) => {
if (window.location.pathname !== to) {
window.history.pushState({}, "", to);
setPath(to);
}
};

const handleLogin = (e) => {
e.preventDefault();
const nomeValido = usuariosValidos.includes(loginData.nome.toLowerCase());
const senhaValida = loginData.senha === "123";
if (nomeValido && senhaValida) {
setUsuario(loginData.nome);
setLoginData({ nome: "", senha: "" });
navigate("/admin");
alert("Login realizado com sucesso!");
} else {
alert("Usuário ou senha incorretos!");
}
};

const handleLogout = () => {
setUsuario(null);
navigate("/");
};

// Modal de produto
const [produtoModal, setProdutoModal] = useState(null);

// Admin
const [novoProduto, setNovoProduto] = useState({
nome: "",
descricao: "",
precoDe: "",
precoPor: "",
imagem: "",
tipo: "",
});
const [editando, setEditando] = useState(null);

const handleImagemUpload = (e) => {
const arquivo = e.target.files?.[0];
if (arquivo) {
const url = URL.createObjectURL(arquivo);
setNovoProduto((p) => ({ ...p, imagem: url }));
}
};

const handleSalvarProduto = (e) => {
e.preventDefault();
if (!novoProduto.nome || !novoProduto.precoPor) {
alert("Preencha pelo menos nome e preço atual.");
return;
}

if (editando) {
  setProdutos((prev) =>
    prev.map((p) =>
      p.id === editando
        ? {
            ...p,
            nome: novoProduto.nome,
            descricao: novoProduto.descricao,
            precoDe: parseFloat(novoProduto.precoDe || novoProduto.precoPor),
            precoPor: parseFloat(novoProduto.precoPor),
            imagem: novoProduto.imagem || p.imagem,
            tipo: novoProduto.tipo,
          }
        : p
    )
  );
  setEditando(null);
} else {
  const novo = {
    id: produtos.length ? Math.max(...produtos.map((p) => p.id)) + 1 : 1,
    nome: novoProduto.nome,
    descricao: novoProduto.descricao,
    precoDe: parseFloat(novoProduto.precoDe || novoProduto.precoPor),
    precoPor: parseFloat(novoProduto.precoPor),
    imagem: novoProduto.imagem || "",
    tipo: novoProduto.tipo || "primeira",
  };
  setProdutos((prev) => [...prev, novo]);
}

setNovoProduto({
  nome: "",
  descricao: "",
  precoDe: "",
  precoPor: "",
  imagem: "",
  tipo: "",
});


};

const handleEditarProduto = (id) => {
const prod = produtos.find((p) => p.id === id);
if (!prod) return;
setNovoProduto({
nome: prod.nome,
descricao: prod.descricao,
precoDe: prod.precoDe,
precoPor: prod.precoPor,
imagem: prod.imagem,
tipo: prod.tipo,
});
setEditando(id);
navigate("/admin");
};

const handleExcluirProduto = (id) => {
if (window.confirm("Deseja realmente excluir este produto?")) {
setProdutos((prev) => prev.filter((p) => p.id !== id));
}
};

// Páginas
const PaginaCatalogo = () => {
const produtosFiltrados =
filtro === "todos"
? produtos
: produtos.filter((p) => p.tipo === filtro);

return (
  <div className="container">
    {/* Botões de filtro */}
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "12px",
        marginBottom: "20px",
        flexWrap: "wrap",
      }}
    >
      <button
        className={`btn-filtro ${filtro === "todos" ? "active" : ""}`}
        onClick={() => setFiltro("todos")}
      >
        Todas
      </button>
      <button
        className={`btn-filtro ${filtro === "primeira" ? "active" : ""}`}
        onClick={() => setFiltro("primeira")}
      >
        Carnes de Primeira
      </button>
      <button
        className={`btn-filtro ${filtro === "segunda" ? "active" : ""}`}
        onClick={() => setFiltro("segunda")}
      >
        Carnes de Segunda
      </button>
    </div>

    {/* Lista de produtos */}
    <div className="produtos-grid">
      {produtosFiltrados.map((produto) => (
        <div className="produto" key={produto.id}>
          <img
            src={produto.imagem}
            alt={produto.nome}
            onClick={() => setProdutoModal(produto)}
            style={{ cursor: "pointer" }}
          />
          <h3>{produto.nome}</h3>
          <p className="descricao">{produto.descricao}</p>
          <p className="preco">
            <span className="preco-de">
              de R$ {produto.precoDe.toFixed(2)}
            </span>
            <br />
            <span className="preco-por">
              por R$ {produto.precoPor.toFixed(2)}
            </span>
          </p>
        </div>
      ))}
    </div>

    {produtoModal && (
      <div className="modal-overlay" onClick={() => setProdutoModal(null)}>
        <div
          className="modal-produto"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <button className="fechar" onClick={() => setProdutoModal(null)}>
            ✖
          </button>
          <img src={produtoModal.imagem} alt={produtoModal.nome} />
          <h3>{produtoModal.nome}</h3>
          <p className="preco">
            <span className="preco-de">
              de R$ {produtoModal.precoDe.toFixed(2)}
            </span>
            <br />
            <span className="preco-por">
              por R$ {produtoModal.precoPor.toFixed(2)}
            </span>
          </p>
          <p className="descricao">{produtoModal.descricao}</p>
        </div>
      </div>
    )}
  </div>
);


};

const PaginaLogin = () => (
  <div className="container">
    <div className="form-finalizacao login-box" style={{ maxWidth: 420, margin: "0 auto" }}>
      <h2>Login Admin</h2>

      <form onSubmit={handleLogin}>
        <label>Usuário</label>
        <input
          type="text"
          value={loginData.nome}
          onChange={(e) => setLoginData((d) => ({ ...d, nome: e.target.value }))}
        />

        <label>Senha</label>
        <input
          type="password"
          value={loginData.senha}
          onChange={(e) => setLoginData((d) => ({ ...d, senha: e.target.value }))}
        />

        <div className="btn-row">
          <button type="submit" className="btn-finalizar">
            Entrar
          </button>
          <button
            type="button"
            className="btn-voltar"
            onClick={() => navigate("/")}
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  </div>
);


const PaginaAdmin = () => {
if (!usuario) {
useEffect(() => {
navigate("/login");
}, []);
return null;
}

return (
  <div className="container">
    <div style={{ width: "100%", maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ color: "rgb(123,0,0)", textAlign: "center" }}>
        Painel de Gerenciamento
      </h2>

      <form onSubmit={handleSalvarProduto} className="form-finalizacao">
        <label>Nome</label>
        <input
          type="text"
          value={novoProduto.nome}
          onChange={(e) =>
            setNovoProduto((p) => ({ ...p, nome: e.target.value }))
          }
        />
        <label>Descrição</label>
        <input
          type="text"
          value={novoProduto.descricao}
          onChange={(e) =>
            setNovoProduto((p) => ({ ...p, descricao: e.target.value }))
          }
        />
        <label>Preço De</label>
        <input
          type="number"
          step="0.01"
          value={novoProduto.precoDe}
          onChange={(e) =>
            setNovoProduto((p) => ({ ...p, precoDe: e.target.value }))
          }
        />
        <label>Preço Por</label>
        <input
          type="number"
          step="0.01"
          value={novoProduto.precoPor}
          onChange={(e) =>
            setNovoProduto((p) => ({ ...p, precoPor: e.target.value }))
          }
        />
        <label>Tipo da Carne</label>
        <select
          value={novoProduto.tipo}
          onChange={(e) =>
            setNovoProduto((p) => ({ ...p, tipo: e.target.value }))
          }
        >
          <option value="">Selecione...</option>
          <option value="primeira">Carne de Primeira</option>
          <option value="segunda">Carne de Segunda</option>
        </select>
        <label>Imagem</label>
        <input type="file" accept="image/*" onChange={handleImagemUpload} />
        {novoProduto.imagem && (
          <img
            src={novoProduto.imagem}
            alt="preview"
            style={{
              width: 140,
              height: 100,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        )}
        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" className="btn-finalizar" style={{ flex: 1 }}>
            {editando ? "Salvar Alterações" : "Adicionar Produto"}
          </button>
          <button
            type="button"
            className="btn-voltar"
            onClick={() => {
              setNovoProduto({
                nome: "",
                descricao: "",
                precoDe: "",
                precoPor: "",
                imagem: "",
                tipo: "",
              });
              setEditando(null);
            }}
            style={{ flex: 1 }}
          >
            Limpar
          </button>
        </div>
      </form>

      <h3 style={{ marginTop: 18 }}>Produtos Cadastrados</h3>
      <div style={{ display: "grid", gap: 10 }}>
        {produtos.map((p) => (
          <div key={p.id} className="carrinho-item">
            <img src={p.imagem} alt={p.nome} />
            <div className="carrinho-info">
              <h4>{p.nome}</h4>
              <p>
                de R$ {p.precoDe.toFixed(2)} por R$ {p.precoPor.toFixed(2)}
              </p>
              <small>Tipo: {p.tipo}</small>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => handleEditarProduto(p.id)}>✏️</button>
              <button onClick={() => handleExcluirProduto(p.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          marginTop: 18,
        }}
      >
        <button className="btn-voltar" onClick={() => navigate("/")}>
          Ver Catálogo
        </button>
        <button className="btn-finalizar" onClick={handleLogout}>
          Sair ({usuario})
        </button>
      </div>
    </div>
  </div>
);


};

return (
<div className="app">
<header>
<nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
<button onClick={() => navigate("/")}>Catálogo</button>
{usuario && (
<button onClick={() => navigate("/admin")}>Painel Admin</button>
)}
</nav>
<img src={logo} alt="Logo" className="logo-direita" />
</header>

  <main style={{ flex: 1 }}>
    {path === "/" && <PaginaCatalogo />}
    {path === "/login" && <PaginaLogin />}
    {path === "/admin" && <PaginaAdmin />}
  </main>

  <footer>
    <p style={{ fontSize: 12, margin: 4 }}>
      <span
        className="login-text"
        onClick={() => navigate("/login")}
        style={{ fontSize: 12 }}
      >
        Login (Admin)
      </span>
    </p>
    {usuario ? (
      <p style={{ fontSize: 12 }}>
        Logado como <strong>{usuario}</strong>
      </p>
    ) : (
      <p style={{ fontSize: 12, opacity: 0.9 }}>Área pública — catálogo</p>
    )}
  </footer>
</div>


);
}