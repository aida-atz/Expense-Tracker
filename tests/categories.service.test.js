
import { jest } from "@jest/globals";

const categoryId = "category-123";
const userId = "user-123";

jest.unstable_mockModule("../models/category.js", () => ({
  getCategoryById: jest.fn(),
  getAllCategories: jest.fn(),
  createCategory: jest.fn(),
  updateCategoryById: jest.fn(),
  setCategoryArchived: jest.fn(),
}));

const {
  getCategoryById,
  getAllCategories,
  createCategory,
  updateCategoryById,
  setCategoryArchived,
} = await import("../models/category.js");

const {
  validateActiveCategory,
  changeCategoryArchiveStatus,
  updateCategoryService,
  addCategoryService,
  getCategoriesService,
  getCategoryService,
} = await import("../services/categories.js");

beforeEach(() => {
  jest.resetAllMocks();
});


describe("validateActiveCategory", () => {
  test("throws 409 when category is archived", async () => {
    getCategoryById.mockResolvedValue({
      id: categoryId,
      isArchived: true,
    });

    await expect(
      validateActiveCategory(categoryId, userId),
    ).rejects.toMatchObject({
      statusCode: 409,
    });

    expect(getCategoryById).toHaveBeenCalledWith(categoryId, userId);
  });

  test("validates an active category", async () => {
    getCategoryById.mockResolvedValue({
      id: categoryId,
      isArchived: false,
    });

    await expect(
      validateActiveCategory(categoryId, userId),
    ).resolves.toBeUndefined();

    expect(getCategoryById).toHaveBeenCalledWith(categoryId, userId);
  });

  test("throws 404 when category does not exist", async () => {
    getCategoryById.mockResolvedValue(null);

    await expect(
      validateActiveCategory(categoryId, userId),
    ).rejects.toMatchObject({
      statusCode: 404,
    });

    expect(getCategoryById).toHaveBeenCalledWith(categoryId, userId);
  });
});

describe("changeCategoryArchiveStatus", () => {
  test("throws 404 when category does not exist", async () => {
    getCategoryById.mockResolvedValue(null);

    await expect(
      changeCategoryArchiveStatus(categoryId, false, userId),
    ).rejects.toMatchObject({
      statusCode: 404,
    });

    expect(getCategoryById).toHaveBeenCalledWith(categoryId, userId);

    expect(setCategoryArchived).not.toHaveBeenCalled();
  });

  test("throws 403 when category is default", async () => {
    getCategoryById.mockResolvedValue({
      id: categoryId,
      isDefault: true,
      isArchived: false,
    });

    await expect(
      changeCategoryArchiveStatus(categoryId, true, userId),
    ).rejects.toMatchObject({
      statusCode: 403,
    });

    expect(getCategoryById).toHaveBeenCalledWith(categoryId, userId);

    expect(setCategoryArchived).not.toHaveBeenCalled();
  });

  test("throws 409 when category is already archived", async () => {
    getCategoryById.mockResolvedValue({
      id: categoryId,
      isDefault: false,
      isArchived: true,
    });

    await expect(
      changeCategoryArchiveStatus(categoryId, true, userId),
    ).rejects.toMatchObject({
      statusCode: 409,
    });

    expect(getCategoryById).toHaveBeenCalledWith(categoryId, userId);

    expect(setCategoryArchived).not.toHaveBeenCalled();
  });

  test("throws 409 when category is already active", async () => {
    getCategoryById.mockResolvedValue({
      id: categoryId,
      isDefault: false,
      isArchived: false,
    });

    await expect(
      changeCategoryArchiveStatus(categoryId, false, userId),
    ).rejects.toMatchObject({
      statusCode: 409,
    });

    expect(getCategoryById).toHaveBeenCalledWith(categoryId, userId);

    expect(setCategoryArchived).not.toHaveBeenCalled();
  });

  test("successfully archives an active category", async () => {
    getCategoryById.mockResolvedValue({
      id: categoryId,
      isDefault: false,
      isArchived: false,
    });

    setCategoryArchived.mockResolvedValue({
      id: categoryId,
      isDefault: false,
      isArchived: true,
    });

    await expect(
      changeCategoryArchiveStatus(categoryId, true, userId),
    ).resolves.toMatchObject({
      isArchived: true,
    });

    expect(getCategoryById).toHaveBeenCalledWith(categoryId, userId);

    expect(setCategoryArchived).toHaveBeenCalledWith(categoryId, true, userId);
  });

  test("successfully unarchives an archived category", async () => {
    getCategoryById.mockResolvedValue({
      id: categoryId,
      isDefault: false,
      isArchived: true,
    });

    setCategoryArchived.mockResolvedValue({
      id: categoryId,
      isDefault: false,
      isArchived: false,
    });

    await expect(
      changeCategoryArchiveStatus(categoryId, false, userId),
    ).resolves.toMatchObject({
      isArchived: false,
    });

    expect(getCategoryById).toHaveBeenCalledWith(categoryId, userId);

    expect(setCategoryArchived).toHaveBeenCalledWith(categoryId, false, userId);
  });
});

// ------------------------------------
// updateCategoryService
// ------------------------------------

describe("updateCategoryService", () => {
  test("throws 404 when category does not exist", async () => {
    getCategoryById.mockResolvedValue(null);

    await expect(
      updateCategoryService(categoryId, { name: "Groceries" }, userId),
    ).rejects.toMatchObject({
      statusCode: 404,
    });

    expect(getCategoryById).toHaveBeenCalledWith(categoryId, userId);

    expect(updateCategoryById).not.toHaveBeenCalled();
  });

  test("throws 403 when updating a default category", async () => {
    const data = { name: "Groceries" };

    getCategoryById.mockResolvedValue({
      id: categoryId,
      name: "Food",
      isDefault: true,
      isArchived: false,
    });

    await expect(
      updateCategoryService(categoryId, data, userId),
    ).rejects.toMatchObject({
      statusCode: 403,
    });

    expect(getCategoryById).toHaveBeenCalledWith(categoryId, userId);

    expect(updateCategoryById).not.toHaveBeenCalled();
  });

  test("throws 409 when updating an archived category", async () => {
    const data = { name: "Groceries" };

    getCategoryById.mockResolvedValue({
      id: categoryId,
      name: "Food",
      isDefault: false,
      isArchived: true,
    });

    await expect(
      updateCategoryService(categoryId, data, userId),
    ).rejects.toMatchObject({
      statusCode: 409,
    });

    expect(getCategoryById).toHaveBeenCalledWith(categoryId, userId);

    expect(updateCategoryById).not.toHaveBeenCalled();
  });

  test("successfully updates an active custom category", async () => {
    const data = { name: "  Groceries  " };

    const updatedCategory = {
      id: categoryId,
      name: "Groceries",
      isDefault: false,
      isArchived: false,
    };

    getCategoryById.mockResolvedValue({
      id: categoryId,
      name: "Food",
      isDefault: false,
      isArchived: false,
    });

    updateCategoryById.mockResolvedValue(updatedCategory);

    const result = await updateCategoryService(categoryId, data, userId);

    expect(result).toEqual(updatedCategory);

    expect(getCategoryById).toHaveBeenCalledWith(categoryId, userId);

    expect(updateCategoryById).toHaveBeenCalledWith(
      categoryId,
      { name: "Groceries" },
      userId,
    );

    expect(updateCategoryById).toHaveBeenCalledTimes(1);
  });
});

// ------------------------------------
// getCategoriesService
// ------------------------------------

describe("getCategoriesService", () => {
  test("passes userId to repository and returns categories", async () => {
    const categories = [
      {
        id: "default-category",
        name: "Food",
        isDefault: true,
        userId: null,
      },
      {
        id: "custom-category",
        name: "Gaming",
        isDefault: false,
        userId,
      },
    ];

    getAllCategories.mockResolvedValue(categories);

    const result = await getCategoriesService(userId);

    expect(getAllCategories).toHaveBeenCalledWith(userId);
    expect(getAllCategories).toHaveBeenCalledTimes(1);
    expect(result).toEqual(categories);
  });
});
