document.addEventListener('DOMContentLoaded', function () {
    // Contenedores principales
    const productsContainer = document.getElementById('products-container');
    const categoryFiltersContainer = document.getElementById('category-filters');
    const featuredCategoriesContainer = document.getElementById('featured-categories');
    const offersContainer = document.getElementById('offers-container');
    const searchInput = document.getElementById('search-input');
    const categoryTitle = document.getElementById('category-title');
    const categoryCounter = document.getElementById('category-counter');
    let products = [];
    let filteredProducts = [];

    const categoriasDestacadas = ["Cintas", "Neon", "Acrilicos", "Wall Panel"];

    // Mapeo de categorías a imágenes para index.html
    const categoryImages = {
        "Cintas": "images/categorias/CINTACB.jpg",
        "Neon": "images/categorias/NEON.jpg",
        "Acrilicos": "images/categorias/ACRILICO.jpg",
        "Wall Panel": "images/categorias/WALLP.jpg"
    };

    // Función para generar las estrellas de calificación
    function generarEstrellas(rating) {
        const totalEstrellas = 5;
        let estrellasHTML = '';

        for (let i = 1; i <= totalEstrellas; i++) {
            if (i <= Math.floor(rating)) {
                estrellasHTML += '<i class="fa fa-star text-warning"></i> ';
            } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
                estrellasHTML += '<i class="fa fa-star-half-o text-warning"></i> ';
            } else {
                estrellasHTML += '<i class="fa fa-star-o text-warning"></i> ';
            }
        }

        return estrellasHTML;
    }


    // Función para renderizar productos
    function renderProducts(productsToRender, category = 'Todos', max = null) {
        console.log(`Rendering products for category: ${category}`);
        if (!productsContainer) {
            console.error('Contenedor de productos no encontrado.');
            return;
        }
        productsContainer.innerHTML = '';
        let productosAMostrar = productsToRender;

        if (max !== null) {
            productosAMostrar = productsToRender.slice(0, max);
        }

        const row = document.createElement('div');
        row.classList.add('row');

        productosAMostrar.forEach(product => {
            try {
                const precio = product.Precio ? parseFloat(product.Precio.replace('S/', '')) : 0;
                const precioOferta = product.PrecioOferta ? parseFloat(product.PrecioOferta.replace('S/', '')) : null;
                const imagePath = product.image ? product.image : 'images/imagen-no-disponible.jpg';

                const col = document.createElement('div');
                col.classList.add('col-md-4', 'mb-4');

                const card = document.createElement('div');
                card.classList.add('card', 'h-100', 'product-card');
                card.style.cursor = 'pointer';

                const img = document.createElement('img');
                img.src = imagePath;
                img.classList.add('card-img-top', 'img-fluid');
                img.alt = product.Producto;
                img.onerror = function () {
                    this.src = 'images/imagen-no-disponible.jpg';
                };

                const cardBody = document.createElement('div');
                cardBody.classList.add('card-body', 'd-flex', 'flex-column');

                const title = document.createElement('h5');
                title.classList.add('card-title');
                title.textContent = product.Producto;

                const rating = document.createElement('div');
                rating.classList.add('mb-2');
                rating.innerHTML = generarEstrellas(product.rating);

                const precioContainer = document.createElement('div');
                if (precioOferta) {
                    const precioOriginal = document.createElement('p');
                    precioOriginal.classList.add('text-muted', 'text-decoration-line-through');
                    precioOriginal.textContent = `S/ ${precio.toFixed(2)}`;

                    const precioNuevo = document.createElement('p');
                    precioNuevo.classList.add('text-danger');
                    precioNuevo.textContent = `S/ ${precioOferta.toFixed(2)}`;

                    precioContainer.appendChild(precioOriginal);
                    precioContainer.appendChild(precioNuevo);
                } else {
                    const precioTexto = document.createElement('p');
                    precioTexto.classList.add('text-dark');
                    precioTexto.textContent = `S/ ${precio.toFixed(2)}`;
                    precioContainer.appendChild(precioTexto);
                }

                const whatsappBtn = document.createElement('a');
                whatsappBtn.href = "https://wa.link/ggb69o";
                whatsappBtn.target = "_blank";
                whatsappBtn.classList.add('btn', 'btn-primary', 'mt-auto');
                whatsappBtn.textContent = 'Consultar en WhatsApp';

                // Ensamblar la tarjeta
                cardBody.appendChild(title);
                cardBody.appendChild(rating);
                cardBody.appendChild(precioContainer);
                cardBody.appendChild(whatsappBtn);
                card.appendChild(img);
                card.appendChild(cardBody);
                col.appendChild(card);
                row.appendChild(col);

                // Dentro de load_products.js
                card.addEventListener('click', (e) => {
                    // Evitar que el clic en el botón de WhatsApp redirija
                    if (!e.target.closest('a')) {
                        window.location.href = `product_detail.html?Codigo=${product.Codigo}`;
                    }
                });

            } catch (error) {
                console.error(`Error al renderizar el producto ${product.Producto}:`, error);
            }
        });

        productsContainer.appendChild(row);

        // Agregar botón para ver más productos solo si estamos en products.html y hay más productos
        if (max !== null && productsToRender.length > max && isProductsPage()) {
            const viewMoreButton = document.createElement('div');
            viewMoreButton.classList.add('text-center', 'mt-4');

            const button = document.createElement('button');
            button.innerText = 'Ver más productos';
            button.classList.add('btn', 'btn-secondary', 'btn-lg', 'rounded-pill'); // Diseño actualizado para el botón
            button.addEventListener('click', () => {
                window.location.href = 'products.html';
            });

            viewMoreButton.appendChild(button);
            productsContainer.appendChild(viewMoreButton);
        }

        // Actualizar el contador y el título solo si estamos en products.html
        if (isProductsPage()) {
            updateCounter(category, productsToRender.length);
            updateCategoryTitle(category);
        }
    }
    // Función para actualizar el contador
    function updateCounter(category, count) {
        if (categoryCounter) {
            categoryCounter.innerHTML = `
                <div class="card text-center">
                    <div class="card-body bg-info text-white">
                        <h5 class="card-title">Categoría: ${category}</h5>
                        <p class="card-text">Total: <strong>${count}</strong> producto${count !== 1 ? 's' : ''}</p>
                    </div>
                </div>
            `;
        }
    }

    // Función para actualizar el título de la categoría
    function updateCategoryTitle(category) {
        if (categoryTitle) {
            categoryTitle.innerHTML = `
                <h2 class="mb-4">Categoría: <span class="text-primary">${category}</span></h2>
            `;
        }
    }

               // Función para renderizar ofertas
        function renderOffers(offersToRender, max = 3) {
            console.log('Rendering offers...');
            if (!offersContainer) {
                console.error('Contenedor de ofertas no encontrado.');
                return;
            }
            offersContainer.innerHTML = '';
        
            const row = document.createElement('div');
            row.classList.add('row');
        
            let offersToShow = offersToRender.slice(0, max);
        
            console.log(`Renderizando ${offersToShow.length} ofertas.`);
        
            if (offersToShow.length === 0) {
                const noOffersMessage = document.createElement('div');
                noOffersMessage.classList.add('text-center', 'mt-4');
        
                const noOffersImage = document.createElement('img');
                noOffersImage.src = 'images/ESTAMOS PREPARANDO OFERTAS.png'; // Reemplaza con la ruta de tu imagen
                noOffersImage.alt = 'Estamos preparando las mejores ofertas para ti';
                noOffersImage.classList.add('img-fluid');
        
                noOffersMessage.appendChild(noOffersImage);
                offersContainer.appendChild(noOffersMessage);
                return;
            }
        
            offersToShow.forEach(product => {
                try {
                    const precioOriginal = product.Precio ? parseFloat(product.Precio.replace('S/', '')) : 0;
                    const precioOferta = product.PrecioOferta ? parseFloat(product.PrecioOferta.replace('S/', '')) : precioOriginal;
                    const imagePath = product.image ? product.image : 'images/imagen-no-disponible.jpg';
        
                    const col = document.createElement('div');
                    col.classList.add('col-md-4', 'mb-4');
        
                    const card = document.createElement('div');
                    card.classList.add('card', 'h-100', 'oferta-card');
                    card.style.cursor = 'pointer';
        
                    const imgContainer = document.createElement('div');
                    imgContainer.classList.add('position-relative');
        
                    const img = document.createElement('img');
                    img.src = imagePath;
                    img.classList.add('card-img-top', 'img-fluid');
                    img.alt = product.Producto;
                    img.onerror = function () {
                        this.src = 'images/imagen-no-disponible.jpg';
                    };
        
                    const badge = document.createElement('span');
                    badge.classList.add('badge', 'bg-danger', 'position-absolute', 'top-0', 'end-0', 'm-2');
                    badge.textContent = 'Oferta';
        
                    imgContainer.appendChild(img);
                    imgContainer.appendChild(badge);
        
                    const cardBody = document.createElement('div');
                    cardBody.classList.add('card-body', 'd-flex', 'flex-column');
        
                    const title = document.createElement('h5');
                    title.classList.add('card-title');
                    title.textContent = product.Producto;
        
                    const rating = document.createElement('div');
                    rating.classList.add('mb-2');
                    rating.innerHTML = generarEstrellas(product.rating);
        
                    const precioOriginalP = document.createElement('p');
                    precioOriginalP.classList.add('text-muted', 'text-decoration-line-through');
                    precioOriginalP.textContent = `S/ ${precioOriginal.toFixed(2)}`;
        
                    const precioOfertaP = document.createElement('p');
                    precioOfertaP.classList.add('text-danger');
                    precioOfertaP.textContent = `S/ ${precioOferta.toFixed(2)}`;
        
                    const whatsappBtn = document.createElement('a');
                    whatsappBtn.href = "https://wa.link/ggb69o";
                    whatsappBtn.target = "_blank";
                    whatsappBtn.classList.add('btn', 'btn-primary', 'mt-auto');
                    whatsappBtn.textContent = 'Consultar en WhatsApp';
        
                    // Ensamblar la tarjeta
                    cardBody.appendChild(title);
                    cardBody.appendChild(rating);
                    cardBody.appendChild(precioOriginalP);
                    cardBody.appendChild(precioOfertaP);
                    cardBody.appendChild(whatsappBtn);
                    card.appendChild(imgContainer);
                    card.appendChild(cardBody);
                    col.appendChild(card);
                    row.appendChild(col);
        
                    // Listener para abrir detalle del producto
                    card.addEventListener('click', (e) => {
                        // Evitar que el clic en el botón de WhatsApp redirija
                        if (!e.target.closest('a')) {
                            window.location.href = `product_detail.html?Codigo=${encodeURIComponent(product.Codigo)}`;
                        }
                    });
        
                } catch (error) {
                    console.error(`Error al renderizar la oferta para el producto ${product.Producto}:`, error);
                }
            });
        
            offersContainer.appendChild(row);
        }
    // Función para renderizar categorías destacadas
    function renderFeaturedCategories() {
        console.log('Rendering featured categories...');
        if (!featuredCategoriesContainer) {
            console.error('Contenedor de categorías destacadas no encontrado.');
            return;
        }
        featuredCategoriesContainer.innerHTML = '';

        const row = document.createElement('div');
        row.classList.add('row');

        categoriasDestacadas.forEach(categoria => {
            const col = document.createElement('div');
            col.classList.add('col-md-3', 'mb-4');

            const card = document.createElement('div');
            card.classList.add('card', 'h-100', 'text-white', 'position-relative', 'category-card');
            card.style.cursor = 'pointer';

            const img = document.createElement('img');
            img.src = categoryImages[categoria] || 'images/categorias/default.jpg';
            img.classList.add('card-img-top', 'img-fluid');
            img.alt = categoria;
            img.onerror = function () {
                this.src = 'images/categorias/default.jpg';
            };

            const overlay = document.createElement('div');
            overlay.classList.add('card-img-overlay', 'd-flex', 'align-items-center', 'justify-content-center', 'bg-dark', 'bg-opacity-50');
            const title = document.createElement('h5');
            title.classList.add('card-title');
            title.textContent = categoria;

            overlay.appendChild(title);
            card.appendChild(img);
            card.appendChild(overlay);
            col.appendChild(card);
            row.appendChild(col);

            // Listener para manejar el clic
            card.addEventListener('click', function () {
                // Guardar la categoría seleccionada en localStorage
                localStorage.setItem('selectedCategory', categoria);
                window.location.href = `products.html`;
            });
        });

        featuredCategoriesContainer.appendChild(row);
    }

    // Función para obtener categorías únicas
    function getUniqueCategories(products) {
        const categorias = products.map(product => product.Categoria);
        return [...new Set(categorias)];
    }

    // Función para crear los filtros de categorías
    function createCategoryFilters(categories) {
        console.log('Creating category filters...');
        if (!categoryFiltersContainer) {
            console.error('Contenedor de filtros de categoría no encontrado.');
            return;
        }
        categoryFiltersContainer.innerHTML = '';

        // Añadir clases de Bootstrap para flexbox y espaciado
        categoryFiltersContainer.classList.add('d-flex', 'flex-wrap', 'justify-content-center', 'gap-2');

        // Botón "Todos"
        const allButton = document.createElement('button');
        allButton.innerText = 'Todos';
        allButton.className = 'btn btn-outline-success filter-btn active rounded-pill';
        allButton.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            allButton.classList.add('active');
            filteredProducts = products;
            renderProducts(filteredProducts, 'Todos');
        });
        categoryFiltersContainer.appendChild(allButton);

        // Botones para cada categoría
        categories.forEach(categoria => {
            const button = document.createElement('button');
            button.innerText = categoria;
            button.className = 'btn btn-outline-success filter-btn rounded-pill';
            button.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                let filtered;
                if (categoria === 'Ofertas') {
                    filtered = products.filter(product => product.Onsale === true && product.PrecioOferta);
                } else {
                    filtered = products.filter(product => product.Categoria === categoria);
                }
                filteredProducts = filtered;
                renderProducts(filteredProducts, categoria);
            });
            categoryFiltersContainer.appendChild(button);
        });
    }

    // Función para manejar la búsqueda
    function handleSearch() {
        console.log('Handling search...');
        const query = searchInput.value.toLowerCase().trim();
        console.log(`Búsqueda: "${query}"`);

        if (query === "") {
            console.log('Query vacío, mostrando todos los productos.');
            filteredProducts = products;
        } else {
            const resultados = products.filter(producto =>
                producto.Producto.toLowerCase().includes(query) ||
                (producto.Descripcion && producto.Descripcion.toLowerCase().includes(query))
            );
            console.log('Resultados filtrados:', resultados);
            filteredProducts = resultados;
        }

        renderProducts(filteredProducts, 'Resultados de búsqueda');
    }

    // Configurar la búsqueda
    function setupSearch() {
        if (searchInput && isProductsPage()) {
            searchInput.addEventListener('input', handleSearch);
            console.log('Event listener para búsqueda añadido.');
        } else {
            console.error('Campo de búsqueda no encontrado o no estamos en products.html.');
        }
    }

    // Función para cargar productos desde products.json
    function fetchProducts() {
        console.log('Iniciando la solicitud fetch para productos...');
        fetch('products.json')
            .then(response => {
                console.log('Respuesta recibida:', response);
                if (!response.ok) {
                    throw new Error('Error en la respuesta de la red');
                }
                return response.json();
            })
            .then(data => {
                console.log('Datos de productos obtenidos:', data);
                products = data.productos || data;
                console.log('Productos asignados:', products);
                filteredProducts = products;

                if (isIndexPage()) {
                    console.log('Es la página de inicio.');
                    const offers = products.filter(product => product.Onsale === true && product.PrecioOferta);
                    console.log('Productos en oferta:', offers);
                    renderOffers(offers);

                    const mainProducts = products.filter(product => product.Onsale !== true);
                    console.log('Productos principales:', mainProducts);
                    renderProducts(mainProducts.slice(0, 9), 'Todos');

                    // Renderizar categorías en index.html
                    renderFeaturedCategories();
                } else if (isProductsPage()) {
                    console.log('Es la página de productos.');
                    const uniqueCategories = getUniqueCategories(products);
                    console.log('Categorías únicas:', uniqueCategories);
                    createCategoryFilters(uniqueCategories);
                    renderProducts(filteredProducts, 'Todos');

                    const selectedCategory = localStorage.getItem('selectedCategory');
                    if (selectedCategory) {
                        console.log(`Categoría seleccionada desde localStorage: ${selectedCategory}`);
                        const button = Array.from(categoryFiltersContainer.querySelectorAll('.filter-btn'))
                            .find(btn => btn.innerText.toLowerCase() === selectedCategory.toLowerCase());

                        if (button) {
                            button.click();
                            localStorage.removeItem('selectedCategory');
                        }
                    }

                    // Renderizar categorías destacadas en products.html
                    renderFeaturedCategories();
                }

                // Configurar la búsqueda después de cargar los productos
                setupSearch();
            })
            .catch(error => {
                console.error('Error al cargar los productos:', error);
                mostrarError();
            });
    }

    // Función para mostrar mensajes de error
    function mostrarError() {
        console.error('Mostrando errores al usuario.');
        if (productsContainer) {
            productsContainer.innerHTML = '<div class="alert alert-danger" role="alert">Hubo un error al cargar los productos. Por favor, inténtalo de nuevo más tarde.</div>';
        }
        if (featuredCategoriesContainer && isProductsPage()) {
            featuredCategoriesContainer.innerHTML = '<div class="alert alert-danger" role="alert">Hubo un error al cargar las categorías. Por favor, inténtalo de nuevo más tarde.</div>';
        }
        if (categoryFiltersContainer && isProductsPage()) {
            categoryFiltersContainer.innerHTML = '<div class="alert alert-danger" role="alert">Hubo un error al cargar los filtros de categoría. Por favor, inténtalo de nuevo más tarde.</div>';
        }
        if (offersContainer) {
            offersContainer.innerHTML = '<div class="alert alert-danger" role="alert">Hubo un error al cargar las ofertas. Por favor, inténtalo de nuevo más tarde.</div>';
        }
    }

    // Funciones para detectar página actual
    function isIndexPage() {
        const indexCheck = featuredCategoriesContainer !== null;
        console.log(`isIndexPage: ${indexCheck}`);
        return indexCheck;
    }

    function isProductsPage() {
        const productsCheck = categoryFiltersContainer !== null;
        console.log(`isProductsPage: ${productsCheck}`);
        return productsCheck;
    }
    

    // Inicializar la carga de productos
    function init() {
        console.log('Inicializando la carga de productos...');
        fetchProducts();
    }

    init();
});