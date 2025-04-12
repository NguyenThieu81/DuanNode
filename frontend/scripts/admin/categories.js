async function loadCategories() {
    try {
        const res = await fetch('/categories');
        if (!res.ok) {
            throw new Error('Không thể lấy danh sách danh mục');
        }
        const result = await res.json();
        if (result.success) {
            const categoriesTableBody = document.getElementById('categoriesTableBody');
            categoriesTableBody.innerHTML = result.map(category => `
                <tr>
                    <td>${category._id}</td>
                    <td>${category.name}</td>
                    <td>
                        <button class="btn btn-sm btn-primary">Sửa</button>
                        <button class="btn btn-sm btn-danger">Xóa</button>
                    </td>
                </tr>
            `).join('');
        } else {
            alert(result.message || 'Không thể lấy danh sách danh mục');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra khi lấy danh sách danh mục');
    }
}

document.addEventListener('DOMContentLoaded', loadCategories);