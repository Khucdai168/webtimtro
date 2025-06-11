document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
  
    if (searchButton) {
      searchButton.addEventListener('click', () => {
        const location = document.getElementById('locationInput')?.value.trim() || '';
        const price = document.getElementById('priceInput')?.value.trim() || '';
        const params = new URLSearchParams();
  
        if (location) params.append('location', location);
        if (price) params.append('price', price);
  
        // Tạo URL chuyển hướng với query string
        const targetUrl = `./nhatro.html${params.toString() ? '?' + params.toString() : ''}`;
        window.location.href = targetUrl;
      });
    }
  });
  