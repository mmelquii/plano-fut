const SHEET_URL = 'https://sheets.googleapis.com/v4/spreadsheets/1qCa_jR7kcCeGRBz4cx42a6NOJqfv_Au_Pu43so9UZHw/values/Sheet1?key=df60e1133329a30b1f37daa3b1369721402dee7b';
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
      price: isNaN(parseFloat(row[4])) ? 0 : parseFloat(row[4]),
      originalPrice: isNaN(parseFloat(row[5])) ? 0 : parseFloat(row[5]),
      stock: isNaN(parseInt(row[6])) ? 0 : parseInt(row[6]),
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
      ${team.stock <= 5 ? `<p class="text-red-600">Últimas ${team.stock} unidades!</p>` : ''}
      ${team.isOfficial ? `<p class="text-green-600">Camisa Oficial</p>` : ''}
      ${team.isBestSeller ? `<p class="text-yellow-600">Mais Vendida!</p>` : ''}
      <div class="flex items-center mt-2">
        <span class="text-yellow-500">★★★★☆</span>
        <span class="ml-2 text-gray-600">(120 avaliações)</span>
      </div>
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

// Iniciar o carrossel só uma vez
setInterval(nextSlide, 5000);

// Popup de email
setTimeout(() => document.getElementById('emailPopup').classList.remove('hidden'), 5000);

function closePopup() {
  document.getElementById('emailPopup').classList.add('hidden');
}

function submitEmail() {
  const email = document.getElementById('emailInput').value;
  alert(`Cupom enviado para ${email}!`);
  closePopup();
}

// Chatbot toggle
function toggleChatbot() { 
  const chatbot = document.getElementById('chatbot');
  chatbot.classList.toggle('hidden');
}

// Respostas do chatbot
function showAnswer(type) {
  const answer = document.getElementById('chatbotAnswer');
  if (type === 'frete') answer.textContent = 'Frete grátis para compras acima de R$200!';
  else if (type === 'pagamento') answer.textContent = 'Aceitamos Pix, MercadoPago e cartões!';
}

// Iniciar busca
fetchTeams();
