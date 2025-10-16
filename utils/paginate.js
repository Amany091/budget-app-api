exports.paginate = async (model, query, options, sort= {createdAt: -1})=>{
    const page = parseInt(options.page, 10) || 1;
    const limit = parseInt(options.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
        model.find(query).sort(sort).skip(skip).limit(limit),
        model.countDocuments(query)
    ]);

    return {
      data: results,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
}