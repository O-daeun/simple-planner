import prismaPkg from "@prisma/client";

const { PrismaClient } = prismaPkg;

function guardrails() {
  if (process.env.NODE_ENV === "production") {
    console.error("Refusing to run in production environment.");
    process.exitCode = 1;
    return false;
  }

  return true;
}

async function main() {
  if (!guardrails()) return;
  const prisma = new PrismaClient();
  try {
    const [exceptions, recurrences, timeBlocks] = await prisma.$transaction([
      prisma.timeBlockRecurrenceException.deleteMany({}),
      prisma.timeBlockRecurrence.deleteMany({}),
      prisma.timeBlock.deleteMany({}),
    ]);

    console.log(
      `Deleted schedule data: exceptions=${exceptions.count}, recurrences=${recurrences.count}, timeBlocks=${timeBlocks.count}`
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Failed to clear schedule data:", error);
  process.exitCode = 1;
});
