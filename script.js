let contatosFiltrados = [];

async function buscar() {
  const cidade = document.getElementById('cidade').value.toLowerCase();
  const res = await fetch('./data/banco.json');
  const dados = await res.json();

  const usados = JSON.parse(localStorage.getItem('numeros_usados') || '[]');

  contatosFiltrados = dados.filter(c =>
    c.cidade.toLowerCase() === cidade &&
    !usados.includes(c.numero)
  );

  const html = contatosFiltrados.map(c => `<p>${c.nome} - ${c.numero}</p>`).join('');
  document.getElementById('resultado').innerHTML = html;
}

function exportar() {
  if (!contatosFiltrados.length) return alert("Nenhum contato para exportar.");

  const usados = JSON.parse(localStorage.getItem('numeros_usados') || '[]');
  const novosNumeros = contatosFiltrados.map(c => c.numero);
  const novosUsados = [...new Set([...usados, ...novosNumeros])];
  localStorage.setItem('numeros_usados', JSON.stringify(novosUsados));

  const linhas = contatosFiltrados.map(c => [c.nome, c.numero]);
  const ws = XLSX.utils.aoa_to_sheet(linhas);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Contatos");
  XLSX.writeFile(wb, "contatos.xlsx");
}

function resetar() {
  localStorage.removeItem('numeros_usados');
  alert('Histórico apagado.');
}