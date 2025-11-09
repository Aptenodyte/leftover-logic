<template>
  <div>
    <AppHeader :is-logged-in="true" />

    <main class="bg-gray-100 min-h-screen p-8">
      <div class="container mx-auto">
        <h1 class="text-4xl font-bold text-gray-800 mb-8">Generate a New Recipe</h1>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <!-- LEFT COLUMN: GENERATION CONTROLS -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-semibold text-gray-700 mb-6 border-b pb-4">Recipe Preferences</h2>
            <form @submit.prevent="generateRecipe" class="space-y-6">
              <!-- Total Calories -->
              <div>
                <label for="calories" class="block font-medium text-gray-700">Max Calories: <span class="font-bold text-green-600">{{ formData.calories }}</span></label>
                <input id="calories" type="range" min="300" max="2000" step="50" v-model.number="formData.calories" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
              </div>

              <!-- MEAL TYPE (NEW) -->
              <div>
                <label class="block font-medium text-gray-700 mb-2">Meal Type</label>
                <div class="flex space-x-4">
                  <label v-for="option in mealTypeOptions" :key="option" class="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" :value="option" v-model="formData.mealType" name="mealType" class="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500">
                    <span>{{ option }}</span>
                  </label>
                </div>
              </div>

              <!-- Type of Food / Cuisine (UPDATED) -->
              <div>
                <label for="cuisine" class="block font-medium text-gray-700">Cuisine</label>
                <select id="cuisine" v-model="formData.cuisine" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option v-for="cuisine in cuisineOptions" :key="cuisine" :value="cuisine">{{ cuisine }}</option>
                </select>
              </div>

              <!-- Dietary Restrictions -->
              <div>
                <label class="block font-medium text-gray-700 mb-2">Dietary Restrictions</label>
                <div class="grid grid-cols-2 gap-2">
                  <label v-for="option in dietaryOptions" :key="option.value" class="flex items-center space-x-2">
                    <input type="checkbox" :value="option.value" v-model="formData.dietaryRestrictions" class="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500">
                    <span>{{ option.label }}</span>
                  </label>
                </div>
              </div>

              <!-- Use Expiring Ingredients -->
              <div class="flex items-center justify-between bg-green-50 p-3 rounded-md">
                <label for="expiring" class="font-medium text-gray-700">Use ingredients expiring soon?</label>
                <div @click="formData.useExpiring = !formData.useExpiring" class="relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer">
                  <span :class="formData.useExpiring ? 'bg-green-600' : 'bg-gray-200'" class="absolute w-full h-full rounded-full"></span>
                  <span :class="formData.useExpiring ? 'translate-x-6' : 'translate-x-1'" class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform"></span>
                </div>
              </div>

              <!-- Submit Button -->
              <button type="submit" :disabled="isLoading" class="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-md text-lg hover:bg-green-700 transition disabled:bg-gray-400">
                {{ isLoading ? 'Generating...' : 'Generate Recipe' }}
              </button>
            </form>
          </div>

          <!-- RIGHT COLUMN: RECIPE RESULT (Unchanged) -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <!-- Initial, Loading, and Result states are all the same -->
            <div v-if="!generatedRecipe && !isLoading" class="text-center flex flex-col items-center justify-center h-full">
              <h2 class="text-2xl font-semibold text-gray-700">Your recipe will appear here</h2>
              <p class="text-gray-500 mt-2">Adjust the preferences and click generate!</p>
            </div>
            <div v-if="isLoading" class="text-center flex flex-col items-center justify-center h-full">
               <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
               <p class="mt-4 text-gray-600">Our AI is crafting your masterpiece...</p>
            </div>
            <div v-if="generatedRecipe && !isLoading" class="space-y-4">
              <img :src="generatedRecipe.imageUrl" alt="Generated Recipe Image" class="w-full h-64 object-cover rounded-lg">
              <h2 class="text-3xl font-bold">{{ generatedRecipe.title }}</h2>
              <p>{{ generatedRecipe.description }}</p>
              <div>
                <h3 class="text-xl font-semibold border-b pb-2">Ingredients</h3>
                <ul class="list-disc list-inside mt-2 space-y-1">
                  <li v-for="ing in generatedRecipe.ingredients" :key="ing">{{ ing }}</li>
                </ul>
              </div>
              <div>
                <h3 class="text-xl font-semibold border-b pb-2">Instructions</h3>
                <ol class="list-decimal list-inside mt-2 space-y-2">
                   <li v-for="step in generatedRecipe.instructions" :key="step">{{ step }}</li>
                </ol>
              </div>
              <div class="flex space-x-4 pt-4">
                 <button class="flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition">Save Recipe</button>
                 <button @click="resetGenerator" class="flex-1 bg-gray-200 font-bold py-2 px-4 rounded-md hover:bg-gray-300 transition">Generate Another</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<script>
import AppHeader from '~/components/AppHeader.vue';

// The mock API does not need to change, as it just simulates a response
const mockApi = {
  generateRecipe: async (criteria) => {
    console.log("Generating recipe with criteria:", criteria);
    await new Promise(res => setTimeout(res, 2000)); // Simulate AI thinking time
    return {
      title: "Spicy Black Bean & Quinoa Bowl",
      description: "A vibrant and healthy Mexican-inspired bowl, generated based on your preferences.",
      prepTime: "35 minutes",
      difficulty: "Easy",
      imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2960&auto.format&fit=crop",
      ingredients: ["1 cup quinoa, rinsed", "1 can (15 oz) black beans, rinsed", "1 cup corn kernels", "1 avocado, diced", "1/4 cup chopped cilantro", "Lime wedges"],
      instructions: ["Cook quinoa according to package directions.", "Combine cooked quinoa, black beans, and corn.", "Top with diced avocado and fresh cilantro.", "Serve with a squeeze of fresh lime juice."],
    };
  }
};

export default {
  name: 'GenerateRecipePage',
  components: { AppHeader },
  data() {
    return {
      isLoading: false,
      generatedRecipe: null,
      formData: {
        calories: 800,
        mealType: 'Any', // NEW
        cuisine: 'Any',
        dietaryRestrictions: [],
        useExpiring: true,
      },
      mealTypeOptions: ['Any', 'Breakfast', 'Lunch', 'Dinner'], // NEW
      dietaryOptions: [
        { label: 'Vegetarian', value: 'vegetarian' },
        { label: 'Vegan', value: 'vegan' },
        { label: 'Gluten-Free', value: 'gluten-free' },
        { label: 'Dairy-Free', value: 'dairy-free' },
      ],
      cuisineOptions: ['Any', 'Mexican', 'Chinese', 'Italian', 'Indian', 'American'], // UPDATED
    };
  },
  methods: {
    async generateRecipe() {
      this.isLoading = true;
      this.generatedRecipe = null;
      this.generatedRecipe = await mockApi.generateRecipe(this.formData);
      this.isLoading = false;
    },
    resetGenerator() {
      this.generatedRecipe = null;
    }
  }
};
</script>