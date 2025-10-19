const {Budget} = require('../models/budgetModel');
const AppError = require('../utils/appError');
const asyncWrapper = require('../utils/asyncWrapper');
const {paginate} = require('../utils/paginate');

const countBudgetTotals = async () => {
    const budgetData = await Budget.find();
    const income = budgetData.filter(item => item.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const expense = budgetData.filter(item => item.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    const total = income - expense;
    return { income, expense, total };
}

exports.addBudget = asyncWrapper(async (req, res, next) => {
  const budget = await Budget.create(req.body);
  const { income, expense, total } = await countBudgetTotals();
   return res.status(201).json({ status: "success", data: budget, income, expense, total });
});

exports.getBudget = asyncWrapper(async (req,res,next)=>{
    const {page, limit,category, type, sortby} = req.query;
    const filter = {};
    if(category) filter.category = category;
    if(type) filter.type = type;
    if(sortby === 'amount') filter.sortby = {amount: -1};
    if(sortby === 'date') filter.sortby = {date: -1};
    const options = {page, limit};
    const result = await paginate(Budget, filter, options, {date: -1, amount: -1});
    const { income, expense, total } = await countBudgetTotals();
    return res.status(200).json({status: "success", data: result.data, pagination: result.pagination, income, expense, total});
});

exports.deleteBudget = asyncWrapper(async (req,res,next)=>{
    const {id} = req.params;
    const budget = await Budget.findByIdAndDelete(id);
    const { income, expense, total } = await countBudgetTotals();
    if(!budget) return next(new AppError('No budget found with that ID', 404));
    return res.status(200).json({message: "deleted successfully", income, expense, total});
});

exports.updateBudget = asyncWrapper(async (req,res,next)=>{
    const {id} = req.params;
    const budget = await Budget.findByIdAndUpdate(id, req.body, {new: true, runValidators: true});
    if(!budget) return next(new AppError('No budget found with that ID', 404));
    const { income, expense, total } = await countBudgetTotals();
    return res.status(200).json({status: "success", data: budget, income, expense, total});
})