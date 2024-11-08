async function fetchProducts() {
    try {
        const response = await fetch('http://localhost/getProductsJson.php');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();

        let productsContainer = document.getElementById('products');
        productsContainer.innerHTML = ''; // تفريغ المحتوى الحالي
        products.forEach(product => {
            let productDiv = document.createElement('div');
            productDiv.className = 'product card';

            let imgSrc = `http://localhost/${product.img}`;

            productDiv.innerHTML = `
                <div class="imgs">
                    <img src="${imgSrc}" alt="${product.name}">
                    <img class="img_hover" src="${imgSrc}" alt="${product.name}">
                </div>
                <div class="details">
                    <p class="name">${product.name}</p>
                    <p class="discrption">is a good product</p>
                    <div class="price">
                        <p>${product.price}$</p>
                        <p class="old_price">120$</p>
                    </div>
                    <button onclick="deleteProduct(${product.id})">Delete</button>
                </div>
            `;
            productsContainer.appendChild(productDiv);
        });
    } catch (error) {
        console.error('Error fetching products:', error.message);
    }
}

async function addProduct(event) {
    event.preventDefault();

    const formData = new FormData(document.getElementById('addProductForm'));
    const response = await fetch('http://localhost/addProduct.php', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        document.getElementById('addProductForm').reset();
        fetchProducts(); // إعادة تحميل قائمة المنتجات بعد الإضافة
    } else {
        console.error('Error adding product:', response.statusText);
    }
}

// جلب البيانات عند تحميل الصفحة
window.onload = fetchProducts;

// الاستماع لنموذج إضافة المنتجات
document.getElementById('addProductForm').addEventListener('submit', addProduct);

async function deleteProduct(id) {
    try {
        const response = await fetch(`http://localhost/deleteProduct.php?id=${id}`, {
            method: 'GET'
        });
        if (response.ok) {
            fetchProducts(); // إعادة تحميل قائمة المنتجات بعد الحذف
        } else {
            console.error('Error deleting product:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
