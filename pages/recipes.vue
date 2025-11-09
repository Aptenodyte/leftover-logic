<template>
  <div>
    <AppHeader :is-logged-in="isLoggedIn" @logout="handleUserLogout" />

    <main class="bg-gray-100 min-h-screen p-8">
      <div class="container mx-auto">
        <h1 class="text-4xl font-bold text-gray-800 mb-8">My Saved Recipes</h1>

        <!-- Grid for Recipe Cards -->
        <div v-if="savedRecipes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Listen for the 'edit-recipe' event from the card component -->
          <RecipeCard 
            v-for="recipe in savedRecipes" 
            :key="recipe.id" 
            :recipe="recipe"
            @edit-recipe="openEditModal" 
          />
        </div>

        <!-- Message for when there are no saved recipes -->
        <div v-else class="text-center bg-white p-12 rounded-lg shadow-md">
          <h2 class="text-2xl font-semibold text-gray-700 mb-4">You don't have any saved recipes yet.</h2>
          <p class="text-gray-500 mb-6">Start by generating a new recipe based on your fridge's inventory!</p>
          <button class="bg-green-600 text-white font-bold px-6 py-3 rounded-md text-lg hover:bg-green-700 transition">
            Generate New Recipe
          </button>
        </div>
      </div>
    </main>

    <!-- EDIT RECIPE MODAL -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h2 class="text-2xl font-bold mb-4">Edit Recipe</h2>
        
        <!-- Form for editing -->
        <form v-if="recipeToEdit" @submit.prevent="saveRecipeChanges">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" v-model="recipeToEdit.title" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea v-model="recipeToEdit.description" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Ingredients (one per line)</label>
              <textarea v-model="editableIngredients" rows="5" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button type="button" @click="closeModal" class="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from '~/components/AppHeader.vue';
import RecipeCard from '~/components/RecipeCard.vue';

const mockApi = {
  getSavedRecipes: async () => ([
    { id: 101, title: "Spicy Chicken Stir-Fry", description: "A quick and delicious weeknight meal.", prepTime: "25 minutes", difficulty: "Easy", imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2960&auto.format&fit=crop", ingredients: ["1 lb chicken breast, sliced", "1 bell pepper, sliced", "1 onion, sliced", "2 cloves garlic, minced", "1/4 cup soy sauce", "2 tbsp honey", "1 tbsp sriracha"] },
    { id: 102, title: "Cheesy Broccoli Soup", description: "A creamy, comforting soup perfect for using up broccoli.", prepTime: "30 minutes", difficulty: "Easy", imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=3087&auto.format&fit=crop", ingredients: ["4 cups broccoli florets", "1 onion, chopped", "2 carrots, chopped", "4 cups vegetable broth", "1 cup heavy cream", "2 cups shredded cheddar cheese"] },
    { id: 103, title: "Egg & Veggie Scramble", description: "A versatile breakfast for any vegetables you have.", prepTime: "15 minutes", difficulty: "Beginner", imageUrl: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=3110&auto.format&fit=crop", ingredients: ["4 large eggs", "1/4 cup milk", "1/2 cup chopped spinach", "1/4 cup diced tomatoes", "Salt and pepper to taste"] },
  ]),
  updateRecipe: async (recipeId, updatedData) => {
    console.log(`Updating recipe ${recipeId} with:`, updatedData);
    await new Promise(res => setTimeout(res, 500)); // Simulate network delay
    return { id: recipeId, ...updatedData };
  }
};

export default {
  name: 'MyRecipesPage',
  components: {
    AppHeader,
    RecipeCard,
  },
  data() {
    return {
      isLoggedIn: true,
      savedRecipes: [],
      isModalOpen: false,
      recipeToEdit: null,
    };
  },
  computed: {
    // Computed property to handle converting the ingredients array to a string and back
    editableIngredients: {
      get() {
        return this.recipeToEdit ? this.recipeToEdit.ingredients.join('\n') : '';
      },
      set(value) {
        if (this.recipeToEdit) {
          this.recipeToEdit.ingredients = value.split('\n').filter(line => line.trim() !== '');
        }
      }
    }
  },
  async mounted() {
    this.savedRecipes = await mockApi.getSavedRecipes();
  },
  methods: {
    openEditModal(recipe) {
      // Create a deep copy of the recipe object to avoid mutating the original data directly
      this.recipeToEdit = JSON.parse(JSON.stringify(recipe));
      this.isModalOpen = true;
    },
    async saveRecipeChanges() {
      if (!this.recipeToEdit) return;

      // Call the API to save the changes
      const updatedRecipe = await mockApi.updateRecipe(this.recipeToEdit.id, this.recipeToEdit);

      // Find the index of the original recipe in the array
      const index = this.savedRecipes.findIndex(r => r.id === updatedRecipe.id);
      if (index !== -1) {
        // Replace the old recipe data with the updated data
        this.savedRecipes.splice(index, 1, updatedRecipe);
      }
      
      this.closeModal();
    },
    closeModal() {
      this.isModalOpen = false;
      this.recipeToEdit = null;
    },
    handleUserLogout() {
      this.isLoggedIn = false;
      this.$router.push('/'); // Redirect to homepage on logout
    },
  },
};
</script>