import "./pagination.scss";

const buildParams = ({ page, limit, sort, sortByCategory, warehouse, import_price, search }) => {
    const params = { page, limit };

    if (sort) params.sort = sort;
    if (warehouse) params.warehouse = warehouse;
    if (import_price) params.import_price = import_price;
    if (sortByCategory) params.sortByCategory = sortByCategory;
    if (search) params.search = search;
    

    return params;
};

const renderPages = (pagination, setSearchParams, limit, sort, sortByCategory, warehouse, import_price, search) => {
    const MAX_PAGE = 6;

    if (!pagination) return null;
    const { currentPage, totalPage } = pagination;

    let startPage = Math.max(1, currentPage - Math.floor(MAX_PAGE / 2));

    let endPage = startPage + MAX_PAGE - 1;
    if (endPage > totalPage) {
        endPage = totalPage;
        startPage = Math.max(1, endPage - MAX_PAGE + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(
            <button
                key={i}
                disabled={i === currentPage}
                onClick={() =>
                    setSearchParams(
                        buildParams({ page: i, limit, sort, sortByCategory, warehouse, import_price, search })
                    )
                }
            >
                {i}
            </button>
        );
    }

    return pages;
};

export const renderpagination = (
    pagination,
    setSearchParams,
    limit,
    sort,
    sortByCategory,
    warehouse,
    import_price,
    search
) => {
    if (!pagination) return null;

    const { currentPage, totalPage } = pagination;

    return (
        <div className="pagination-admin">
            <div className="pagination-admin_left">
                {currentPage > 1 && (
                    <button
                        onClick={() =>
                            setSearchParams(
                                buildParams({
                                    page: 1,
                                    limit,
                                    sort,
                                    sortByCategory,
                                    warehouse,
                                    import_price,
                                    search
                                })
                            )
                        }
                    >
                        Trang đầu
                    </button>
                )}

                <button
                    disabled={currentPage === 1}
                    onClick={() =>
                        setSearchParams(
                            buildParams({
                                page: currentPage - 1,
                                limit,
                                sort,
                                sortByCategory,
                                warehouse,
                                import_price,
                                search
                            })
                        )
                    }
                >
                    ‹ Trước
                </button>

                {renderPages(
                    pagination,
                    setSearchParams,
                    limit,
                    sort,
                    sortByCategory,
                    warehouse,
                    import_price,
                    search
                )}

                {currentPage < totalPage && (
                    <button
                        onClick={() =>
                            setSearchParams(
                                buildParams({
                                    page: currentPage + 1,
                                    limit,
                                    sort,
                                    sortByCategory,
                                    warehouse,
                                    import_price,
                                    search
                                })
                            )
                        }
                    >
                        Sau ›
                    </button>
                )}

                <button
                    disabled={currentPage === totalPage}
                    onClick={() =>
                        setSearchParams(
                            buildParams({
                                page: totalPage,
                                limit,
                                sort,
                                sortByCategory,
                                warehouse,
                                import_price,
                                search
                            })
                        )
                    }
                >
                    Trang cuối
                </button>
            </div>

            <select
                className="pagination-admin_right"
                value={limit}
                onChange={(e) =>
                    setSearchParams(
                        buildParams({
                            page: 1,
                            limit: Number(e.target.value),
                            sort,
                            sortByCategory,
                            warehouse,
                            import_price,
                            search
                        })
                    )
                }
            >
                <option value={5}>5 / trang</option>
                <option value={10}>10 / trang</option>
                <option value={20}>20 / trang</option>
            </select>
        </div>
    );
};