import "./Permission.scss";
import { useEffect, useState } from "react";
import SEO from "../../../utils/SEO";
import { BsShieldLock, BsCheck2Square } from "react-icons/bs";
import { SearchOutlined } from "@ant-design/icons";
import { error, success } from "../../../utils/notift";
import { changePermission, getPermissions } from "../../../services/admin/permission.admin.service";
import { getListRoles } from "../../../services/admin/roles.admin.service";

function Permission() {
    const [permissionData, setPermissionData] = useState([]);
    const [roles, setRoles] = useState([]);
    const [activeRole, setActiveRole] = useState(null);
    const [reload, setReload] = useState(true)
    const [form, setForm] = useState({
        role_id: "",
        permissions: []
    });

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await getPermissions();
                if (res.data.code) {
                    setPermissionData(res.data.permissions);
                }
            } catch (err) {
                error(err.response?.data?.message);
            }
        };

        fetchApi();
    }, [reload]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await getListRoles();
                if (res.data.code) {
                    setRoles(res.data.roles);

                    if (res.data.roles.length > 0) {
                        setActiveRole(res.data.roles[0]);
                        setForm({
                            role_id: res.data.roles[0]._id,
                            permissions: res.data.roles[0].permissions || []
                        });
                    }
                }
            } catch (err) {
                error(err.response?.data?.message);
            }
        };

        fetchApi();
    }, [reload]);

    const handleChangeRole = (role) => {
        setActiveRole(role);
        setForm({
            role_id: role._id,
            permissions: role.permissions || []
        });
    };

    const handleChangePermission = (checked, value) => {
        setForm((prev) => {
            if (checked) {
                return {
                    ...prev,
                    permissions: prev.permissions.includes(value)
                        ? prev.permissions
                        : [...prev.permissions, value]
                };
            }

            return {
                ...prev,
                permissions: prev.permissions.filter((item) => item !== value)
            };
        });
    };

    const handleChangeAllPermissionInGroup = (checked, groupPermissions) => {
        const permissionValues = groupPermissions.map((item) => item.value);

        setForm((prev) => {
            if (checked) {
                return {
                    ...prev,
                    permissions: [...new Set([...prev.permissions, ...permissionValues])]
                };
            }

            return {
                ...prev,
                permissions: prev.permissions.filter(
                    (item) => !permissionValues.includes(item)
                )
            };
        });
    };

    const hanldeChange = async () => {
        try {
            const res = await changePermission(form);
            if(res.data.code){
                success(res.data.message)
                setReload(prev => !prev)
            }
        } catch (err) {
            error(err.response?.data?.message)
        }
    }
    return (
        <div className="permission-page">
            <SEO title="Phân quyền" />

            <div className="permission-page__head">
                <div>
                    <h2 className="permission-page__title">Phân Quyền</h2>
                    <p className="permission-page__desc">
                        Chọn role bên trái để cấu hình quyền thao tác trong hệ thống
                    </p>
                </div>
            </div>

            <div className="permission-layout">
                <div className="permission-sidebar">
                    <div className="permission-sidebar__top">
                        <div className="permission-search">
                            <SearchOutlined />
                            <input placeholder="Tìm role..." />
                        </div>
                    </div>

                    <div className="permission-role-list">
                        {roles.map((role) => (
                            <button
                                key={role._id}
                                className={`permission-role-item ${activeRole?._id === role._id ? "active" : ""}`}
                                onClick={() => handleChangeRole(role)}
                            >
                                <div className="permission-role-item__icon">
                                    <BsShieldLock />
                                </div>

                                <div className="permission-role-item__content">
                                    <h4>{role.title}</h4>
                                    <p>{role.slug}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="permission-content">
                    <div className="permission-content__header">
                        <div>
                            <h3>{activeRole?.title}</h3>
                            <p>Thiết lập danh sách quyền cho role: {activeRole?.slug}</p>
                        </div>

                        <button className="save-button" onClick={hanldeChange}>
                            <BsCheck2Square />
                            Lưu phân quyền
                        </button>
                    </div>

                    <div className="permission-group-list">
                        {permissionData.map((group) => {
                            const groupValues = group.permissions.map((item) => item.value);
                            const isCheckedAll =
                                groupValues.length > 0 &&
                                groupValues.every((value) =>
                                    form.permissions.includes(value)
                                );

                            return (
                                <div className="permission-group-card" key={group._id}>
                                    <div className="permission-group-card__header">
                                        <div className="permission-group-info">
                                            <h4>{group.title}</h4>
                                            <p>{group.description}</p>
                                        </div>

                                        <label className="permission-check permission-check--all">
                                            <input
                                                type="checkbox"
                                                checked={isCheckedAll}
                                                onChange={(e) =>
                                                    handleChangeAllPermissionInGroup(
                                                        e.target.checked,
                                                        group.permissions
                                                    )
                                                }
                                            />
                                            <span>Tất cả</span>
                                        </label>
                                    </div>

                                    <div className="permission-group-card__body">
                                        {group.permissions.map((item, index) => (
                                            <label className="permission-check" key={index}>
                                                <input
                                                    type="checkbox"
                                                    checked={form.permissions.includes(item.value)}
                                                    onChange={(e) =>
                                                        handleChangePermission(
                                                            e.target.checked,
                                                            item.value
                                                        )
                                                    }
                                                />
                                                <span>{item.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Permission;