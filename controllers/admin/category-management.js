const Category = require("../../models/category-schema");
const { uploadImage, overwriteImage } = require("../../services/cloudinary");

module.exports = {
  fetchAllCategory: async (req, res) => {
    try {
      const allParentCategory = await Category.find({});
      res.json(allParentCategory);
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  categoryPage: async (req, res) => {
    try {
      let dbcategories = await Category.find({});
      if (dbcategories) {
        res.render("category-management", { categories: dbcategories });
      } else {
        res.render("category-management", { err: "No categories found" });
      }
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  //upload image to cloudinary
  uploadAndCreate: async (req, res) => {
    // CHECKING CATEGORY NAME FORMAT
    const trimmedInput = req.body.category_name.trim();
    const regex = /&/g;

    if (regex.test(trimmedInput) == true) {
      return res.render("add-category", {
        err: "Category name shouldn't contain any special characters",
      });
    }
    const category_name = req.body.category_name
      .replaceAll(" ", "-")
      .toLowerCase();
    try {
      // CHECKING CATEGORY NAME IS EXIST OR NOT
      let isExist = await Category.findOne({ category_name: category_name });
      if (isExist) {
        return res.render("add-category", {
          err: "Category name already exist",
        });
      }
    } catch (err) {
      res.redirect("/users/page-not-found");
    }

    //uploading image to cloudinary
    uploadImage(req.file.path)
      .then(async (response) => {
        let category = new Category({
          category_name: category_name,
          description: req.body.category_description,
          category_image: response.secure_url,
          cloudinary_id: response.public_id,
        });
        //saving category to db
        await category.save();
        res.redirect("/admin/category-management");
      })
      .catch((err) => {
        res.redirect("/users/page-not-found");
      });
  },

  //edit category page
  editCategory: async (req, res) => {
    await Category.findOne({ _id: req.query.id })
      .then((response) => {
        res.render("edit-category", { category: response });
      })
      .catch((err) => {
        res.redirect("/users/page-not-found");
      });
  },
  getCategoryImage: async (id) => {
    await Category.findById(id)
      .then((response) => {
        return response.category_image;
      })
      .catch((err) => {
        res.redirect("/users/page-not-found");
      });
  },
  //update category
  updateCategory: async (req, res) => {
    const category_name = req.body.category_name
      .replaceAll(" ", "-")
      .toLowerCase();
    try {
      let dbCategory = await Category.findOne({ _id: req.query.id });
      // CHECKING CATEGORY NAME FORMAT
      const trimmedInput = req.body.category_name.trim();
      const regex = /&/g;
      if (regex.test(trimmedInput) == true) {
        return res.render("edit-category", {
          category: dbCategory,
          err: "Category name shouldn't contain any special characters",
        });
      }
      if (req.file !== undefined) {
        overwriteImage(req.file.path, dbCategory.cloudinary_id).catch((err) => {
          res.redirect("/users/page-not-found");
        });
      }
      let category = {
        category_name: category_name,
        description: req.body.category_description,
      };
      if (category_name !== dbCategory.category_name) {
        // CHECKING IF THE SUBCATEGORY ALREADY EXIST
        let isExist = await Category.findOne({ category_name: category_name });
        if (isExist) {
          return res.render("edit-category", {
            category: dbCategory,
            err: "Category name already exist",
          });
        }
      }
      Category.findOneAndUpdate({ _id: req.query.id }, category, {
        new: true,
      }).exec((err, result) => {
        if (result) {
          res.redirect("/admin/category-management");
        } else {
          res.redirect("/users/page-not-found");
        }
      });
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  addSubCategory: async (req, res) => {
    try {
      let dbcategories = await Category.find({});
      res.render("add-subCategory", { category: dbcategories });
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
};
