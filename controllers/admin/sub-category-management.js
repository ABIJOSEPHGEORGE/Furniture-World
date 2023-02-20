const { default: mongoose } = require("mongoose");
const Category = require("../../models/category-schema");
const Product = require("../../models/products-schema");

const { uploadImage, overwriteImage } = require("../../services/cloudinary");
const { cloudinary } = require("../../services/cloudinary");

module.exports = {
  createSubCategory: async (req, res) => {
    const sub_category_name = req.body.sub_category_name
      .replaceAll(" ", "-")
      .toLowerCase();

    try {
      // GETTING ALL PARENT CATEGORIES
      let dbcategories = await Category.find({});
      // CHECKING CATEGORY NAME FORMAT
      const trimmedInput = req.body.sub_category_name.trim();
      const regex = /&/g;
      if (regex.test(trimmedInput) == true) {
        return res.render("add-subCategory", {
          category: dbcategories,
          err: "sub category name shouldn't contain any special characters",
        });
      }
      // CHECKING IF SUB CATEGORY ALREADY EXIST
      let isExist = await Category.findOne({
        sub_category: { $elemMatch: { sub_category_name: sub_category_name } },
      });

      if (isExist) {
        return res.render("add-subCategory", {
          category: dbcategories,
          err: "sub category name already exist",
        });
      }
      //upload image to cloudinary
      uploadImage(req.file.path).then(async (response) => {
        let category = await Category.findOne({
          _id: req.body.parent_category,
        });
        let parentName = category.category_name;
        const sub_category_name = req.body.sub_category_name
          .replaceAll(" ", "-")
          .toLowerCase();
        let sub_category = {
          _id: new mongoose.Types.ObjectId(),
          sub_category_name: sub_category_name,
          description: req.body.sub_category_description,
          parent_category_name: parentName,
          parent_category: req.body.parent_category,
          sub_category_image: response.secure_url,
          cloudinary_id: response.public_id,
          status: true,
        };
        await Category.updateOne(
          { _id: req.body.parent_category },
          { $push: { sub_category: sub_category } }
        );
        return res.redirect("/admin/sub-category-management");
      });
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  renderSubCategory: async (req, res) => {
    let category = await Category.find({});
    let AllsubCategories = await Promise.all(
      category.map((ele) => {
        return ele.sub_category;
      })
    );
    res.render("sub-category-management", { subcat: AllsubCategories });
  },

  //Delete sub category
  deleteSubCategory: async (req, res) => {
    const subcategory = req.params.id;
    const parentId = req.params.parent_id;
    const cloudinaryId = req.params.public_id;

    try {
      // getting the sub category name
      let subcategory_details = await Category.findOne({
        sub_category: {
          $elemMatch: { _id: mongoose.Types.ObjectId(subcategory) },
        },
      });
      // DELETING THE SUB CATEGORY
      await Category.findByIdAndUpdate(
        parentId,
        {
          $pull: {
            sub_category: { _id: mongoose.Types.ObjectId(subcategory) },
          },
        },
        { new: true }
      );
      await cloudinary.uploader.destroy(cloudinaryId);
      // CHANGING STATUS OF ALL PRODUCTS RELATED TO THIS SUB CATEGORY
      await Product.updateMany(
        { sub_category: subcategory_details.sub_category[0].sub_category_name },
        { status: false, sub_category: "Not Assigned" }
      );
      res.redirect("/admin/sub-category-management");
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  editSubCategoryPage: async (req, res) => {
    let subcategoryId = req.query.id;
    let parentcategoryId = req.query.parent;
    try {
      // getting parent category
      let parent = await Category.findOne({ _id: parentcategoryId });
      // getting the subcategory details
      let subcategory = parent.sub_category.find((ele) => {
        if (ele._id == subcategoryId) return ele;
      });

      res.render("edit-subcategory", { subcat: subcategory, parent: parent });
    } catch (err) {
      console.error(err);
    }
  },
  editSubCategory: async (req, res) => {
    let subcategoryId = req.query.id;
    try {
      // getting the parent category
      const category = await Category.findOne({ _id: req.query.parent });
      // getting the subcategory and cloudinary id
      const subcategory = await category.sub_category.find((ele) => {
        if (ele._id == subcategoryId) {
          return ele;
        }
      });

      //checking is there any change in image if change the image in cloudinary
      if (req.file !== undefined) {
        await overwriteImage(req.file.path, subcategory.cloudinary_id).catch(
          (err) => {
            res.redirect("/users/page-not-found");
          }
        );
      }
      // CHECKING CATEGORY NAME FORMAT
      const trimmedInput = req.body.category_name.trim();
      const regex = /&/g;
      if (regex.test(trimmedInput) == true) {
        return res.render("edit-subcategory", {
          subcat: subcategory,
          parent: category,
          err: "Sub category name should not contain any special characters",
        });
      }
      const sub_category_name = req.body.category_name
        .replaceAll(" ", "-")
        .toLowerCase();
      if (sub_category_name !== subcategory.sub_category_name) {
        // CHECKING IF THE SUBCATEGORY ALREADY EXIST
        let isExist = await Category.findOne({
          sub_category: {
            $elemMatch: { sub_category_name: sub_category_name },
          },
        });
        if (isExist) {
          return res.render("edit-subcategory", {
            subcat: subcategory,
            parent: category,
            err: "Sub category name already exist",
          });
        }
      }
      // updating sub category name in all products
      await Product.updateMany(
        { sub_category: subcategory.sub_category_name },
        { sub_category: sub_category_name }
      );
      // updating the updated data to the db
      await Category.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(req.query.parent),
          "sub_category._id": mongoose.Types.ObjectId(subcategoryId),
        },
        {
          $set: {
            "sub_category.$.sub_category_name": sub_category_name,
            "sub_category.$.description": req.body.category_description,
          },
        },
        { new: true }
      );
      res.redirect("/admin/sub-category-management");
    } catch (err) {
      console.error(err);
    }
  },
  fetchSubcategories: async (req, res) => {
    try {
      let sub_categories = await Category.findOne({ _id: req.params.id });
      res.status(200).json(sub_categories.sub_category);
    } catch (err) {
      res.status(500).json(false);
    }
  },
};
