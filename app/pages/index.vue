<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- HEADER SECTION -->
    <AppHeader :isLoggedIn="isLoggedIn" @logout="handleLogout" />

    <!-- MAIN CONTENT -->
    <main>
      <!-- Hero Section -->
      <section class="bg-white">
        <div class="container mx-auto px-6 py-24 text-center">
          <h1 class="text-4xl md:text-6xl font-bold text-gray-800">
            Unlock Your Fridge's Potential.
          </h1>
          <p class="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Effortlessly track your groceries and let our AI generate delicious recipes based on what you have on hand.
          </p>
          <button class="mt-8 bg-green-600 text-white font-bold px-8 py-4 rounded-md text-lg hover:bg-green-700 transition">
            Get Started for Free
          </button>
        </div>
      </section>

      <!-- "What It Does" Section -->
      <section class="py-20">
        <div class="container mx-auto px-6">
          <div class="grid md:grid-cols-3 gap-12 text-center">
            <!-- Feature 1: Track Inventory -->
            <div class="p-8 bg-white rounded-lg shadow-md">
              <div class="text-green-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-800 mb-2">Track Your Inventory</h3>
              <p class="text-gray-600">
                Easily add and remove items from your digital fridge. Know what you have at a glance, and never buy the same ingredient twice.
              </p>
            </div>

            <!-- Feature 2: AI-Powered Recipes -->
            <div class="p-8 bg-white rounded-lg shadow-md">
               <div class="text-green-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
               </div>
              <h3 class="text-2xl font-bold text-gray-800 mb-2">AI-Powered Recipes</h3>
              <p class="text-gray-600">
                Our AI will generate creative and delicious recipes based on the ingredients you have. Specify your dietary needs, cuisine preferences, and more.
              </p>
            </div>

            <!-- Feature 3: Reduce Food Waste -->
            <div class="p-8 bg-white rounded-lg shadow-md">
               <div class="text-green-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
               </div>
              <h3 class="text-2xl font-bold text-gray-800 mb-2">Reduce Food Waste</h3>
              <p class="text-gray-600">
                By using the ingredients you already have, you'll save money and reduce food waste. It's good for your wallet and the planet.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- DEMO BUTTONS - to toggle login state -->
      <div class="fixed bottom-4 right-4">
        <button @click="isLoggedIn = !isLoggedIn" class="bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg">
          Toggle Login State
        </button>
      </div>

    </main>
  </div>
</template>

<script>
import AppHeader from '~/components/AppHeader.vue';

export default {
  name: 'HomePage',
  data() {
    return {
      isLoggedIn: false,
      dropdownOpen: false,
    };
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    handleLogout() {
      this.isLoggedIn = false;
      this.dropdownOpen = false;
    }
  }
};
</script>

<style scoped>
/* You can add any additional scoped styles here if needed */
</style>