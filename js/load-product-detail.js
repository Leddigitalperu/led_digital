document.addEventListener("DOMContentLoaded", () => {
    const getQueryParam = (param) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    };

    const productId = getQueryParam('Codigo');
    console.log("Código del producto:", productId);

    const productDetailsContainer = document.getElementById('product-details');

    if (!productId) {
        productDetailsContainer.innerHTML = '<p>Producto no encontrado.</p>';
        return;
    }

    fetch('products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar products.json: ${response.statusText}`);
            }
            return response.json();
        })
        .then(products => {
            console.log("Productos cargados:", products);

            if (!Array.isArray(products)) {
                throw new Error('products.json no está estructurado como un arreglo.');
            }

            const product = products.find(p => p.Codigo === productId);
            console.log("Producto encontrado:", product);

            if (!product) {
                productDetailsContainer.innerHTML = '<p>Producto no encontrado.</p>';
                return;
            }

            const precio = parseFloat(product.Precio.replace('S/', '').trim());
            const costo = parseFloat(product.Costo.replace('S/', '').trim());
            const precioOferta = product.PrecioOferta ? parseFloat(product.PrecioOferta.replace('S/', '').trim()) : null;

            const stockDisponible = product.Stock > 0 ? 'Disponible' : 'No disponible';
            const stockClass = product.Stock > 0 ? 'text-success' : 'text-danger';

            const whatsappNumber = '985852774'; // Reemplaza con el número de WhatsApp correcto
            const whatsappMessage = precioOferta 
                ? `Hola, me interesa la oferta del producto ${product.Producto} a S/ ${precioOferta.toFixed(2)}. Más información, por favor.`
                : `Hola, me interesa el producto ${product.Producto} por S/ ${precio.toFixed(2)}.`;

            const productElement = document.createElement('div');
            productElement.classList.add('product-detail');

            productElement.innerHTML = `
                <nav aria-label="breadcrumb" class="mb-4">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="index.html">Inicio</a></li>
                        <li class="breadcrumb-item"><a href="products.html">Productos</a></li>
                        <li class="breadcrumb-item active" aria-current="page">${product.Producto}</li>
                    </ol>
                </nav>
                <div class="row">
                    <div class="col-lg-6 col-md-12 mb-4">
                        <div class="product-image-container">
                            <img src="${product.image || 'images/imagen-no-disponible.jpg'}" alt="${product.Producto}" class="img-fluid rounded shadow" onerror="this.onerror=null; this.src='images/imagen-no-disponible.jpg';">
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-12">
                        <div class="product-info p-4 bg-white rounded shadow">
                            <h1 class="product-title mb-4">${product.Producto}</h1>
                            <div class="product-meta mb-4">
                                ${product.Tipo ? `<span class="badge bg-primary me-2">${product.Tipo}</span>` : ''}
                                <span class="badge ${product.Stock > 0 ? 'bg-success' : 'bg-danger'}">${stockDisponible}</span>
                            </div>
                            <div class="price-container mb-4">
                                ${precioOferta ? `
                                    <div class="original-price text-decoration-line-through text-muted fs-5">
                                        Precio Regular: S/ ${precio.toFixed(2)}
                                    </div>
                                    <div class="current-price text-danger fs-2 fw-bold">
                                        S/ ${precioOferta.toFixed(2)}
                                    </div>
                                ` : `
                                    <div class="current-price text-danger fs-2 fw-bold">
                                        S/ ${precio.toFixed(2)}
                                    </div>
                                `}
                            </div>
                            <div class="product-details mb-4">
                                <div class="row">
                                    <div class="col-6">
                                        <p><strong>Categoría:</strong> <span class="text-muted">${product.Categoria}</span></p>
                                        <p><strong>Código:</strong> <span class="text-muted">${product.Codigo}</span></p>
                                    </div>
                                    <div class="col-6">
                                        <p><strong>Stock:</strong> <span class="${stockClass}">${product.Stock}</span></p>
                                        <p><strong>Tipo:</strong> <span class="text-muted">${product.Tipo || 'N/A'}</span></p>
                                    </div>
                                </div>
                            </div>
                            <div class="d-grid gap-2">
                                <a href="https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}" class="btn btn-success btn-lg" target="_blank">
                                    <i class="fab fa-whatsapp me-2"></i>
                                    Consultar por WhatsApp
                                </a>
                                <a href="products.html" class="btn btn-outline-primary">
                                    <i class="fas fa-arrow-left me-2"></i>
                                    Volver a Productos
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            productDetailsContainer.appendChild(productElement);
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
            productDetailsContainer.innerHTML = '<p>Hubo un error al cargar el producto. Por favor, inténtalo de nuevo más tarde.</p>';
        });
});