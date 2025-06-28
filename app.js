const gallery = document.getElementById('gallery');
const refreshBtn = document.getElementById('refreshBtn');
const breedSelect = document.getElementById('breedSelect');
const breedFilter = document.getElementById('breedFilter');

let currentUrls = [];
let allBreeds = [];

// Fetch all breeds list once
async function loadBreedsList() {
  const resp = await fetch('https://dog.ceo/api/breeds/list/all');
  const data = await resp.json();
  if (data.status === 'success') {
    allBreeds = Object.keys(data.message);
    populateBreedDropdown(allBreeds);
  } else {
    console.error('Failed to load breeds list');
  }
}

function populateBreedDropdown(breeds) {
  breeds.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b;
    opt.textContent = b;
    breedSelect.appendChild(opt);
  });
}

async function fetchDogImages(count = 5, breed = '') {
  const url = breed
    ? `https://dog.ceo/api/breed/${breed}/images/random/${count}`
    : `https://dog.ceo/api/breeds/image/random/${count}`;
  const resp = await fetch(url);
  const json = await resp.json();
  return json.status === 'success' ? json.message : [];
}

function showImages(urls) {
  const textFilter = breedFilter.value.trim().toLowerCase();
  gallery.innerHTML = '';

  const filtered = urls.filter(url => {
    if (!textFilter) return true;
    const breedPart = url.split('/')[4] || '';
    return breedPart.includes(textFilter);
  });

  if (!filtered.length) {
    gallery.innerHTML = `<p>No images match filter '<strong>${textFilter}</strong>'.</p>`;
    return;
  }

  filtered.forEach(url => {
    const img = document.createElement('img');
    img.src = url;
    img.alt = url.split('/')[4] || 'dog';
    gallery.appendChild(img);
  });
}

async function loadAndRender() {
  const breed = breedSelect.value;
  currentUrls = await fetchDogImages(5, breed);
  showImages(currentUrls);
}

// Event listeners
refreshBtn.addEventListener('click', loadAndRender);
breedSelect.addEventListener('change', loadAndRender);
breedFilter.addEventListener('input', () => showImages(currentUrls));

// Initialization
loadBreedsList()
  .then(loadAndRender)
  .catch(console.error);
