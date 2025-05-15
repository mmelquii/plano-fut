const SHEET_URL = 'https://sheets.googleapis.com/v4/spreadsheets/1qCa_jR7kcCeGRBz4cx42a6NOJqfv_Au_Pu43so9UZHw/values/Sheet1?key=AIzaSyBOEDIUdON70G7lprB-25EhMnTxCnz55IY';

let teams = [];
let currentSlide = 0;

async function fetchTeams() {
  try {
    const response = await fetch(SHEET_URL);
    if (!response.ok) throw new Error('Erro ao buscar dados da planilha');
    const data = await response.json();
    teams = data.values.slice(1).map(row => ({
      name: row[0] || '',
      logo: row[1] || '',
      jerseyName: row[2] || '',
      jerseyImage: row[3] || '',
      price: parseFloat(row[4]) || 0,
      originalPrice: parseFloat(row[5]) || 0,
      stock: parseInt(row[6]) || 0,
      isOfficial: row[7] === 'Yes',
      isBestSeller: row[8] === 'Yes',
      productPage: row[9] || ''
    }));
    renderCarousel();
    renderProducts();
  } catch (error) {
    console.error('Erro:', error);
  }
}

function renderCarousel() {
  const carousel = document.getElementById('carousel');
  carousel.innerHTML = teams.slice(0, 5).map((team, index) => `
    <div class="carousel-item ${index === 0 ? 'active' : ''}">
      <a href="${team.productPage}" class="block text-center">
        <img src="${team.logo}" alt="Logo ${team.name}" class="mx-auto h-32 hover-scale" loading="lazy" onerror="this.src='https://via.placeholder.com/150';">
        <h3 class="text-xl font-bold text-red-600 mt-4">${team.name}</h3>
      </a>
    </div>
  `).join('');
}

function renderProducts() {
  const products = document.getElementById('products');
  products.innerHTML = teams.map(team => `
    <div class="bg-white p-4 rounded-lg shadow hover-scale">
      <img src="${team.jerseyImage}" alt="${team.jerseyName} - Camisa do ${team.name}" class="w-full h-48 object-contain" loading="lazy" onerror="this.src='https://via.placeholder.com/150';">
      <h3 class="text-lg font-bold">${team.jerseyName}</h3>
      <p class="text-gray-600 line-through">R$${team.originalPrice.toFixed(2)}</p>
      <p class="text-red-600 font-bold text-xl">R$${team.price.toFixed(2)}</p>
      ${team.stock <= 5 && team.stock > 0 ? `<p class="text-red-600">Últimas ${team.stock} unidades!</p>` : ''}
      ${team.isOfficial ? `<p class="text-green-600">Camisa Oficial</p>` : ''}
      ${team.isBestSeller ? `<p class="text-yellow-600">Mais Vendida!</p>` : ''}
      <a href="${team.productPage}" class="block mt-4 bg-red-600 text-white text-center py-2 rounded hover:bg-red-700">Garanta agora!</a>
    </div>
  `).join('');
}

function prevSlide() {
  const items = document.querySelectorAll('.carousel-item');
  items[currentSlide].classList.remove('active');
  currentSlide = (currentSlide - 1 + items.length) % items.length;
  items[currentSlide].classList.add('active');
}

function nextSlide() {
  const items = document.querySelectorAll('.carousel-item');
  items[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % items.length;
  items[currentSlide].classList.add('active');
}

setInterval(nextSlide, 5000);

fetchTeams();
