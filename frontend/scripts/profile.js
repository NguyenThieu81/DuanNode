document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    try {
        const res = await fetch('/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error('Không thể lấy thông tin người dùng');
        }

        const result = await res.json();
        if (result.success) {
            document.getElementById('username').textContent = result.data.username;
            document.getElementById('email').value = result.data.email;
        } else {
            alert(result.message || 'Không thể lấy thông tin người dùng');
            window.location.href = '/login.html';
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra khi lấy thông tin người dùng');
        window.location.href = '/login.html';
    }
});