document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Xử lý đăng nhập
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(loginForm));
            try {
                const res = await fetch('/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (!res.ok) {
                    throw new Error('Đăng nhập thất bại');
                }

                const result = await res.json();
                if (result.success) {
                    localStorage.setItem('token', result.token); // Lưu token vào localStorage
                    alert('Đăng nhập thành công');
                    window.location.href = 'profile.html';
                } else {
                    alert(result.message || 'Đăng nhập thất bại');
                }
            } catch (error) {
                console.error('Lỗi:', error);
                alert('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
            }
        });
    }

    // Xử lý đăng ký
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(registerForm));
            try {
                const res = await fetch('/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (!res.ok) {
                    throw new Error('Đăng ký thất bại');
                }

                const result = await res.json();
                alert(result.message || 'Đăng ký thành công');
                if (result.success) window.location.href = 'login.html';
            } catch (error) {
                console.error('Lỗi:', error);
                alert('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
            }
        });
    }
});