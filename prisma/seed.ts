import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: "Electronics", slug: "electronics", description: "Gadgets, phones, and computers" },
    { name: "Collectibles", slug: "collectibles", description: "Rare items and memorabilia" },
    { name: "Fashion", slug: "fashion", description: "Clothing and accessories" },
    { name: "Real Estate", slug: "real-estate", description: "Properties and land" },
    { name: "Services", slug: "services", description: "Professional and creative services" },
    { name: "Art", slug: "art", description: "Paintings, sculptures, and digital art" },
  ];

  console.log("Seeding categories...");

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
