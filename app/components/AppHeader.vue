<template>
  <header class="bg-white shadow-sm">
    <nav class="container mx-auto px-6 py-4 flex justify-between items-center">
      <!-- Logo -->
      <div>
        <NuxtLink to="/" class="text-2xl font-bold text-green-600">Leftover Logic</NuxtLink>
      </div>

      <!-- Header for Logged Out Users -->
      <div v-if="!isLoggedIn" class="flex items-center space-x-6">
        <a href="#" class="text-gray-600 hover:text-green-600 transition">Login</a>
        <a href="#" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
          Register
        </a>
      </div>

      <!-- Header for Logged In Users -->
      <div v-if="isLoggedIn" class="flex items-center space-x-6">
        <NuxtLink to="/fridge" class="text-gray-600 hover:text-green-600 transition">
            Fridge Inventory
        </NuxtLink>
        <NuxtLink to="/recipes" class="text-gray-600 hover:text-green-600 transition">
            My Recipes
        </NuxtLink>
        <NuxtLink to="/generate" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
          Generate New Recipe
        </NuxtLink>
        <div class="relative">
          <!-- User Profile Dropdown -->
          <button @click="toggleDropdown" class="w-10 h-10 bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            <!-- Placeholder for user avatar -->
            <span class="text-gray-600 font-bold">U</span>
          </button>
          <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-10">
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
            <a href="#" @click="handleLogout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  props: {
    isLoggedIn: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      dropdownOpen: false,
    };
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    handleLogout() {
      this.dropdownOpen = false; // Close dropdown on logout
      this.$emit('logout'); // Emit event to the parent component
    },
  },
};
</script>