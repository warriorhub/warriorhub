-- CreateTable
CREATE TABLE "CategoryNew" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "CategoryNew_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryNewToEvent" (
    "A" INTEGER NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CategoryNew_name_key" ON "CategoryNew"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryNewToEvent_AB_unique" ON "_CategoryNewToEvent"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryNewToEvent_B_index" ON "_CategoryNewToEvent"("B");

-- AddForeignKey
ALTER TABLE "_CategoryNewToEvent" ADD CONSTRAINT "_CategoryNewToEvent_A_fkey" FOREIGN KEY ("A") REFERENCES "CategoryNew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryNewToEvent" ADD CONSTRAINT "_CategoryNewToEvent_B_fkey" FOREIGN KEY ("B") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
