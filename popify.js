const artistas = [
    { nome: "Ed Sheeran", id: "6eUKZXaKkcviH0Ku9w2n3V" },
    { nome: "Queen", id: "1dfeR4HaWDbWqFHLkxsg1d" },
    { nome: "Ariana Grande", id: "66CXWjxzNUsdJxJ2JdwvnR" },
    { nome: "Maroon 5", id: "04gDigrS5kc9YWfZHwBETP" },
    { nome: "Imagine Dragons", id: "53XhwfbYqKCa1cC15pYq2q" },
    { nome: "Eminem", id: "7dGJo4pcD2V6oG8kP0tJRR" },
    { nome: "Lady Gaga", id: "1HY2Jd0NmPuamShAr6KMms" },
    { nome: "Cold Play", id: "4gzpq5DPGxSnKTe4SA8HAU" },
    { nome: "Beyonce", id: "6vWDO969PvNqNYHIOW5v0m" },
    { nome: "Bruno Mars", id: "0du5cEVh5yTK9QJze8zA0C" },
    { nome: "Rihanna", id: "5pKCCKE2ajJHZ9KAiaK11H" },
    { nome: "Shakira", id: "0EmeFodog0BfCgMzAIvKQp" },
    { nome: "Justin Bieber", id: "1uNFoZAHBGtllmzznpCI3s" },
    { nome: "Demi Lovato", id: "6S2OmqARrzebs0tKUEyXyp" },
    { nome: "Taylor Swift", id: "06HL4z0CvFAxyc27GXpf02" }
  ];

  const clienteId = '80e193451ea14465ad156b9547c0b1cb';
  const clienteSecret = 'e2aba0984a54437eb9c954a64a333f3e';

  async function obterToken() {
    const resposta = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(clienteId + ':' + clienteSecret)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    const dados = await resposta.json();
    return dados.access_token;
  }

  async function obterDadosArtista(tokenAcesso, idArtista) {
    const resposta = await fetch(`https://api.spotify.com/v1/artists/${idArtista}`, {
      headers: { 'Authorization': `Bearer ${tokenAcesso}` }
    });
    const dados = await resposta.json();
    return dados;
  }

  async function processarArtistas() {
    const token = await obterToken();
    let artistasPop = [];
    let contagemGeneros = {};

    for (const artista of artistas) {
      const dados = await obterDadosArtista(token, artista.id);

      if (dados.genres.includes('pop')) {
        artistasPop.push({
          nome: artista.nome,
          seguidores: dados.followers.total,
          popularidade: dados.popularity
        });
      }

      dados.genres.forEach(genero => {
        if (!contagemGeneros[genero]) contagemGeneros[genero] = 0;
        contagemGeneros[genero]++;
      });
    }

    artistasPop.sort((a, b) => b.seguidores - a.seguidores);

    const rankingGeneros = Object.keys(contagemGeneros)
      .sort((a, b) => contagemGeneros[b] - contagemGeneros[a])
      .slice(0, 5);

    return { artistasPop, rankingGeneros };
  }

  function exibirDados(dados) {
    const listaArtistasPop = document.getElementById('artistasPop').querySelector('ul');
    const listaGenerosTop = document.getElementById('generosTop').querySelector('ul');

    dados.artistasPop.forEach(artista => {
      const li = document.createElement('li');
      li.textContent = `${artista.nome} - ${artista.seguidores} seguidores`;
      listaArtistasPop.appendChild(li);
    });

    dados.rankingGeneros.forEach(genero => {
      const li = document.createElement('li');
      li.textContent = genero;
      listaGenerosTop.appendChild(li);
    });
  }

  processarArtistas().then(dados => exibirDados(dados));