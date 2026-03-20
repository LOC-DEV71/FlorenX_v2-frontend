import "./Categories.scss";
import { useEffect, useMemo, useState } from "react";
import { BsCalendarCheck, BsCheck2Circle } from "react-icons/bs";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CgMathPlus } from "react-icons/cg";
import { Statistic, Skeleton } from "antd";
import CountUp from "react-countup";
import { SearchOutlined } from "@ant-design/icons";
import { MdDeleteOutline } from "react-icons/md";
import SEO from "../../../utils/SEO";
import { getTreeCategory } from "../../../services/admin/product.category.admin";
import { flattenTree } from "../../../utils/buildTree";
import { RiParentFill } from "react-icons/ri";
import { FaChildren } from "react-icons/fa6";
import { changeMulti } from "../../../services/admin/product.category.admin";
import { confirm, error, success } from "../../../utils/notift";

const formatter = (value) => (
  <CountUp end={value} duration={2} separator="," />
);

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategories, setActiveCategories] = useState(null);
  const [totalCategories, setTotalCategories] = useState(null);
  const [parentCategories, setParentCategories] = useState(null);
  const [childCategories, setChildCategories] = useState(null);
  const [selectId, setSelectId] = useState([]);
  const [typeChange, setTypeChange] = useState("");
  const [changePosition, setChangePosition] = useState({});
  const [reload, setReload] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const sort = searchParams.get("sort");

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setLoading(true);
        const res = await getTreeCategory({ sort });

        if (res?.data?.code) {
          setCategories(res.data.categories || []);
          setActiveCategories(res.data.activeCategories);
          setTotalCategories(res.data.totalCategories);
          setParentCategories(res.data.parentCategories);
          setChildCategories(res.data.childCategories);
        }
      } catch (err) {
        console.error(err?.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApi();
  }, [reload, sort]);

  const categoryDisplayList = useMemo(() => {
    return flattenTree(categories);
  }, [categories]);

  const flatCategoryIds = useMemo(() => {
    return categoryDisplayList.map((item) => item._id);
  }, [categoryDisplayList]);

  const findCategoryById = (tree, id) => {
    for (const node of tree) {
      if (node._id === id) return node;

      if (node.children && node.children.length > 0) {
        const found = findCategoryById(node.children, id);
        if (found) return found;
      }
    }

    return null;
  };

  const getAllChildrenIds = (node) => {
    let ids = [node._id];

    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        ids = [...ids, ...getAllChildrenIds(child)];
      }
    }

    return ids;
  };

  const handleCheckCategory = (categoryId, checked) => {
    const currentNode = findCategoryById(categories, categoryId);
    if (!currentNode) return;

    const idsOfNodeAndChildren = getAllChildrenIds(currentNode);

    if (checked) {
      setSelectId((prev) => [...new Set([...prev, ...idsOfNodeAndChildren])]);
    } else {
      setSelectId((prev) =>
        prev.filter((id) => !idsOfNodeAndChildren.includes(id))
      );
    }
  };

  const handleCheckAll = (checked) => {
    if (checked) {
      setSelectId(flatCategoryIds);
    } else {
      setSelectId([]);
    }
  };

  const handleChangeMulti = async () => {
    try {

      if (typeChange === "delete") {
        const ok = await confirm(
          "Xoá anh mục?",
          "Danh mục bị xóa sẽ chuyển vào thùng rác"
        );

        if (!ok) return;
        const res = await changeMulti({ selectId, typeChange })
        if (res.data.code) {
          success(res.data.message)
        }
      }

      if (typeChange === "position") {

        const positions = Object.keys(changePosition).map(id => ({
          id,
          position: changePosition[id]
        }));

        const res = await changeMulti({
          typeChange,
          positions
        });

        if (res.data.code) {
          success(res.data.message);
        } else {
          error(res.data.message);
        }

      } else {

        const res = await changeMulti({
          selectId,
          typeChange
        });

        if (res.data.code) {
          success(res.data.message);
        } else {
          error(res.data.message);
        }

      }

      setChangePosition({});
      setSelectId([]);
      setTypeChange("");
      setReload(prev => !prev);

    } catch (err) {
      error(err.response?.data.message);
    }
  };

  const handleDeleteOne = async (id) => {
    try {
      const ok = await confirm(
        "Xoá danh mục?",
        "Danh mục bị xoá sẽ chuyển vào thùng rác"
      );

      if (!ok) return;

      const res = await changeMulti({
        selectId: [id],
        typeChange: "delete"
      });

      if (res.data.code) {
        success(res.data.message);
        setReload((prev) => !prev);
        setSelectId((prev) => prev.filter((item) => item !== id));
      } else {
        error(res.data.message);
      }
    } catch (err) {
      error(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  return (
    <div className="category-page">
      <SEO title="Quản lý danh mục" />

      <h2 className="category-page__title">Quản Lý Danh Mục</h2>

      <div className="category-stats">
        <div className="stat-card stat-total">
          <p>
            <BsCalendarCheck /> Total Categories
          </p>
          {loading ? (
            <Skeleton.Avatar active shape style={{ width: 35, height: 35 }} />
          ) : (
            <Statistic value={totalCategories} formatter={formatter} />
          )}
        </div>

        <div className="stat-card stat-active">
          <p>
            <BsCheck2Circle /> Active Categories
          </p>
          {loading ? (
            <Skeleton.Avatar active shape style={{ width: 35, height: 35 }} />
          ) : (
            <Statistic value={activeCategories} formatter={formatter} />
          )}
        </div>

        <div className="stat-card stat-out">
          <p>
            <RiParentFill /> Parent Categories
          </p>
          {loading ? (
            <Skeleton.Avatar active shape style={{ width: 35, height: 35 }} />
          ) : (
            <Statistic value={parentCategories} formatter={formatter} />
          )}
        </div>

        <div className="stat-card stat-low">
          <p>
            <FaChildren /> Child Categories
          </p>
          {loading ? (
            <Skeleton.Avatar active shape style={{ width: 35, height: 35 }} />
          ) : (
            <Statistic value={childCategories} formatter={formatter} />
          )}
        </div>
      </div>

      <div className="category-filters">
        <div className="search">
          <SearchOutlined />
          <input placeholder="Tìm tên danh mục hoặc slug..." />
        </div>

        <select
          value={sort}
          onChange={e => setSearchParams({
            sort: e.target.value
          })}
        >
          <option value="">Trạng thái: Tất cả</option>
          <option value="status-active">Hoạt động</option>
          <option value="status-inactive">Không hoạt động</option>
        </select>

        <select
          value={sort}
          onChange={e => setSearchParams({
            sort: e.target.value
          })}
        >
          <option value="">-- Sắp xếp theo --</option>
          <option value="title-asc">Tên A-Z</option>
          <option value="title-desc">Tên Z-A</option>
          <option value="position-asc">Vị trí thấp đến cao</option>
          <option value="position-desc">Vị trí cao đến thấp</option>
        </select>

        <button className="reset" onClick={() => navigate("/admin/categories")}>
          <MdDeleteOutline /> Xóa lọc
        </button>

        <select
          onChange={(e) => setTypeChange(e.target.value)}
          value={typeChange}
        >
          <option value="">-- Chọn hành động --</option>
          <option value="active">Chuyển thành hoạt động</option>
          <option value="inactive">Chuyển thành không hoạt động</option>
          <option value="position">Thay đổi vị trí sản phẩm</option>
          <option value="delete">Xóa nhiều sản phẩm</option>
        </select>

        <button className="activity" onClick={handleChangeMulti}>Áp dụng</button>

        <Link className="create" to="/admin/categories/create">
          <CgMathPlus /> Tạo mới
        </Link>
      </div>

      <div className="table-wrapper">
        <div className="category-table">
          <div className="table-header">
            <div>
              <input
                type="checkbox"
                checked={
                  flatCategoryIds.length > 0 &&
                  flatCategoryIds.every((id) => selectId.includes(id))
                }
                onChange={(e) => handleCheckAll(e.target.checked)}
              />
            </div>

            <div className="col-category">Danh mục</div>
            <div>Vị trí</div>
            <div>Danh mục cha</div>
            <div>Số SP</div>
            <div>Trạng thái</div>
            <div>Nổi bật</div>
            <div>Hành động</div>
          </div>

          {loading &&
            Array(5)
              .fill()
              .map((_, i) => (
                <div className="table-row" key={i}>
                  <div>
                    <Skeleton.Avatar
                      active
                      shape
                      style={{ width: 15, height: 15 }}
                    />
                  </div>

                  <div className="product-info col-product">
                    <div>
                      <Skeleton.Input
                        active
                        style={{ width: 200, height: 60, marginBottom: 20 }}
                      />
                      <Skeleton.Input
                        active
                        style={{ width: 30, height: 20 }}
                      />
                    </div>
                  </div>

                  <Skeleton.Input active size="small" />
                  <Skeleton.Input active size="small" />
                  <Skeleton.Input active size="small" />
                  <Skeleton.Input active size="small" />
                  <Skeleton.Input active size="small" />
                  <Skeleton.Input active size="small" />
                </div>
              ))}

          {!loading && categoryDisplayList.length === 0 && (
            <div className="table-row">
              <div style={{ padding: "16px" }}>Không có danh mục nào</div>
            </div>
          )}

          {!loading &&
            categoryDisplayList.map((item) => (
              <div className="table-row" key={item._id || item.id}>
                <span
                  className={
                    item.featured === "yes" ? "yes featured" : "no featured"
                  }
                >
                  {item.featured === "yes" ? "Nổi bật" : ""}
                </span>

                <div className="category-checkbox">
                  <input
                    type="checkbox"
                    checked={selectId.includes(item._id)}
                    onChange={(e) =>
                      handleCheckCategory(item._id, e.target.checked)
                    }
                  />
                </div>

                <div
                  className="category-info col-category"
                  style={{ paddingLeft: `${item.level * 24}px` }}
                >
                  <div>
                    <p className="category-name">
                      {item.level > 0 && "— ".repeat(item.level)}
                      {item.title}
                    </p>
                    <span className="category-sub">{item.slug}</span>
                  </div>
                </div>

                <div>
                  <input
                    type="number"
                    defaultValue={item.position}
                    style={{ width: 60, textAlign: "center" }}
                    onChange={(e) => {
                      const value = Number(e.target.value);

                      setChangePosition(prev => ({
                        ...prev,
                        [item._id]: value
                      }))
                    }}
                  />
                </div>

                <div>{item.parentTitle}</div>
                <div>{item.totalProduct || 0}</div>

                <div>
                  <span className={`status ${item.status}`}>
                    {item.status === "active" && "Hoạt động"}
                    {item.status === "inactive" && "Không hoạt động"}
                  </span>
                </div>

                <div>{item.featured === "yes" ? "Có" : "Không"}</div>

                <div className="actions">
                  <Link
                    className="edit"
                    to={`/admin/categories/update/${item.slug}`}
                  >
                    Edit
                  </Link>
                  <button className="delete" onClick={() => handleDeleteOne(item._id)}>Delete</button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Categories;