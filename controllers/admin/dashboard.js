const Order = require("../../models/order-schema");
const csv = require("csv-express");
const User = require("../../models/users-schema");
const Product = require("../../models/products-schema");



module.exports = {
  salesReportPage: (req, res) => {
    res.render("sales-report");
  },
  // csv sales report
  salesReport: async (req, res) => {
    const fileName = "report.csv";

    Order.find({
      $and: [
        {
          order_date: {
            $gte: new Date(new Date(req.body.fromDate).setHours(00, 00, 00)),
            $lte: new Date(new Date(req.body.toDate).setHours(23, 59, 59)),
          },
        },
        { status: req.body.status },
      ],
    })
      .lean()
      .populate('userId')
      .exec({}, async function (err, orders) {
        if (err) res.redirect("/users/page-not-found");
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=" + fileName
        );
          let report = await Promise.all(orders.map(async(ele)=>{
            let data = {
              order_id : ele._id,
              user : ele.userId.email,
              
            }
            let {first_name,last_name,company_name,phone_number,add_line_one,add_line_two,email,city,state,zip} = ele.billing_address;
            data.first_name = first_name;
            data.last_name = last_name;
            data.phone_number = phone_number;
            data.email = email;
            data.billing_address = [company_name,add_line_one,add_line_two,city,state,zip];
            await ele.products.forEach((prdct)=>{
              let products = []
              products.push(prdct.item.product_name)
              data.products =  products;
            })
            return data;
          }))
          
          res.csv(report,true)
        })

  },
  // admin dashboard
  dashboardPage: async (req, res) => {
    // getting count of users
    const totalUsers = await User.find({}).count();
    const totalProducts = await Product.find({}).count();
    const totalOrders = await Order.find({}).count();
    const revenue = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $group: { _id: null, amount: { $sum: "$bill_amount" } } },
    ]);
    const [totalRevenue] = revenue;
    res.render("admin-dashboard", {
      totalUsers,
      totalProducts,
      totalRevenue,
      totalOrders,
    });
  },

  // fetching data for dashboard graph
  graphData: async (req, res) => {
    const todayDate = new Date();
    try {
      const orders = await Order.find({});
      res.json(orders);
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  // fetching monthly sales data
  monthlyGraph: async (req, res) => {
    // Get current date
    const today = new Date();

    // Get current month's starting date
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    // Get current month's ending date
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Format dates as strings
    const firstDayStr = firstDay.toISOString().substring(0, 10);
    const lastDayStr = lastDay.toISOString().substring(0, 10);
    try {
      let orders = await Order.find({
        order_date: { $gte: firstDayStr, $lte: lastDayStr },
      });
      res.json(orders);
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
};
