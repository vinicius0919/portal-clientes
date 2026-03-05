let debitosSelecionados = []
let valorTotalSelecionado = 0
let valorCreditoUsado = 0

const debitos = [
  { nota: 1001, valor: 1500, vencimento: "10/03/2026" },
  { nota: 1002, valor: 850, vencimento: "15/03/2026" },
  { nota: 1003, valor: 2300, vencimento: "20/03/2026" },
];

const pagamentos = [
  { id: 1, valor: 1500, status: "finalizado", data: "02/03/2026" },
  { id: 2, valor: 850, status: "processando", data: "03/03/2026" },
  { id: 3, valor: 500, status: "cancelado", data: "01/03/2026" },
];

let credito = 420.5;

function login() {
  document.getElementById("login").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");

  carregarDebitos();
  carregarPagamentos();

  document.getElementById("saldoCredito").innerText =
    "Saldo disponível: R$ " + credito.toFixed(2);
}

function logout() {
  location.reload();
}

function mostrarCadastro() {
  document.getElementById("login").classList.add("hidden");
  document.getElementById("cadastro").classList.remove("hidden");
}

function voltarLogin() {
  document.getElementById("cadastro").classList.add("hidden");
  document.getElementById("login").classList.remove("hidden");
}

function cadastrar() {
  document.getElementById("msgCadastro").innerText =
    "Cadastro enviado para aprovação do setor responsável.";
}

function abrirTela(id) {
  document.querySelectorAll(".tela").forEach((t) => t.classList.add("hidden"));

  document.getElementById(id).classList.remove("hidden");
}

function carregarDebitos() {
  const tbody = document.getElementById("listaDebitos");
  tbody.innerHTML = "";

  debitos.forEach((d, i) => {
    tbody.innerHTML += `
<tr>
<td><input type="checkbox" value="${d.valor}"></td>
<td>${d.nota}</td>
<td>R$ ${d.valor}</td>
<td>${d.vencimento}</td>
</tr>
`;
  });
}

function gerarPagamento(){

let total = 0
debitosSelecionados = []

document.querySelectorAll("#listaDebitos input:checked")
.forEach((c,i)=>{

let linha = c.closest("tr")
let nota = linha.children[1].innerText
let valor = Number(c.value)

total += valor

debitosSelecionados.push({
nota,
valor
})

})

if(total === 0){
alert("Selecione ao menos um débito")
return
}

valorTotalSelecionado = total

document.getElementById("valorPagamento").innerText =
"Valor das notas selecionadas: R$ " + total.toFixed(2)

document.getElementById("creditoDisponivel").innerText =
credito.toFixed(2)

document.getElementById("valorFinal").innerText =
"Valor final: R$ " + total.toFixed(2)

document.getElementById("modalPagamento").classList.remove("hidden")

QRCode.toCanvas(
document.getElementById("qrcode"),
"PIX-DEMO-"+total
)

}
function toggleCredito(){

const area = document.getElementById("areaCredito")

if(document.getElementById("usarCredito").checked){

area.classList.remove("hidden")

}else{

area.classList.add("hidden")
valorCreditoUsado = 0
recalcularPagamento()

}

}

function recalcularPagamento(){

let creditoInput = Number(document.getElementById("valorCreditoUsado").value)

if(creditoInput > credito){
creditoInput = credito
}

if(creditoInput > valorTotalSelecionado){
creditoInput = valorTotalSelecionado
}

valorCreditoUsado = creditoInput

let valorFinal = valorTotalSelecionado - valorCreditoUsado

document.getElementById("valorFinal").innerText =
"Valor final: R$ " + valorFinal.toFixed(2)

QRCode.toCanvas(
document.getElementById("qrcode"),
"PIX-DEMO-"+valorFinal
)

}
function confirmarPagamento(){

let valorFinal = valorTotalSelecionado - valorCreditoUsado

credito -= valorCreditoUsado

pagamentos.push({
id: pagamentos.length + 1,
valor: valorFinal,
status: "processando",
data: new Date().toLocaleDateString()
})

debitosSelecionados.forEach(d=>{

const index = debitos.findIndex(x => x.nota == d.nota)

if(index !== -1){
debitos.splice(index,1)
}

})

carregarDebitos()
carregarPagamentos()

document.getElementById("saldoCredito").innerText =
"Saldo disponível: R$ " + credito.toFixed(2)

fecharModal()

}
function fecharModal() {
  console.log("Executando");
  document.getElementById("modalPagamento").classList.add("hidden")
  console.log(document.getElementById("modalPagamento"))
}

function carregarPagamentos() {
  const tbody = document.getElementById("listaPagamentos");
  tbody.innerHTML = "";

  pagamentos.forEach((p) => {
    tbody.innerHTML += `
<tr>
<td>${p.id}</td>
<td>R$ ${p.valor}</td>
<td>${p.status}</td>
<td>${p.data}</td>
</tr>
`;
  });
}

function filtrarPagamentos() {
  let filtro = document.getElementById("filtroStatus").value;

  const tbody = document.getElementById("listaPagamentos");
  tbody.innerHTML = "";

  pagamentos
    .filter((p) => filtro === "todos" || p.status === filtro)
    .forEach((p) => {
      tbody.innerHTML += `
<tr>
<td>${p.id}</td>
<td>R$ ${p.valor}</td>
<td>${p.status}</td>
<td>${p.data}</td>
</tr>
`;
    });
}
