async function loadProducts() {
    try {
        const res = await fetch('/products');
        if (!res.ok) {
            throw new Error('Không thể lấy danh sách sản phẩm');
        }
        const result = await res.json();
        if (result.success) {
            const productsTableBody = document.getElementById('productsTableBody');
            productsTableBody.innerHTML = result.data.map(product => `
                <tr>
                    <td>${product._id}</td>
                    <td>${product.name}</td>
                    <td>${product.price}</td>
                    <td>${product.category?.name || 'Không có'}</td>
                    <td>
                        <button class="btn btn-sm btn-primary">Sửa</button>
                        <button class="btn btn-sm btn-danger">Xóa</button>
                    </td>
                </tr>
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