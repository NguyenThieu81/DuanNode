async function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    try {
        const res = await fetch(`/products/${productId}`);
        if (!res.ok) {
            throw new Error('Không thể lấy thông tin sản phẩm');
        }
        const result = await res.json();
        if (result.success) {
            const product = result.data;
            document.getElementById('productName').innerText = product.name;
            document.getElementById('productPrice').innerText = product.price + ' VNĐ';
            document.getElementById('productDescription').innerText = product.description;
            document.getElementById('productImage').src = product.imageUrl || 'https://via.placeholder.com/300';
        } else {
            alert(result.message || 'Không thể lấy thông tin sản phẩm');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra khi lấy thông tin sản phẩm');
    }
}

document.addEventListener('DOMContentLoaded', loadProductDetail);