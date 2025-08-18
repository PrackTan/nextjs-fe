import UserTable from "@/components/admin/user.table";
import { auth } from "@/auth";
import { sendRequest } from "@/utils/api";

interface IProduct {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}
// Component quản lý trang người dùng - là một async component của Next.js
const ManageUserPage = async (props: IProduct) => {
  // Lấy các tham số tìm kiếm từ URL (search params)
  const searchParams = await props.searchParams;

  // Xác định trang hiện tại, mặc định là trang 1 nếu không có trong URL
  const current = searchParams.current || 1;

  // Xác định số lượng item trên mỗi trang, mặc định là 10 nếu không có trong URL
  const pageSize = searchParams.pageSize || 10;

  // Debug: In ra các giá trị current và pageSize để kiểm tra
  //   console.log(">>>>>>>>>> DEBUG current:", current);
  //   console.log(">>>>>>>>>> DEBUG pageSize:", pageSize);

  // Lấy thông tin session của người dùng đang đăng nhập từ NextAuth
  const session = await auth();

  // Debug: In ra toàn bộ thông tin session dưới dạng JSON để kiểm tra
  console.log(">>>>>>>>>> DEBUG session:", JSON.stringify(session, null, 2));

  // Debug: In ra access token của user để kiểm tra xác thực
  console.log(
    ">>>>>>>>>> DEBUG access_token:",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (session?.user as any)?.access_token
  );

  // Debug: In ra URL backend để kiểm tra cấu hình môi trường
  console.log(">>>>>>>>>> BACKEND_URL:", process.env.NEXT_PUBLIC_BACKEND_URL);
  console.log(">>>>>>>>>> DEBUG queryParams:", { current, pageSize });

  // Gửi request API để lấy danh sách người dùng từ backend
  const res = await sendRequest<IBackendRes<IModelPaginate<IUser>>>({
    // URL API endpoint để lấy danh sách users (đang dùng localhost thay vì biến môi trường)
    url: `http://localhost:8000/api/v1/users`,
    method: "GET", // Phương thức HTTP GET để lấy dữ liệu

    // Truyền tham số phân trang qua query params
    queryParams: { current, pageSize },

    // Header chứa token xác thực để API backend kiểm tra quyền truy cập
    headers: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Authorization: `Bearer ${(session?.user as any)?.access_token}`,
    },

    // Cấu hình Next.js để cache kết quả với tag "list-users"
    // Giúp tối ưu hiệu suất và có thể invalidate cache khi cần
    nextOption: {
      next: { tags: ["list-users"] },
    },
  });

  // Debug: In ra response từ API để kiểm tra dữ liệu trả về
  console.log(">>>>>>>>>> check res from user page", res);

  // Render giao diện với component UserTable
  return (
    <div>
      {/* Truyền dữ liệu user vào UserTable component, 
          sử dụng optional chaining và nullish coalescing để tránh lỗi nếu data null/undefined */}
      <UserTable data={res?.data?.result ?? []} meta={res?.data?.meta} />
    </div>
  );
};

export default ManageUserPage;
