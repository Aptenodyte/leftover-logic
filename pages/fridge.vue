<template>
  <div>
    <!-- 1. Use the new header component here -->
    <AppHeader :is-logged-in="isLoggedIn" @logout="handleUserLogout" />

    <!-- The rest of the fridge inventory page layout -->
    <div class="bg-gray-100 min-h-screen p-8">
      <div class="container mx-auto">
        <h1 class="text-4xl font-bold text-gray-800 mb-8">My Fridge Inventory</h1>

        <!-- Fridge Items Grid (no changes needed here) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="item in fridgeItems" :key="item.id" class="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between">
            <!-- Item Card Content -->
            <div v-if="!item.isEditing">
              <div class="flex justify-between items-start mb-4">
                <h2 class="text-2xl font-bold text-gray-700">{{ item.name }}</h2>
                <button @click="removeItem(item.id)" class="text-gray-400 hover:text-red-500 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <p class="text-gray-600"><strong>Quantity:</strong> {{ item.quantity }} {{ item.unit }}</p>
              <p class="text-gray-600"><strong>Expires:</strong> {{ new Date(item.expirationDate).toLocaleDateString() }}</p>
            </div>
            <div v-else>
              <input v-model="item.edit.name" class="text-2xl font-bold text-gray-700 w-full border-b-2 mb-2" />
              <div class="flex space-x-2">
                <input v-model.number="item.edit.quantity" type="number" class="w-1/2 p-1 border rounded" />
                <input v-model="item.edit.unit" class="w-1/2 p-1 border rounded" />
              </div>
              <input v-model="item.edit.expirationDate" type="date" class="w-full mt-2 p-1 border rounded" />
            </div>
            <div class="mt-6 flex justify-end space-x-3">
              <div v-if="!item.isEditing">
                <button @click="showNutrition(item.name)" class="text-sm text-blue-500 hover:underline">Info</button>
                <button @click="toggleEdit(item.id)" class="ml-4 text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Edit</button>
              </div>
              <div v-else>
                <button @click="cancelEdit(item.id)" class="text-sm text-gray-500 hover:underline">Cancel</button>
                <button @click="saveItem(item.id)" class="ml-4 text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Nutritional Info Modal (no changes needed here) -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full">
            <h3 class="text-2xl font-bold mb-4">Nutritional Facts</h3>
            <div v-if="nutritionData">
                <p><strong>Item:</strong> {{ nutritionData.itemName }}</p>
                <p><strong>Serving Size:</strong> {{ nutritionData.servingSize }}</p>
                <p><strong>Calories:</strong> {{ nutritionData.calories }}</p>
                <p><strong>Fat:</strong> {{ nutritionData.fat }}</p>
                <p><strong>Carbs:</strong> {{ nutritionData.carbohydrates }}</p>
                <p><strong>Protein:</strong> {{ nutritionData.protein }}</p>
            </div>
             <div v-else>
                <p>Loading nutrition data...</p>
            </div>
            <button @click="showModal = false" class="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full">
                Close
            </button>
        </div>
    </div>
  </div>
</template>



<script>
// Mock API functions to simulate network requests
const mockApi = {
  getFridgeItems: async () => ([
    { id: 1, name: "Milk", quantity: 1, unit: "gallon", expirationDate: "2025-11-15" },
    { id: 2, name: "Eggs", quantity: 10, unit: "count", expirationDate: "2025-11-22" },
    { id: 3, name: "Chicken Breast", quantity: 2, unit: "lbs", expirationDate: "2025-11-12" },
  ]),
  updateFridgeItem: async (id, data) => {
    console.log(`Updating item ${id} with`, data);
    return { id, ...data };
  },
  deleteFridgeItem: async (id) => {
    console.log(`Deleting item ${id}`);
    return;
  },
  getNutritionInfo: async (itemName) => {
    console.log(`Fetching nutrition for ${itemName}`);
    // Simulate network delay
    await new Promise(res => setTimeout(res, 500));
    return {
      itemName: itemName,
      servingSize: "1 cup",
      calories: Math.floor(Math.random() * 200 + 50), // Random data for demo
      fat: `${Math.floor(Math.random() * 10)}g`,
      carbohydrates: `${Math.floor(Math.random() * 20)}g`,
      protein: `${Math.floor(Math.random() * 15)}g`
    };
  }
};

export default {
  name: 'FridgeInventory',
  data() {
    return {
      isLoggedIn: true,
      fridgeItems: [],
      showModal: false,
      nutritionData: null,
    };
  },
  async mounted() {
    // Fetch initial data when the component is loaded
    const items = await mockApi.getFridgeItems();
    this.fridgeItems = items.map(item => ({ ...item, isEditing: false, edit: { ...item } }));
  },
  methods: {
    async removeItem(id) {
      if (!confirm('Are you sure you want to remove this item?')) return;
      
      // Call DELETE /api/fridge/items/{id}
      await mockApi.deleteFridgeItem(id);
      this.fridgeItems = this.fridgeItems.filter(item => item.id !== id);
    },
    async showNutrition(itemName) {
        this.nutritionData = null; // Reset previous data
        this.showModal = true;
        // Call GET /api/nutrition?item={itemName}
        this.nutritionData = await mockApi.getNutritionInfo(itemName);
    },
    toggleEdit(id) {
        const item = this.fridgeItems.find(i => i.id === id);
        if (item) {
            item.isEditing = true;
        }
    },
    cancelEdit(id) {
        const item = this.fridgeItems.find(i => i.id === id);
        if (item) {
            // Reset edit state from original data
            item.edit = { ...item };
            item.isEditing = false;
        }
    },
    async saveItem(id) {
        const item = this.fridgeItems.find(i => i.id === id);
        if (item) {
            // Call PUT /api/fridge/items/{id}
            await mockApi.updateFridgeItem(id, item.edit);
            
            // Update the main object with the edited data
            Object.assign(item, item.edit);
            item.isEditing = false;
        }
    }
  }
};
</script>