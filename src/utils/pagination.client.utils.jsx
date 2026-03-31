import "./pagination.client.utils.scss";

const renderPages = (pagination, setSearchParams, limit, price ) => {
    const MAX_PAGE = 6;

    if (!pagination) return null;
    const { currentPage, totalPage } = pagination;
    let startPage = Math.max(
        1,
        currentPage - Math.floor(MAX_PAGE / 2)
    )

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
                    setSearchParams({ page: i, limit, price })
                }
            >   
                {i}
            </button>
        );
    }

    return pages;
}

export const renderpagination = (pagination, setSearchParams, limit, price ) => {
    if (!pagination) return null;

    return (
        <div className="pagination">
            <div className="pagination_left">
                {pagination.currentPage > 1 && (
                <button onClick={() => setSearchParams({ page: 1, limit, price})}>
                    Trang đầu
                </button>
            )}

            <button
                disabled={pagination.currentPage === 1}
                onClick={() =>
                    setSearchParams({ page: pagination.currentPage - 1, limit, price})
                }
            >
                ‹ Trước
            </button>

            {renderPages(pagination, setSearchParams, limit, price)}

            {pagination.currentPage < pagination.totalPage && (
                <button
                    disabled={pagination.currentPage === pagination.totalPage}
                    onClick={() =>
                        setSearchParams({ page: pagination.currentPage + 1, limit, price  })
                    }
                >
                    Sau ›
                </button>
            )}

            <button
                disabled={pagination.currentPage === pagination.totalPage}
                onClick={() =>
                    setSearchParams({ page: pagination.totalPage, limit, price })
                }
            >
                Trang cuối
            </button>
            </div>

            <select
                className="pagination_right"
                value={limit}
                onChange={e =>
                    setSearchParams({ page: 1, limit: Number(e.target.value), price  })
                }
            >
                <option value={6}>6 / trang</option>
                <option value={12}>12 / trang</option>
                <option value={24}>24 / trang</option>
            </select>
        </div>
    );
};
