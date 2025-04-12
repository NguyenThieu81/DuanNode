function checkAuth() {
    const token = localStorage.getItem('token');
    return !!token;
}

function updateAuthMenu() {
    const authNav = document.getElementById('authNav');
    if (!authNav) return;

    if (checkAuth()) {
        authNav.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="/profile.html">Tài khoản</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="logout()">Đăng xuất</a>
            </li>
        `;
    } else {
        authNav.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="/login.html">Đăng nhập</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/register.html">Đăng ký</a>
            </li>
        `;
    }
}

function logout() {
    localStorage.removeItem('token');
    updateAuthMenu();
    window.location.href = '/login.html';
}

document.addEventListener('DOMContentLoaded', updateAuthMenu);