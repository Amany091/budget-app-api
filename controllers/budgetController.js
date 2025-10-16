const {Budget} = require('../models/budgetModel');
const AppError = require('../utils/appError');
const asyncWrapper = require('../utils/asyncWrapper');
const {paginate} = require('../utils/paginate');

exports.addBudget = asyncWrapper(async (req, res, next) => {
  const budget = await Budget.create(req.body);
   return res.status(201).json({ status: "success", data: budget });
});

exports.getBudget = asyncWrapper(async (req,res,next)=>{
    const {page, limit, amount,category, date, type} = req.query;
    const filter = {};
    if(amount) filter.amount = { $gte: Number(amount) };
    if(category) filter.category = category;
    if(date) filter.date = { $gte: new Date(date), $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000) };
    if(type) filter.type = type;
    const options = {page, limit};
    const result = await paginate(Budget, filter, options, {date: -1, amount: -1});
    const income = result.data.filter(item => item.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const expense = result.data.filter(item => item.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    const total = income - expense;
    return res.status(200).json({status: "success", date: result.data, pagination: result.pagination, income, expense, total});
});

exports.deleteBudget = asyncWrapper(async (req,res,next)=>{
    const {id} = req.params;
    const budget = await Budget.findByIdAndDelete(id);
    if(!budget) return next(new AppError('No budget found with that ID', 404));
    return res.status(200).json({message: "deleted successfully"})
});

exports.updateBudget = asyncWrapper(async (req,res,next)=>{
    const {id} = req.params;
    const budget = await Budget.findByIdAndUpdate(id, req.body, {new: true, runValidators: true});
    if(!budget) return next(new AppError('No budget found with that ID', 404));
    return res.status(200).json({status: "success", data: budget})
})