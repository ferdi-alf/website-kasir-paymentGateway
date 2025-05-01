-- DropForeignKey
ALTER TABLE "DetailPenjualan" DROP CONSTRAINT "DetailPenjualan_menuId_fkey";

-- DropForeignKey
ALTER TABLE "DetailPenjualan" DROP CONSTRAINT "DetailPenjualan_penjualanId_fkey";

-- DropForeignKey
ALTER TABLE "Penjualan" DROP CONSTRAINT "Penjualan_userId_fkey";

-- AddForeignKey
ALTER TABLE "Penjualan" ADD CONSTRAINT "Penjualan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailPenjualan" ADD CONSTRAINT "DetailPenjualan_penjualanId_fkey" FOREIGN KEY ("penjualanId") REFERENCES "Penjualan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailPenjualan" ADD CONSTRAINT "DetailPenjualan_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
