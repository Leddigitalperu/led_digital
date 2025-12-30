document.addEventListener('DOMContentLoaded', function () {
    // Contenedores principales
    const productsContainer = document.getElementById('products-container');
    const categoryFiltersContainer = document.getElementById('category-filters');
    const featuredCategoriesContainer = document.getElementById('featured-categories');
    const offersContainer = document.getElementById('offers-container');
    const newProductsInner = document.querySelector('#new-products-carousel .carousel-inner');
    const newProductsIndicators = document.querySelector('.new-products-indicators');
    const brandInner = document.querySelector('#brand-carousel .carousel-inner');
    const brandIndicators = document.querySelector('.brand-indicators');
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

    // Renderizar carrusel de productos nuevos
    function renderNewProducts(newProducts) {
        if (!newProductsInner) return;
        newProductsInner.innerHTML = '';
        if (newProductsIndicators) newProductsIndicators.innerHTML = '';

        if (!newProducts || newProducts.length === 0) {
            const empty = document.createElement('div');
            empty.classList.add('carousel-item', 'active');
            empty.innerHTML = '<div class="text-center text-white py-4">No hay productos nuevos disponibles.</div>';
            newProductsInner.appendChild(empty);
            return;
        }

        const chunkSize = 3;
        const chunks = [];
        for (let i = 0; i < newProducts.length; i += chunkSize) {
            chunks.push(newProducts.slice(i, i + chunkSize));
        }

        chunks.forEach((group, index) => {
            const item = document.createElement('div');
            item.classList.add('carousel-item');
            if (index === 0) item.classList.add('active');

            const row = document.createElement('div');
            row.classList.add('row', 'g-3', 'g-md-4');

            group.forEach(product => {
                const col = document.createElement('div');
                col.classList.add('col-md-4');

                const card = document.createElement('div');
                card.classList.add('card', 'new-product-card', 'h-100');

                const badge = document.createElement('span');
                badge.classList.add('new-badge');
                badge.textContent = 'Nuevo';

                const img = document.createElement('img');
                img.classList.add('card-img-top');
                img.src = product.image || 'images/imagen-no-disponible.jpg';
                img.alt = product.Producto;
                img.onerror = () => { img.src = 'images/imagen-no-disponible.jpg'; };

                const body = document.createElement('div');
                body.classList.add('card-body');

                const title = document.createElement('h5');
                title.classList.add('card-title');
                title.textContent = product.Producto;

                const desc = document.createElement('p');
                desc.classList.add('card-text');
                desc.textContent = product.Descripcion || '';

                const priceRow = document.createElement('div');
                priceRow.classList.add('d-flex', 'justify-content-between', 'align-items-center');
                const price = document.createElement('span');
                price.classList.add('new-product-price');
                const parsedPrice = product.Precio ? parseFloat(String(product.Precio).replace('S/', '')) : 0;
                price.textContent = isNaN(parsedPrice) ? (product.Precio || '') : `S/ ${parsedPrice.toFixed(2)}`;

                const btn = document.createElement('button');
                btn.classList.add('btn', 'btn-new-product', 'btn-sm');
                btn.textContent = 'Ver detalle';
                btn.addEventListener('click', () => {
                    window.location.href = `product_detail.html?Codigo=${product.Codigo}`;
                });

                priceRow.appendChild(price);
                priceRow.appendChild(btn);

                body.appendChild(title);
                if (desc.textContent) body.appendChild(desc);
                body.appendChild(priceRow);

                card.appendChild(badge);
                card.appendChild(img);
                card.appendChild(body);

                // Click en tarjeta abre detalle
                card.addEventListener('click', (e) => {
                    if (!e.target.closest('button')) {
                        window.location.href = `product_detail.html?Codigo=${product.Codigo}`;
                    }
                });

                col.appendChild(card);
                row.appendChild(col);
            });

            item.appendChild(row);
            newProductsInner.appendChild(item);

            if (newProductsIndicators) {
                const indicator = document.createElement('button');
                indicator.type = 'button';
                indicator.setAttribute('data-bs-target', '#new-products-carousel');
                indicator.setAttribute('data-bs-slide-to', String(index));
                indicator.setAttribute('aria-label', `Slide ${index + 1}`);
                if (index === 0) indicator.classList.add('active');
                newProductsIndicators.appendChild(indicator);
            }
        });
    }

    // Renderizar carrusel de marca LED Digital
    function renderBrandProducts(items) {
        if (!brandInner) return;
        brandInner.innerHTML = '';
        if (brandIndicators) brandIndicators.innerHTML = '';

        if (!items || items.length === 0) {
            const empty = document.createElement('div');
            empty.classList.add('carousel-item', 'active');
            empty.innerHTML = '<div class="text-center text-light py-4">Pronto añadiremos más productos de LED Digital.</div>';
            brandInner.appendChild(empty);
            return;
        }

        const chunkSize = 3;
        const groups = [];
        for (let i = 0; i < items.length; i += chunkSize) {
            groups.push(items.slice(i, i + chunkSize));
        }

        groups.forEach((group, index) => {
            const item = document.createElement('div');
            item.classList.add('carousel-item');
            if (index === 0) item.classList.add('active');

            const row = document.createElement('div');
            row.classList.add('row', 'g-3', 'g-md-4');

            group.forEach(product => {
                const col = document.createElement('div');
                col.classList.add('col-md-4');

                const card = document.createElement('div');
                card.classList.add('card', 'brand-card', 'h-100', 'position-relative');

                const badge = document.createElement('span');
                badge.classList.add('brand-badge');
                badge.textContent = 'LED Digital';

                const img = document.createElement('img');
                img.classList.add('card-img-top');
                img.src = product.image || 'images/imagen-no-disponible.jpg';
                img.alt = product.Producto;
                img.onerror = () => { img.src = 'images/imagen-no-disponible.jpg'; };

                const body = document.createElement('div');
                body.classList.add('card-body');

                const title = document.createElement('h5');
                title.classList.add('card-title');
                title.textContent = product.Producto;

                const desc = document.createElement('p');
                desc.classList.add('card-text');
                desc.textContent = product.Descripcion || '';

                const priceRow = document.createElement('div');
                priceRow.classList.add('d-flex', 'justify-content-between', 'align-items-center');
                const price = document.createElement('span');
                price.classList.add('brand-price');
                const parsedPrice = product.Precio ? parseFloat(String(product.Precio).replace('S/', '')) : 0;
                price.textContent = isNaN(parsedPrice) ? (product.Precio || '') : `S/ ${parsedPrice.toFixed(2)}`;

                const btn = document.createElement('button');
                btn.classList.add('btn', 'btn-brand', 'btn-sm');
                btn.textContent = 'Ver detalle';
                btn.addEventListener('click', () => {
                    window.location.href = `product_detail.html?Codigo=${product.Codigo}`;
                });

                priceRow.appendChild(price);
                priceRow.appendChild(btn);

                body.appendChild(title);
                if (desc.textContent) body.appendChild(desc);
                body.appendChild(priceRow);

                card.appendChild(badge);
                card.appendChild(img);
                card.appendChild(body);

                card.addEventListener('click', (e) => {
                    if (!e.target.closest('button')) {
                        window.location.href = `product_detail.html?Codigo=${product.Codigo}`;
                    }
                });

                col.appendChild(card);
                row.appendChild(col);
            });

            item.appendChild(row);
            brandInner.appendChild(item);

            if (brandIndicators) {
                const indicator = document.createElement('button');
                indicator.type = 'button';
                indicator.setAttribute('data-bs-target', '#brand-carousel');
                indicator.setAttribute('data-bs-slide-to', String(index));
                indicator.setAttribute('aria-label', `Slide ${index + 1}`);
                if (index === 0) indicator.classList.add('active');
                brandIndicators.appendChild(indicator);
            }
        });
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

               // Función para renderizar ofertas en carrusel
        function renderOffers(offersToRender) {
            console.log('Rendering offers carousel...');
            if (!offersContainer) {
                console.error('Contenedor de ofertas no encontrado.');
                return;
            }
            offersContainer.innerHTML = '';
        
            console.log(`Renderizando ${offersToRender.length} ofertas en carrusel.`);
        
            if (offersToRender.length === 0) {
                const noOffersSlide = document.createElement('div');
                noOffersSlide.classList.add('carousel-item', 'active');
        
                const noOffersMessage = document.createElement('div');
                noOffersMessage.classList.add('text-center', 'py-5');
        
                const noOffersImage = document.createElement('img');
                noOffersImage.src = 'images/ESTAMOS PREPARANDO OFERTAS.png';
                noOffersImage.alt = 'Estamos preparando las mejores ofertas para ti';
                noOffersImage.classList.add('img-fluid');
        
                noOffersMessage.appendChild(noOffersImage);
                noOffersSlide.appendChild(noOffersMessage);
                offersContainer.appendChild(noOffersSlide);
                return;
            }
        
            // Agrupar en slides de 3 productos por slide
            const itemsPerSlide = 3;
            let slideIndex = 0;
        
            for (let i = 0; i < offersToRender.length; i += itemsPerSlide) {
                const slide = document.createElement('div');
                slide.classList.add('carousel-item');
                if (slideIndex === 0) {
                    slide.classList.add('active');
                }
        
                const slideRow = document.createElement('div');
                slideRow.classList.add('row', 'g-3');
        
                const slideProducts = offersToRender.slice(i, i + itemsPerSlide);
        
                slideProducts.forEach(product => {
                    try {
                        const precioOriginal = product.Precio ? parseFloat(product.Precio.replace('S/', '')) : 0;
                        const precioOferta = product.PrecioOferta ? parseFloat(product.PrecioOferta.replace('S/', '')) : precioOriginal;
                        const imagePath = product.image ? product.image : 'images/imagen-no-disponible.jpg';
        
                        const col = document.createElement('div');
                        col.classList.add('col-lg-4', 'col-md-6', 'col-sm-12');
        
                        const card = document.createElement('div');
                        card.classList.add('card', 'h-100', 'oferta-card');
                        card.style.cursor = 'pointer';
        
                        const imgContainer = document.createElement('div');
                        imgContainer.classList.add('position-relative', 'overflow-hidden');
                        imgContainer.style.height = '420px';
        
                        const img = document.createElement('img');
                        img.src = imagePath;
                        img.classList.add('card-img-top', 'w-100', 'h-100');
                        img.style.objectFit = 'cover';
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
                        title.classList.add('card-title', 'small');
                        title.textContent = product.Producto;
        
                        const rating = document.createElement('div');
                        rating.classList.add('mb-2');
                        rating.innerHTML = generarEstrellas(product.rating);
        
                        const precioOriginalP = document.createElement('p');
                        precioOriginalP.classList.add('text-muted', 'text-decoration-line-through', 'small', 'mb-1');
                        precioOriginalP.textContent = `S/ ${precioOriginal.toFixed(2)}`;
        
                        const precioOfertaP = document.createElement('p');
                        precioOfertaP.classList.add('text-danger', 'fw-bold', 'mb-2');
                        precioOfertaP.textContent = `S/ ${precioOferta.toFixed(2)}`;
        
                        const whatsappBtn = document.createElement('a');
                        whatsappBtn.href = "https://wa.link/ggb69o";
                        whatsappBtn.target = "_blank";
                        whatsappBtn.classList.add('btn', 'btn-primary', 'btn-sm', 'mt-auto');
                        whatsappBtn.textContent = 'Consultar';
        
                        cardBody.appendChild(title);
                        cardBody.appendChild(rating);
                        cardBody.appendChild(precioOriginalP);
                        cardBody.appendChild(precioOfertaP);
                        cardBody.appendChild(whatsappBtn);
                        card.appendChild(imgContainer);
                        card.appendChild(cardBody);
                        col.appendChild(card);
                        slideRow.appendChild(col);
        
                        card.addEventListener('click', (e) => {
                            if (!e.target.closest('a')) {
                                window.location.href = `product_detail.html?Codigo=${encodeURIComponent(product.Codigo)}`;
                            }
                        });
        
                    } catch (error) {
                        console.error(`Error al renderizar la oferta para el producto ${product.Producto}:`, error);
                    }
                });
        
                slide.appendChild(slideRow);
                offersContainer.appendChild(slide);
                slideIndex++;
            }
        
            // Inicializar el carousel después de renderizar todos los elementos
            setTimeout(() => {
                try {
                    const carouselElement = document.getElementById('offers-carousel');
                    const carouselInner = document.getElementById('offers-container');
                    
                    if (!carouselElement || !window.bootstrap) return;
                    
                    // Crear nueva instancia de Bootstrap Carousel
                    const carousel = new window.bootstrap.Carousel(carouselElement, {
                        interval: false,
                        wrap: true
                    });
                    
                    // Función para ajustar altura
                    const adjustHeight = () => {
                        const activeItem = carouselInner.querySelector('.carousel-item.active');
                        if (activeItem) {
                            carouselInner.style.minHeight = activeItem.scrollHeight + 'px';
                        }
                    };
                    
                    // Ajustar altura inicial
                    adjustHeight();
                    
                    // Escuchar cambios de slide y ajustar altura
                    carouselElement.addEventListener('slide.bs.carousel', adjustHeight);
                    carouselElement.addEventListener('slid.bs.carousel', adjustHeight);
                    
                    // Reajustar en resize
                    window.addEventListener('resize', adjustHeight);
                    
                } catch (e) {
                    console.error('Error initializing carousel:', e);
                }
            }, 100);
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

    // Función para obtener categorías únicas (ordenadas alfabéticamente, ignorando acentos)
    function getUniqueCategories(products) {
        const categorias = products.map(product => product.Categoria).filter(Boolean);
        const unicas = [...new Set(categorias)];
        return unicas.sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
    }

    // Función para crear el menú desplegable de categorías (dropdown)
    function createCategoryFilters(categories) {
        console.log('Creating category dropdown filter...');
        if (!categoryFiltersContainer) {
            console.error('Contenedor de filtros de categoría no encontrado.');
            return;
        }

        const menu = document.getElementById('category-menu');
        const toggleBtn = document.getElementById('category-filter-toggle');
        if (!menu || !toggleBtn) {
            console.error('Estructura de dropdown de categorías no encontrada.');
            return;
        }

        // Limpia items dinámicos pero conserva header/divider iniciales
        menu.querySelectorAll('li[data-dynamic]')?.forEach(li => li.remove());

        const makeItem = (label) => {
            const li = document.createElement('li');
            li.setAttribute('data-dynamic', '');
            const a = document.createElement('a');
            a.href = '#';
            a.className = 'dropdown-item';
            a.textContent = label;
            a.setAttribute('data-category', label);
            a.addEventListener('click', (e) => {
                e.preventDefault();
                const categoria = label;
                // Actualiza active
                menu.querySelectorAll('a.dropdown-item').forEach(el => el.classList.remove('active'));
                a.classList.add('active');

                // Filtra
                if (categoria === 'Todos') {
                    filteredProducts = products;
                } else if (categoria === 'Ofertas') {
                    filteredProducts = products.filter(p => p.Onsale === true && p.PrecioOferta);
                } else {
                    filteredProducts = products.filter(p => p.Categoria === categoria);
                }
                renderProducts(filteredProducts, categoria);

                // Actualiza el tooltip del botón con la categoría seleccionada
                try {
                    toggleBtn.setAttribute('title', `Categoría: ${categoria}`);
                    toggleBtn.setAttribute('aria-label', `Filtro por categoría. Seleccionado: ${categoria}`);
                } catch (_) { /* noop */ }

                // Cierra el dropdown si bootstrap está disponible
                try {
                    if (window.bootstrap) {
                        const instance = window.bootstrap.Dropdown.getOrCreateInstance(toggleBtn);
                        instance.hide();
                    }
                } catch (_) { /* noop */ }
            });
            li.appendChild(a);
            return li;
        };

        // Opción Todos
        menu.appendChild(makeItem('Todos'));

        // Si hay ofertas, podríamos añadir una opción. (Opcional)
        // const hayOfertas = products.some(p => p.Onsale === true && p.PrecioOferta);
        // if (hayOfertas) menu.appendChild(makeItem('Ofertas'));

        // Divider
        const divider = document.createElement('li');
        divider.setAttribute('data-dynamic', '');
        divider.innerHTML = '<hr class="dropdown-divider">';
        menu.appendChild(divider);

        // Categorías ordenadas
        categories.forEach(cat => menu.appendChild(makeItem(cat)));

        // Marca Todos como activo por defecto
        const first = menu.querySelector('a.dropdown-item[data-category="Todos"]');
        if (first) {
            first.classList.add('active');
            try {
                toggleBtn.setAttribute('title', 'Categoría: Todos');
                toggleBtn.setAttribute('aria-label', 'Filtro por categoría. Seleccionado: Todos');
            } catch (_) { /* noop */ }
        }
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

                    const nuevos = products.filter(p => p.EsNuevo === true);
                    renderNewProducts(nuevos.slice(0, 6));

                    const brandProducts = products.filter(p => {
                        const marca = (p.Marca || '').toLowerCase();
                        return marca === 'led digital';
                    });
                    renderBrandProducts(brandProducts.slice(0, 6));

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

                    // Si llega una categoría desde index (localStorage), igualamos de forma acento-insensible
                    const selectedCategory = localStorage.getItem('selectedCategory');
                    const menuEl = document.getElementById('category-menu');
                    if (selectedCategory && menuEl) {
                        console.log(`Categoría seleccionada desde localStorage: ${selectedCategory}`);
                        const normalize = (s) => (s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
                        const items = Array.from(menuEl.querySelectorAll('a.dropdown-item[data-category]'));
                        const match = items.find(a => normalize(a.getAttribute('data-category')) === normalize(selectedCategory));
                        if (match) {
                            match.click();
                        }
                        localStorage.removeItem('selectedCategory');
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