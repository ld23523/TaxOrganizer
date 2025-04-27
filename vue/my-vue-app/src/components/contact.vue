<template>
    <div v-if="visible">
        <h2 class="contact-title">🛠️ Need Help with the System?</h2>
<p class="contact-subtitle">
  If you're experiencing issues with uploading, viewing media, or anything else on our platform, let us know below. We're here to help!
</p>

      <form @submit.prevent="formSubmitted">
        <p>Name: <input v-model="formstorage.name" type="text" required /></p>
        <p>Email: <input v-model="formstorage.email" type="email" required /></p>
        <p>Message: <textarea v-model="formstorage.message" required></textarea></p>
        <button type="submit">Submit</button>
      </form>
  
      <div v-if="submitted"> Message sent successfully!</div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits } from "vue";
  
  const props = defineProps(["visible"]);
  const emit = defineEmits(["formSubmitted"]);
  const submitted = ref(false);
  
  const formstorage = ref({
    name: "",
    email: "",
    message: "",
    clearForm() {
      this.name = "";
      this.email = "";
      this.message = "";
    }
  });
  
  // Replace this with your Formspree endpoint!
  const FORMSPREE_ENDPOINT = "replace your link here";
  
  const formSubmitted = async () => {
    if (!formstorage.value.name.trim() || !formstorage.value.email.trim() || !formstorage.value.message.trim()) return;
  
    try {
      await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formstorage.value.name,
          email: formstorage.value.email,
          message: formstorage.value.message
        })
      });
  
      emit("formSubmitted", formstorage.value);
      submitted.value = true;
  
      setTimeout(() => {
        formstorage.value.clearForm();
        submitted.value = false;
      }, 2000);
    } catch (err) {
      console.error("Failed to send message", err);
      alert("There was an error sending your message. Please try again.");
    }
  };
  </script>
  
<style>
form {
  max-width: 500px;
  margin: 30px auto;
  padding: 30px 40px;
  background: linear-gradient(to bottom right, #f0faff, #e0f7fa);
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 18px;
  transition: all 0.3s ease;
}

form p {
  margin: 0;
  font-weight: 600;
  color: #333;
}

input,
textarea {
  padding: 12px 14px;
  border: 1.5px solid #ccc;
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

}

input:focus,
textarea:focus {
  border-color: #1abc9c;
  box-shadow: 0 0 8px rgba(26, 188, 156, 0.2);
  outline: none;
}

textarea {
  resize: vertical;
  min-height: 120px;
}

button[type="submit"] {
  padding: 12px 18px;
  background-color: #1abc9c;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 6px 12px rgba(26, 188, 156, 0.25);
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button[type="submit"]:hover {
  background-color: #16a085;
  transform: translateY(-2px);
}

button[type="submit"]:active {
  transform: translateY(0);
}

div[v-if="submitted"] {
  text-align: center;
  margin-top: 20px;
  color: #2ecc71;
  font-weight: bold;
  font-size: 16px;
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}


.contact-title {
  text-align: center;
  font-size: 28px;
  color: #1abc9c;
  margin-top: 20px;
  font-weight: bold;
}

.contact-subtitle {
  text-align: center;
  font-size: 16px;
  color: #555;
  margin-bottom: 20px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  font-style: italic;
}

</style>