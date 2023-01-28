const { default: mongoose } = require("mongoose");
const Category = require("../../models/category-schema");
const SubCategory = require("../../models/sub-category");
const { uploadImage, overwriteImage } = require("../../services/cloudinary");
const { cloudinary } = require("../../services/cloudinary");

module.exports = {
  fetchAllSubCategory: async () => {
    let subcategories = await SubCategory.find({});
    return subcategories;
  },

  createSubCategory: (req, res) => {
    //upload image to cloudinary
    uploadImage(req.file.path).then(async (response) => {
      let category = await Category.findOne({ _id: req.body.parent_category });
      let parentName = category.category_name;
      let sub_category = {
        _id: new mongoose.Types.ObjectId(),
        sub_category_name: req.body.sub_category_name,
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

  populateParentCategory: async () => {
    return await SubCategory.find({}).populate("parent_category");
  },

  //Delete sub category
  deleteSubCategory: async (req, res) => {
    const subcategory = req.params.id;
    const parentId = req.params.parent_id;
    const cloudinaryId = req.params.public_id;

    try {
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
      res.redirect("/admin/sub-category-management");
    } catch (err) {
      console.log(err);
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
      res.render("edit-subcategory", { subcat: subcategory });
    } catch (err) {
      console.error(err);
    }
  },
  editSubCategory: async (req, res) => {
    let subcategoryId = req.params.id;
    try {
      // getting the parent category
      const category = await Category.findOne({ _id: req.params.parent });
      // getting the subcategory and cloudinary id
      const subcategory = await category.sub_category.find((ele) => {
        if (ele._id == subcategoryId) {
          return ele;
        }
      });

      //checking is there any change in image if change the image in cloudinary
      if (req.file !== undefined) {
        await overwriteImage(req.file.path, subcategory.cloudinary_id).catch(
          (err) => console.log(err)
        );
      }
      // updating the updated data to the db
      await Category.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(req.params.parent),
          "sub_category._id": mongoose.Types.ObjectId(subcategoryId),
        },
        {
          $set: {
            "sub_category.$.sub_category_name": req.body.category_name,
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
};
