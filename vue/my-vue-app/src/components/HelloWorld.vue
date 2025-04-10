<template>
  <div class="input-form">
    <h2>{{ isLogin ? 'Login' : 'Register' }}</h2>
    <p>Username</p>
    <input type="text" v-model="username" placeholder="Type your username" />
    <p>Password</p>
    <input type="password" v-model="password" placeholder="Type your password" />
    
    <button @click="handleAuth">{{ isLogin ? 'Login' : 'Register' }}</button>
    
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
    <p v-if="successMessage" style="color: green;">{{ successMessage }}</p>

    <p @click="toggleForm" style="cursor: pointer; color: blue;">
      {{ isLogin ? 'No account? Register here.' : 'Already have an account? Login here.' }}
    </p>
  </div>
</template>

<script>

export default {
  data() {
    return {
      username: '',
      password: '',
      isLogin: true,
      errorMessage: '',
      successMessage: ''
    };
  },
  methods: {
    toggleForm() {
      this.isLogin = !this.isLogin;
      this.errorMessage = '';
      this.successMessage = '';
    },

    async register() {
      try {
        const response = await fetch('http://localhost:3000/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: this.username, password: this.password })
        });
        const data = await response.json();

        if (data.success) {
          this.successMessage = data.message || 'Registration successful!';
          this.errorMessage = '';
        } else {
          this.errorMessage = data.message || 'Registration failed.';
          this.successMessage = '';
        }
      } catch (err) {
        this.errorMessage = 'Something went wrong during registration.';
        this.successMessage = '';
      }
    },

    async login() {
      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: this.username, password: this.password })
        });
        const data = await response.json();

        if (data.success) {
          this.successMessage = data.message || 'Login successful!';
          this.errorMessage = '';
        } else {
          this.errorMessage = data.message || 'Login failed.';
          this.successMessage = '';
        }
      } catch (err) {
        this.errorMessage = 'Something went wrong during login.';
        this.successMessage = '';
      }
    },

    handleAuth() {
      if (this.isLogin) {
        this.login();
      } else {
        this.register();
      }
    }
  }
};
</script>

<style>
.input-form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 300px;
  margin: 50px auto;
  padding: 20px;
  border: 2px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.input-form h2 {
  align-self: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.input-form p {
  margin: 10px 0 5px;
  font-weight: 600;
  color: #444;
}

.input-form input {
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.input-form button {
  padding: 10px 20px;
  margin-top: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  width: 100%;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.input-form button:hover {
  background-color: #45a049;
}

.input-form p[style*="cursor: pointer"] {
  margin-top: 15px;
  color: #007bff;
  text-decoration: underline;
  font-size: 14px;
  align-self: center;
}

.input-form p[style*="color: red"] {
  margin-top: 10px;
  font-size: 14px;
}

.input-form p[style*="color: green"] {
  margin-top: 10px;
  font-size: 14px;
}

</style>
