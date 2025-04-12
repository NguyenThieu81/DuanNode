async function loadProducts() {
    try {
        const res = await fetch('/products');
        if (!res.ok) {
            throw new Error('Không thể lấy danh sách sản phẩm');
        }
        const result = await res.json();
        if (result.success) {
            const productsList = document.getElementById('productsList');
            productsList.innerHTML = result.data.map(product => `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <img src="${product.imageUrl || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.price} VNĐ</p>
                            <a href="/product-detail.html?id=${product._id}" class="btn btn-primary">Chi tiết</a>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            alert(result.message || 'Không thể lấy danh sách sản phẩm');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra khi lấy danh sách sản phẩm');
    }
}

document.addEventListener('DOMContentLoaded', loadProducts);