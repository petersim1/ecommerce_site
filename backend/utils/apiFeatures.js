class APIFeatures {
    constructor(queryStr,resPerPage) {
        this.queryStr = queryStr;
        this.resPerPage = resPerPage;
        this.findQuery = {};
        this.skip = 0;
    }

    search() {

        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        } : {}

        if (this.queryStr.keyword) this.findQuery.name = {
            $regex: this.queryStr.keyword,
            $options: 'i'
        }

        return this
    }

    filter() {

        const queryCopy = { ...this.queryStr };

        // Removing fields from the query
        const removeFields = ['keyword', 'limit', 'page']
        removeFields.forEach(el => delete queryCopy[el]);

        // Advance filter for price, ratings etc
        let queryStr = JSON.stringify(queryCopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)

        const newQuery = JSON.parse(queryStr)

        for (var key of Object.keys(newQuery)) {
            this.findQuery[key] = newQuery[key]
        }

        return this
    }

    pagination() {
        const curPage = Number(this.queryStr.page) || 1 ;
        this.skip = this.resPerPage*(curPage - 1);

        return this

    }
}

module.exports = APIFeatures;