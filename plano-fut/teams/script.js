function removeAcentos(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function renderTeams(filter = "") {
  container.innerHTML = "";
  const filtroNormalizado = removeAcentos(filter.toLowerCase());

  const filtered = times.filter(team => {
    const nomeNormalizado = removeAcentos(team.nome.toLowerCase());
    return nomeNormalizado.includes(filtroNormalizado);
  });

  filtered.forEach((team, index) => {
    const card = document.createElement("div");
    card.className = "team-card";

    // Aplica destaque dourado aos 3 primeiros
    if (index < 3) {
      card.classList.add("top-1");
    }

    const img = document.createElement("img");
    img.src = team.logo;
    img.alt = `Logo do ${team.nome}`;
    img.onerror = () => {
      img.remove();
      card.innerHTML += `<div class="team-name">${team.nome}</div>`;
    };

    const name = document.createElement("div");
    name.className = "team-name";
    name.textContent = team.nome;

    card.appendChild(img);
    card.appendChild(name);
    container.appendChild(card);
  });
}
