// Link curto de entrada: lupaiofertas.github.io/<tema>/ abre na hora o grupo daquele tema que ainda tem vaga.
// Usado na bio do Instagram, nos anúncios e nos reels. A lista de grupos é lida do index.html (uma fonte só)
// e a lotação vem de vagas.json, publicado pelo motor depois de cada envio. Se algo falhar, vai para a página inicial.
(function () {
  const CORTE = 950;
  const slug = document.documentElement.dataset.tema;
  const botao = document.getElementById("entrar");
  const ir = url => { botao.href = url; location.replace(url); };
  const pegar = (txt, nome) => { const m = txt.match(new RegExp("const " + nome + " = (.*?);\\n")); return m ? JSON.parse(m[1]) : null; };
  Promise.all([
    fetch("/", {cache: "no-store"}).then(r => r.text()),
    fetch("/vagas.json", {cache: "no-store"}).then(r => r.ok ? r.json() : {}).catch(() => ({}))
  ]).then(([html, vagas]) => {
    const geral = pegar(html, "GERAL"), nichos = pegar(html, "NICHOS") || [];
    const nicho = slug === "geral" ? geral : nichos.find(n => n.img === slug);
    if (!nicho || !nicho.grupos || !nicho.grupos.length) return ir("/#grupos");
    const lot = vagas[nicho.chave || nicho.nome] || {};
    const membros = g => Number(lot[g.n]) || 0;
    const g = nicho.grupos.find(g => membros(g) < CORTE) || nicho.grupos.reduce((a, b) => membros(b) < membros(a) ? b : a);
    ir(g.url);
  }).catch(() => ir("/#grupos"));
})();
