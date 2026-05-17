import Category from "../models/Category.js";

// GET all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    const mappedCategories = categories.map(cat => {
      const c = cat.toObject();
      const displayName = c.name || c.title || "Untitled Category";
      return {
        ...c,
        name: displayName,
        title: displayName
      };
    });
    res.json({ success: true, data: { categories: mappedCategories } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET a single category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    const c = category.toObject();
    const displayName = c.name || c.title || "Untitled Category";
    c.name = displayName;
    c.title = displayName;
    res.json({ success: true, data: c });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CREATE a category
const createCategory = async (req, res) => {
  const { name, slug, image, description, parentId, type } = req.body;
  if (!name || !slug)
    return res.status(400).json({ success: false, message: "Name and slug are required" });

  try {
    const sanitizedParentId = parentId === "" ? null : parentId;
    // Save both name and title for compatibility
    const newCategory = new Category({ 
      name, 
      title: name, 
      slug, 
      image, 
      description, 
      parentId: sanitizedParentId, 
      type 
    });
    const savedCategory = await newCategory.save();
    res.status(201).json({ success: true, message: "Category created successfully", data: savedCategory });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE a category
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    category.name = req.body.name || category.name;
    category.slug = req.body.slug || category.slug;
    category.image = req.body.image || category.image;
    category.description = req.body.description !== undefined ? req.body.description : category.description;
    category.parentId = req.body.parentId === "" ? null : (req.body.parentId || category.parentId);
    category.type = req.body.type || category.type;

    const updatedCategory = await category.save();
    res.json({ success: true, message: "Category updated successfully", data: updatedCategory });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE a category
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};