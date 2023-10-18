function paginatedResults(model) {
  return async (req, res, next) => {
    const page = (parseInt(req.query.page, 10) >= 1 ? parseInt(req.query.page, 10) : 1) || 1;
    const backendLimit = 12;
    const limit = parseInt(req.query.limit, 10) <= backendLimit ? req.query.limit : backendLimit;
    const { name, city } = req.query;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    results.backendLimit = backendLimit;

    try {
      const query = { status: true };

      if (name) {
        query.plantName = { $regex: name, $options: 'i' };
      }

      const products = await model.find(query)
        .populate('userId', '-email -password')
        .sort({ createdAt: 'desc' });

      const filteredProduct = products.filter((item) => {
        if (city) {
          return item.userId.adress.city.toLowerCase().includes(city.toLowerCase());
        }
        return true;
      });

      const sortedAndPaginatedProducts = filteredProduct
        .slice(startIndex, endIndex);

      results.totalProducts = filteredProduct.length;

      results.product = sortedAndPaginatedProducts;

      res.resultsPaginatedAndFiltered = results;
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}

module.exports = paginatedResults;
