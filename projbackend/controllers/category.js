const Category = require('../models/category');

exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, cate) => {
        if(err){
            return res.status(400).json({
                error: "Categoty not found in DB"
            })
        }

        req.Category = cate;
        next();
    })
};

exports.createCategory = (req, res, next) => {
    const category = new Category(req.body);
    category.save((err, category) => {
        if(err){
            return res.status(400).json({
                error: "Not able to save category in db"
            });
        }
        res.json({category});
    })
}

exports.getCategory = (req, res) => {
    return res.json(req.category);
}

exports.getAllCategory = (req, res) => {
    Category.find().exec((err, categories) => {
        if(err){
            return res.status(400).json({
                error: "No Categeries find"
            });
        }
        res.json(categories)
    })
};

exports.updateCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name;

    category.save((err, updatedCategory) => {
        if(err){
            return res.status(400).json({
                error: "Failed to update Categeries"
            });
        }
        res.json(updatedCategory)
    })
}

exports.removeCategory = (req, res) => {
    const category = req.category;
    category.remove((err, category) => {
        if(err){
            return res.status(400).json({
                error: "Failed to delete Categery"
            });
        }
        res.json({
            message: "Successfully deleted"
        })
    })
}