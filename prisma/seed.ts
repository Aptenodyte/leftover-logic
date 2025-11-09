import { PrismaClient, Item } from '../app/generated/prisma/client';

const prisma = new PrismaClient();

// Helper function to get a future date for expiry
const getFutureDate = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

async function main() {
  console.log('🌱 Starting the seeding process...');

  // 1. --- Clean up existing data to ensure idempotency ---
  console.log('🧹 Cleaning up the database...');
  // Delete in reverse order of creation to respect foreign key constraints
  await prisma.recipeItem.deleteMany();
  await prisma.nutritionalValue.deleteMany();
  await prisma.fridgeItem.deleteMany();
  await prisma.item.deleteMany();
  await prisma.fridge.deleteMany();
  await prisma.user.deleteMany();
  await prisma.recipe.deleteMany();

  // 2. --- Create a sample user ---
  console.log('👤 Creating a sample user...');
  const user = await prisma.user.create({
    data: {
      email: 'testuser@example.com',
      passwordHash: 'hashed_password_placeholder', // In a real app, this would be a proper hash
      salt: 'salt_placeholder',
    },
  });

  // 3. --- Create a fridge for the user ---
  console.log('🧊 Creating a fridge for the user...');
  const fridge = await prisma.fridge.create({
    data: {
      userId: user.id,
    },
  });

  // 4. --- Create generic items with nutritional values ---
  console.log('🍎 Creating generic items and their nutritional values...');
  const itemsData = [
    { name: 'Egg', nutrition: { servingSize: '1 large (50g)', calories: 78, protein: 6, totalFat: 5 } },
    { name: 'Whole Milk', nutrition: { servingSize: '1 cup (244g)', calories: 149, protein: 8, totalFat: 8 } },
    { name: 'Chicken Breast', nutrition: { servingSize: '3oz (85g)', calories: 165, protein: 31, totalFat: 3.6 } },
    { name: 'Cheddar Cheese', nutrition: { servingSize: '1oz (28g)', calories: 113, protein: 7, totalFat: 9 } },
    { name: 'Onion', nutrition: { servingSize: '1 medium (110g)', calories: 44, protein: 1.2, totalFat: 0.1 } },
    { name: 'Spaghetti', nutrition: { servingSize: '2oz (57g)', calories: 200, protein: 7, totalFat: 1 } },
    { name: 'Tomato Sauce', nutrition: { servingSize: '1/2 cup (122g)', calories: 39, protein: 1.6, totalFat: 0.3 } },
    { name: 'Olive Oil', nutrition: { servingSize: '1 tbsp (14g)', calories: 119, protein: 0, totalFat: 14 } },
  ];

  const createdItems = new Map<string, Item>();
  for (const item of itemsData) {
    const newItem = await prisma.item.create({
      data: {
        name: item.name,
        nutritionalValue: {
          create: item.nutrition,
        },
      },
    });
    createdItems.set(item.name, newItem);
  }
  
  // 5. --- Populate the user's fridge with instances of generic items ---
  console.log('🧀 Populating the fridge with items...');
  await prisma.fridgeItem.createMany({
    data: [
      { fridgeId: fridge.id, itemId: createdItems.get('Egg')!.id, quantity: 10, unit: 'count', expirationDate: getFutureDate(14) },
      { fridgeId: fridge.id, itemId: createdItems.get('Whole Milk')!.id, quantity: 0.5, unit: 'gallon', expirationDate: getFutureDate(7) },
      { fridgeId: fridge.id, itemId: createdItems.get('Chicken Breast')!.id, quantity: 2, unit: 'lbs', expirationDate: getFutureDate(3) },
      { fridgeId: fridge.id, itemId: createdItems.get('Cheddar Cheese')!.id, quantity: 8, unit: 'oz', expirationDate: getFutureDate(21) },
    ],
  });

  // 6. --- Create sample recipes and their ingredients ---
  console.log('🍳 Creating sample recipes...');

  // Recipe 1: Cheesy Scrambled Eggs
  const scrambledEggs = await prisma.recipe.create({
    data: {
      title: 'Cheesy Scrambled Eggs',
      description: 'A quick and delicious breakfast classic.',
      instructions: '1. Whisk eggs and milk in a bowl. 2. Melt butter in a pan over medium heat. 3. Pour in egg mixture and cook, stirring occasionally. 4. When eggs are nearly set, stir in cheese. 5. Serve immediately.',
      ingredients: {
        createMany: {
          data: [
            { itemId: createdItems.get('Egg')!.id, quantity: 3, unit: 'count' },
            { itemId: createdItems.get('Whole Milk')!.id, quantity: 2, unit: 'tbsp' },
            { itemId: createdItems.get('Cheddar Cheese')!.id, quantity: 0.25, unit: 'cup' },
          ],
        },
      },
    },
  });

  // Recipe 2: Simple Chicken Spaghetti
  const chickenSpaghetti = await prisma.recipe.create({
    data: {
      title: 'Simple Chicken Spaghetti',
      description: 'An easy weeknight pasta dish for the whole family.',
      instructions: '1. Cook spaghetti according to package directions. 2. While pasta cooks, sauté diced onion in olive oil until soft. 3. Add chicken and cook through. 4. Stir in tomato sauce and simmer for 10 minutes. 5. Drain pasta and combine with sauce. Serve hot.',
      ingredients: {
        createMany: {
          data: [
            { itemId: createdItems.get('Spaghetti')!.id, quantity: 8, unit: 'oz' },
            { itemId: createdItems.get('Chicken Breast')!.id, quantity: 1, unit: 'lb' },
            { itemId: createdItems.get('Onion')!.id, quantity: 1, unit: 'count' },
            { itemId: createdItems.get('Tomato Sauce')!.id, quantity: 15, unit: 'oz' },
            { itemId: createdItems.get('Olive Oil')!.id, quantity: 1, unit: 'tbsp' },
          ],
        },
      },
    },
  });

  console.log('✅ Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ An error occurred during seeding:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });