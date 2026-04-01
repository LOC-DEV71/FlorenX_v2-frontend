import "./pagination.scss";

const renderPages = (pagination, setSearchParams, limit, sort, sortByCategory) => {
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
                    setSearchParams({ page: i, limit, sort, sortByCategory })
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
    sortByCategory
) => {
    if (!pagination) return null;

    return (
        <div className="pagination-admin">
            <div className="pagination-admin_left">
                {pagination.currentPage > 1 && (
                    <button
                        onClick={() =>
                            setSearchParams({
                                page: 1,
                                limit,
                                sort,
                                sortByCategory,
                            })
                        }
                    >
                        Trang đầu
                    </button>
                )}

                <button
                    disabled={pagination.currentPage === 1}
                    onClick={() =>
                        setSearchParams({
                            page: pagination.currentPage - 1,
                            limit,
                            sort,
                            sortByCategory,
                        })
                    }
                >
                    ‹ Trước
                </button>

                {renderPages(
                    pagination,
                    setSearchParams,
                    limit,
                    sort,
                    sortByCategory
                )}

                {pagination.currentPage < pagination.totalPage && (
                    <button
                        disabled={pagination.currentPage === pagination.totalPage}
                        onClick={() =>
                            setSearchParams({
                                page: pagination.currentPage + 1,
                                limit,
                                sort,
                                sortByCategory,
                            })
                        }
                    >
                        Sau ›
                    </button>
                )}

                <button
                    disabled={pagination.currentPage === pagination.totalPage}
                    onClick={() =>
                        setSearchParams({
                            page: pagination.totalPage,
                            limit,
                            sort,
                            sortByCategory,
                        })
                    }
                >
                    Trang cuối
                </button>
            </div>

            <select
                className="pagination-admin_right"
                value={limit}
                onChange={(e) =>
                    setSearchParams({
                        page: 1,
                        limit: Number(e.target.value),
                        sort,
                        sortByCategory,
                    })
                }
            >
                <option value={5}>5 / trang</option>
                <option value={10}>10 / trang</option>
                <option value={20}>20 / trang</option>
            </select>
        </div>
    );
};