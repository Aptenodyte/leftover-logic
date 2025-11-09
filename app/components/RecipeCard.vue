<template>
  <div class="card-container h-96 cursor-pointer" @click="isFlipped = !isFlipped">
    <div class="card-inner w-full h-full" :class="{ 'is-flipped': isFlipped }">
      
      <!-- FRONT OF THE CARD (Updated with Edit Button) -->
      <div class="card-face card-front bg-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between">
        <div>
          <img :src="recipe.imageUrl" :alt="`Image of ${recipe.title}`" class="w-full h-48 object-cover">
          <div class="p-5">
            <h3 class="text-xl font-bold text-gray-800 mb-2">{{ recipe.title }}</h3>
            <p class="text-gray-600 text-sm">{{ recipe.description }}</p>
          </div>
        </div>
        <div class="p-5 pt-0 flex justify-between items-center text-sm text-gray-500">
          <span><strong>Time:</strong> {{ recipe.prepTime }}</span>
          <div class="flex items-center">
            <!-- EDIT BUTTON -->
            <button @click.stop="$emit('edit-recipe', recipe)" class="p-1 text-gray-500 hover:text-blue-600 transition mr-2" title="Edit Recipe">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
              </svg>
            </button>
            <span :class="difficultyClass" class="px-2 py-1 rounded-full text-xs font-semibold">{{ recipe.difficulty }}</span>
          </div>
        </div>
      </div>

      <!-- BACK OF THE CARD (Unchanged) -->
      <div class="card-face card-back bg-white rounded-lg shadow-md overflow-hidden p-5">
        <h4 class="text-xl font-bold text-gray-800 border-b pb-2 mb-3">Ingredients</h4>
        <ul class="list-disc list-inside text-gray-700 space-y-1">
          <li v-for="ingredient in recipe.ingredients" :key="ingredient">
            {{ ingredient }}
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'RecipeCard',
  props: {
    recipe: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isFlipped: false,
    };
  },
  computed: {
    difficultyClass() {
      switch (this.recipe.difficulty.toLowerCase()) {
        case 'easy':
          return 'bg-green-100 text-green-800';
        case 'medium':
          return 'bg-yellow-100 text-yellow-800';
        case 'hard':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    },
  },
};
</script>

<style scoped>
/* 
  Tailwind doesn't have perspective or transform-style utilities by default,
  so we add them here. This is a common and perfectly valid approach.
*/

.card-container {
  perspective: 1000px;
}

.card-inner {
  position: relative;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.card-inner.is-flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden; /* This hides the back of the element when it's facing away from the user */
}

.card-back {
  transform: rotateY(180deg); /* Start with the back face already rotated */
}
</style>