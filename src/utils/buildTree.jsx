import { HashLink } from "react-router-hash-link";

export const renderCategoryOptions = (categories, level = 0) => {
    return categories.flatMap((category) => [
        <option key={category._id} value={category._id}>
            {"--".repeat(level) + " " + category.title}
        </option>,
        ...(category.children?.length
            ? renderCategoryOptions(category.children, level + 1)
            : [])
    ]);
};


export const mapCategoryToMenuItems = (categories) => {
  return categories.map((item) => ({
    key: String(item._id),
    label: <HashLink smooth to={`/products/${item.slug}/#product-by-category`}>{item.title}</HashLink>,
    children:
      item.children && item.children.length > 0
        ? mapCategoryToMenuItems(item.children)
        : undefined,
  }));
};


export const flattenTree = (tree, level = 0, parentTitle = "Không có") => {
  let result = [];

  tree.forEach((item) => {
    result.push({
      ...item,
      level,
      parentTitle
    });

    if (item.children && item.children.length > 0) {
      result = result.concat(
        flattenTree(item.children, level + 1, item.title)
      );
    }
  });

  return result;
};