<template>
    <div v-if="visible">
      <p>Contact Us</p>
      <form @submit.prevent="formSubmitted">
        <p>Name: <input v-model="formstorage.name" type="text" required /></p>
        <p>Email: <input v-model="formstorage.email" type="email" required /></p>
        <p>Message: <textarea v-model="formstorage.message" required></textarea></p>
        <button type="submit">Submit</button>
      </form>
  
      <div v-if="submitted">✅ Message sent successfully!</div>
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
  
  