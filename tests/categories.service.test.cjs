jest.mock("../models/category.cjs", () => ({
  getCategoryById: jest.fn(),
  setCategoryArchived: jest.fn(),
  updateCategoryById: jest.fn(),
}));
const {
  getCategoryById,
  setCategoryArchived,
  updateCategoryById,
} = require("../models/category.cjs");
const {
  validateActiveCategory,
  changeCategoryArchiveStatus,
  updateCategoryService,
} = require("../services/categories.cjs");
beforeEach(() => {
  jest.resetAllMocks();
});
describe("validateActiveCategory", () => {
  test("throws 409 when category is archived", async () => {
    getCategoryById.mockResolvedValue({
      id: "category-123",
      isArchived: true,
    });
    await expect(validateActiveCategory("category-123")).rejects.toMatchObject({
      statusCode: 409,
    });
    expect(getCategoryById).toHaveBeenCalledWith("category-123");
  });
  test("Active Category is validated", async () => {
    getCategoryById.mockResolvedValue({
      id: "category-123",
      isArchived: false,
    });
    await expect(
      validateActiveCategory("category-123"),
    ).resolves.toBeUndefined();
    expect(getCategoryById).toHaveBeenCalledWith("category-123");
  });
  test("throws 404 when category does not exist", async () => {
    getCategoryById.mockResolvedValue(null);
    await expect(validateActiveCategory("category-123")).rejects.toMatchObject({
      statusCode: 404,
    });
    expect(getCategoryById).toHaveBeenCalledWith("category-123");
  });
});

describe("changeCategoryArchiveStatus", () => {
  test("throws 404 when category does not exist", async () => {
    getCategoryById.mockResolvedValue(null);
    await expect(
      changeCategoryArchiveStatus("category-123", false),
    ).rejects.toMatchObject({
      statusCode: 404,
    });
    expect(getCategoryById).toHaveBeenCalledWith("category-123");
    expect(setCategoryArchived).not.toHaveBeenCalled();
  });
  test("throws 403 when category is default", async () => {
    getCategoryById.mockResolvedValue({
      id: "category-123",
      isArchived: false,
      isDefault: true,
    });
    await expect(
      changeCategoryArchiveStatus("category-123", false),
    ).rejects.toMatchObject({
      statusCode: 403,
    });
    expect(getCategoryById).toHaveBeenCalledWith("category-123");
    expect(setCategoryArchived).not.toHaveBeenCalled();
  });
  test("throws 409 when category is already archived", async () => {
    getCategoryById.mockResolvedValue({
      id: "category-123",
      isDefault: false,
      isArchived: true,
    });
    await expect(
      changeCategoryArchiveStatus("category-123", true),
    ).rejects.toMatchObject({
      statusCode: 409,
    });
    expect(getCategoryById).toHaveBeenCalledWith("category-123");
    expect(setCategoryArchived).not.toHaveBeenCalled();
  });

  test("throws 409 when category is already archived", async () => {
    getCategoryById.mockResolvedValue({
      id: "category-123",
      isDefault: false,
      isArchived: true,
    });
    await expect(
      changeCategoryArchiveStatus("category-123", true),
    ).rejects.toMatchObject({
      statusCode: 409,
    });
    expect(getCategoryById).toHaveBeenCalledWith("category-123");
    expect(setCategoryArchived).not.toHaveBeenCalled();
  });
  test("throws 409 when category is already active", async () => {
    getCategoryById.mockResolvedValue({
      id: "category-123",
      isDefault: false,
      isArchived: false,
    });
    await expect(
      changeCategoryArchiveStatus("category-123", false),
    ).rejects.toMatchObject({
      statusCode: 409,
    });
    expect(getCategoryById).toHaveBeenCalledWith("category-123");
    expect(setCategoryArchived).not.toHaveBeenCalled();
  });
  test("successfully archives an active category", async () => {
    const categoryId = "category-123";
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
      changeCategoryArchiveStatus(categoryId, true),
    ).resolves.toMatchObject({
      isArchived: true,
    });
    expect(getCategoryById).toHaveBeenCalledWith("category-123");
    expect(setCategoryArchived).toHaveBeenCalledWith(categoryId, true);
  });
  test("successfully unarchives an deactive category", async () => {
    const categoryId = "category-123";
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
      changeCategoryArchiveStatus(categoryId, false),
    ).resolves.toMatchObject({
      isArchived: false,
    });
    expect(getCategoryById).toHaveBeenCalledWith("category-123");
    expect(setCategoryArchived).toHaveBeenCalledWith(categoryId, false);
  });
});

describe("updateCategoryService", () => {
  test("throws 404 when category does not exist", async () => {
    const categoryId = "category-123";
    getCategoryById.mockResolvedValue(null);
    await expect(updateCategoryService(categoryId, {})).rejects.toMatchObject({
      statusCode: 404,
    });
    expect(getCategoryById).toHaveBeenCalledWith(categoryId);
    expect(updateCategoryById).not.toHaveBeenCalled();
  });
  test("throws 403 when trying to update a default category", async () => {
    const categoryId = "category-123";
    const data = { name: "Groceries" };
    getCategoryById.mockResolvedValue({
      id: categoryId,
      name: "Food",
      isDefault: true,
      isArchived: false,
    });
    await expect(updateCategoryService(categoryId, data)).rejects.toMatchObject(
      {
        statusCode: 403,
      },
    );
    expect(getCategoryById).toHaveBeenCalledWith(categoryId);
    expect(updateCategoryById).not.toHaveBeenCalled();
  });
  test("throws 409 when trying to update an archived category", async () => {

    const categoryId = "category-123";
    const data = { name: "Groceries" };
    getCategoryById.mockResolvedValue({
      id: categoryId,
      name: "Food",
      isDefault: false,
      isArchived: true,
    });
    await expect(updateCategoryService(categoryId, data)).rejects.toMatchObject(
      {
        statusCode: 409,
      },
    );
    expect(getCategoryById).toHaveBeenCalledWith(categoryId);
    expect(updateCategoryById).not.toHaveBeenCalled();
  });
  test("successfully updates an active custom category", async () => {
    const categoryId = "category-123";
    const data = { name: "Groceries" };
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
    const result = await updateCategoryService(categoryId, data);
    expect(result).toEqual(updatedCategory);
    expect(getCategoryById).toHaveBeenCalledWith(categoryId);
    expect(updateCategoryById).toHaveBeenCalledWith(categoryId, data);
    expect(updateCategoryById).toHaveBeenCalledTimes(1);
  });
});
