/**
 * Pagination yardımcı fonksiyon testleri
 */
import { describe, it, expect } from "vitest";
import { parsePagination } from "@/lib/cms/pagination";

describe("Pagination Testleri", () => {
  describe("parsePagination", () => {
    it("varsayılan değerler doğru olmalı", () => {
      const result = parsePagination({});
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(20);
      expect(result.skip).toBe(0);
    });

    it("sayfa 2 ile skip hesaplaması doğru olmalı", () => {
      const result = parsePagination({ page: 2, pageSize: 10 });
      expect(result.page).toBe(2);
      expect(result.skip).toBe(10);
    });

    it("negatif sayfa 1'e normalize edilmeli", () => {
      const result = parsePagination({ page: -5 });
      expect(result.page).toBeGreaterThanOrEqual(1);
    });

    it("0 sayfa 1'e normalize edilmeli", () => {
      const result = parsePagination({ page: 0 });
      expect(result.page).toBeGreaterThanOrEqual(1);
    });

    it("aşırı büyük pageSize sınırlandırılmalı", () => {
      const result = parsePagination({ pageSize: 99999 });
      expect(result.pageSize).toBeLessThanOrEqual(100);
    });

    it("negatif pageSize varsayılana dönmeli", () => {
      const result = parsePagination({ pageSize: -1 });
      expect(result.pageSize).toBeGreaterThan(0);
    });

    it("skip = (page-1) * pageSize formülü doğru olmalı", () => {
      const { page, pageSize, skip } = parsePagination({ page: 5, pageSize: 15 });
      expect(skip).toBe((page - 1) * pageSize);
    });

    it("take = pageSize olmalı", () => {
      const result = parsePagination({ page: 3, pageSize: 25 });
      expect(result.take).toBe(result.pageSize);
    });
  });
});
