import { CreateProductInputs } from '@/features/product/schema';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const product1: CreateProductInputs = {
    name: 'Croffle',
    description: 'Test',
    categoryId: 'cm3x4hmjk000dthfuez2zmhzw',
    imageUrl: '',
    meta: {
      type: 'sku-only',
      skuObject: {
        sku: 'CROFF',
        price: 16,
        costPrice: 6,
        stock: 100,
        lowStockThreshold: 30,
      },
    },
  };

  const product2: CreateProductInputs = {
    name: 'Cafe Americano',
    description: 'Test',
    categoryId: 'cm3x4hmjk000dthfuez2zmhzw',
    imageUrl: '',
    meta: {
      type: 'with-variants',
      attributes: [
        {
          name: 'Size',
          options: [
            {
              value: '12oz',
            },
            { value: '16oz' },
            { value: '22oz' },
          ],
        },
      ],
      variants: [
        {
          attr1: '12oz',
          sku: 'CAF-AME-12OZ',
          price: 129,
          costPrice: 79,
          stock: 120,
          lowStockThreshold: 12,
        },
        {
          attr1: '16oz',
          sku: 'CAF-AME-16OZ',
          price: 169,
          costPrice: 79,
          stock: 160,
          lowStockThreshold: 16,
        },
        {
          attr1: '22oz',
          sku: 'CAF-AME-22OZ',
          price: 229,
          costPrice: 79,
          stock: 220,
          lowStockThreshold: 22,
        },
      ],
    },
  };

  const product3: CreateProductInputs = {
    name: 'Match Latte',
    description: 'Test',
    categoryId: 'cm3x4hmjk000dthfuez2zmhzw',
    imageUrl: '',
    meta: {
      type: 'with-variants',
      attributes: [
        {
          name: 'Size',
          options: [
            {
              value: '12oz',
            },
            { value: '16oz' },
            { value: '22oz' },
          ],
        },
        {
          name: 'Temp',
          options: [
            {
              value: 'Hot',
            },
            { value: 'Cold' },
          ],
        },
      ],
      variants: [
        {
          attr1: '12oz',
          attr2: 'Hot',
          sku: 'MAT-LAT-12OZ-HOT',
          price: 129,
          costPrice: 79,
          stock: 120,
          lowStockThreshold: 12,
        },
        {
          attr1: '16oz',
          attr2: 'Hot',
          sku: 'MAT-LAT-16OZ-HOT',
          price: 169,
          costPrice: 79,
          stock: 160,
          lowStockThreshold: 16,
        },
        {
          attr1: '22oz',
          attr2: 'Hot',
          sku: 'MAT-LAT-22OZ-HOT',
          price: 229,
          costPrice: 79,
          stock: 220,
          lowStockThreshold: 22,
        },
        {
          attr1: '12oz',
          attr2: 'Cold',
          sku: 'MAT-LAT-12OZ-COLD',
          price: 129,
          costPrice: 79,
          stock: 120,
          lowStockThreshold: 12,
        },
        {
          attr1: '16oz',
          attr2: 'Cold',
          sku: 'MAT-LAT-16OZ-COLD',
          price: 169,
          costPrice: 79,
          stock: 160,
          lowStockThreshold: 16,
        },
        {
          attr1: '22oz',
          attr2: 'Cold',
          sku: 'MAT-LAT-22OZ-COLD',
          price: 229,
          costPrice: 79,
          stock: 220,
          lowStockThreshold: 22,
        },
      ],
    },
  };

  const p1 = await createProduct(product1);
  const p2 = await createProduct(product2);
  const p3 = await createProduct(product3);

  console.log(`Products created: `, p1, p2, p3);
  // seed categories
  // const categories = await prisma.category.createMany({
  //   data: [
  //     'Women Clothes',
  //     'Men Clothes',
  //     'Beauty',
  //     'Health',
  //     'Fashion Accessories',
  //     'Home & Living',
  //     'Men Shoes',
  //     'Women Shoes',
  //     'Men Bags',
  //     'Women Bags',
  //     'Watches',
  //     'Electronics Parts & Components',
  //     'Computers & Accessories',
  //     'Drinks',
  //     'Bread & Pastries',
  //     'Sports & Outdoors',
  //     'Stationery',
  //     'Bookes & Magazines',
  //     'Automobile Parts & Accessories',
  //     'Motorcycle Parts & Accessories',
  //     'Pets',
  //     'Baby & Kids',
  //     'Travel & Luggage',
  //   ].map((category) => ({
  //     name: category,
  //   })),
  // });

  // console.log(`Successfully seeded ${categories.count} categories`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    if (e instanceof Error) {
      console.error(e.message);
    } else {
      console.error(e);
    }

    await prisma.$disconnect();
    process.exit(1);
  });

async function createProduct(parsedInput: CreateProductInputs) {
  const ownerId = 'user_2pFKJge72BTSadLZWOQ21E0cFMG';
  const storeId = 'cm3we4jfl001m4xhnedzymiwz';

  const { type } = parsedInput.meta;

  if (type === 'sku-only') {
    const product = await prisma.product.create({
      data: {
        ownerId,
        storeId,
        categoryId: parsedInput.categoryId,
        name: parsedInput.name,
        description: parsedInput.description,
        imageUrl: parsedInput.imageUrl,
        variants: {
          create: [
            {
              storeId: storeId,
              sku: parsedInput.meta.skuObject.sku,
              price: parsedInput.meta.skuObject.price,
              costPrice: parsedInput.meta.skuObject.costPrice,
              imageUrl: parsedInput.imageUrl,
              stock: parsedInput.meta.skuObject.stock,
              lowStockThreshold: parsedInput.meta.skuObject.lowStockThreshold,
              order: 1,
            },
          ],
        },
      },
    });

    return { product };
  }

  const { attributes, variants } = parsedInput.meta;

  const product = await prisma.product.create({
    data: {
      ownerId,
      storeId,
      categoryId: parsedInput.categoryId,
      name: parsedInput.name,
      description: parsedInput.description,
      imageUrl: parsedInput.imageUrl,
      attributes: {
        create: attributes.map((attr) => ({
          name: attr.name,
          values: {
            create: attr.options.map((opt) => ({ value: opt.value })),
          },
        })),
      },
    },
    include: {
      attributes: {
        include: {
          values: true,
        },
      },
    },
  });

  const attr1 = product.attributes.at(0);
  const attr2 = product.attributes.at(1);

  if (attr1 && !attr2) {
    if (variants?.length) {
      const createdVariants = await prisma.productVariant.createMany({
        data: variants?.map((variant, index) => ({
          storeId: storeId,
          productId: product.id,
          sku: variant.sku,
          price: variant.price,
          costPrice: variant.costPrice,
          imageUrl: parsedInput.imageUrl,
          stock: variant.stock ?? 0,
          lowStockThreshold: variant.lowStockThreshold ?? 0,
          order: index + 1,
        })),
      });

      console.log('Created variants: ', createdVariants);
    }
  }

  if (attr1 && attr2) {
    if (variants?.length) {
      const createdVariants = await prisma.$transaction(
        variants.map((variant, index) => {
          return prisma.productVariant.create({
            data: {
              storeId: storeId,
              productId: product.id,
              sku: variant.sku,
              price: variant.price,
              costPrice: variant.costPrice,
              imageUrl: parsedInput.imageUrl,
              stock: variant.stock ?? 0,
              lowStockThreshold: variant.lowStockThreshold ?? 0,
              order: index + 1,

              productAttributeValues: {
                create: [
                  {
                    attributeValue: {
                      connect: {
                        id: attr1.values.find((v) => v.value === variant.attr1)
                          ?.id,
                      },
                    },
                  },
                  {
                    attributeValue: {
                      connect: {
                        id: attr2.values.find((v) => v.value === variant.attr2)
                          ?.id,
                      },
                    },
                  },
                ],
              },
            },
          });
        })
      );

      console.log('Created variants: ', createdVariants);
    }
  }

  return product;
}
