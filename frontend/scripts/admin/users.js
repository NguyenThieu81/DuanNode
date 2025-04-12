async function loadUsers() {
    try {
        const res = await fetch('/users');
        if (!res.ok) {
            throw new Error('Không thể lấy danh sách người dùng');
        }
        const result = await res.json();
        if (result.success) {
            const usersTableBody = document.getElementById('usersTableBody');
            usersTableBody.innerHTML = result.data.map(user => `
                <tr>
                    <td>${user._id}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.role.name}</td>
                    <td>
                        <button class="btn btn-sm btn-primary">Sửa</button>
                        <button class="btn btn-sm btn-danger">Xóa</button>
                    </td>
                </tr>
            `).join('');
        } else {
            alert(result.message || 'Không thể lấy danh sách người dùng');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra khi lấy danh sách người dùng');
    }
}

document.addEventListener('DOMContentLoaded', loadUsers);