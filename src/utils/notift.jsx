import toast from "react-hot-toast";
import Swal from "sweetalert2";

export const success = (message) => {
  toast.success(message);
};

export const error = (message) => {
  toast.error(message);
};

export const confirm = async (
  title = "Bạn chắc chắn?",
  text = "Không thể hoàn tác!"
) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Xác nhận",
    cancelButtonText: "Huỷ"
  });

  return result.isConfirmed;
};