// Authentication handling
document.addEventListener('DOMContentLoaded', function() {
    const signinForm = document.getElementById('signinForm');
    const signupForm = document.getElementById('signupForm');
    
    // Check if user is already logged in (for demo purposes)
    // In a real app, this would check a token or session
    const isLoggedIn = localStorage.getItem('shoehavenUser');
    
    // If user is logged in and on auth pages, redirect to home
    if (isLoggedIn && (window.location.pathname.includes('signin.html') || window.location.pathname.includes('signup.html'))) {
        window.location.href = 'index.html';
    }
    
    // Update user icon based on login status
    const userIcon = document.querySelector('.user-icon');
    if (userIcon && isLoggedIn) {
        userIcon.innerHTML = '<i class="fas fa-user-check"></i>';
        userIcon.title = 'My Account';
    }
    
    // Sign in form
    if (signinForm) {
        signinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('#email').value;
            const password = this.querySelector('#password').value;
            const rememberMe = this.querySelector('#remember').checked;
            
            // In a real app, you would validate with a server
            // For demo purposes, accept any email/password
            if (email && password) {
                // Save user data (in a real app, you'd save a token)
                const userData = {
                    email: email,
                    remember: rememberMe
                };
                
                localStorage.setItem('shoehavenUser', JSON.stringify(userData));
                
                // Show success message
                showNotification('Successfully signed in!');
                
                // Redirect to home page
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                showNotification('Please fill in all fields');
            }
        });
    }
    
    // Sign up form
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('#name').value;
            const email = this.querySelector('#email').value;
            const password = this.querySelector('#password').value;
            const confirmPassword = this.querySelector('#confirmPassword').value;
            const terms = this.querySelector('#terms').checked;
            
            // Basic validation
            if (!name || !email || !password || !confirmPassword) {
                showNotification('Please fill in all fields');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match');
                return;
            }
            
            if (!terms) {
                showNotification('Please accept the terms and conditions');
                return;
            }
            
            // In a real app, you would send this data to a server
            // For demo purposes, just save to localStorage
            
            const userData = {
                name: name,
                email: email
            };
            
            localStorage.setItem('shoehavenUser', JSON.stringify(userData));
            
            // Show success message
            showNotification('Account created successfully!');
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }
    
    // Logout functionality
    if (userIcon && isLoggedIn) {
        userIcon.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show dropdown with logout option
            // For simplicity, we'll just log out on click
            localStorage.removeItem('shoehavenUser');
            showNotification('Successfully logged out');
            
            // Update icon
            userIcon.innerHTML = '<i class="fas fa-user"></i>';
            userIcon.title = 'Sign In';
            
            // If on a protected page, redirect to home
            if (window.location.pathname.includes('checkout.html')) {
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }
        });
    }
});