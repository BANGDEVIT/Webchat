import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; // zodResolver kết nối zod với zod với react hook form
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";
// import { Input } from "@/components/ui/input";

const signUpschema = z.object({
  firstName: z.string().min(1, "Tên phải có ít nhất 1 ký tự."),
  lastName: z.string().min(1, "Họ phải có ít nhất 1 ký tự."),
  username: z.string().min(3, "Tài khoản phải có ít nhất 3 ký tự."),
  email: z.string().email("Email không hợp lệ"),
  password: z
    .string()
    .min(8, "Mật khẩu có ít nhất 8 ký tự")
    .regex(/[A-Z]/, "Mật khẩu phải có ký tự in hoa.")
    .regex(/[a-z]/, "Mật khẩu phải có ký tự in thường.")
    .regex(/[0-9]/, "Mật khẩu phải có ký số.")
    .regex(/[^A-Za-z0-9]/, "Mật khẩu phải có ký tự đặc biệt."),
});

type signUpFormValues = z.infer<typeof signUpschema>; // từ kiểu dữ liệu signUpschema tự suy ra kiểu signUpFormValues (ví dụ trong signUpschema có type của username là string => signUpFormValues có kiểu username là string)

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signUp } = useAuthStore();
  const navigate = useNavigate();
  // useForm là hook giúp ta lấy dữ liệu input, kiểm tra dữ liệu hợp lệ không rồi tới gửi form
  // zod kiểm tra dữ liệu
  // hook form kiểm tra trạng thái, sự kiện của form

  // register : hàm theo dõi giá trị của ô input
  // handleSubmit : hàm sẽ chạy khi người dùng bấm đăng kí
  // errors : chứa lỗi khi input không hợp lệ
  // isSubmitting : cho biết form khi nào form đang trong quá trình gửi dữ liệu
  // { resolver: zodResolver(signUpschema) } kết nói schema signUpschema
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<signUpFormValues>({ resolver: zodResolver(signUpschema) });

  const onSubmit = async (data: signUpFormValues) => {
    const { username, password, email, lastName, firstName } = data;
    // goi Backend để signup
    await signUp(firstName, lastName, username, email, password);
    navigate("/signin");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* header - logo */}
              <div className="flex flex-col gap-2 items-center text-center">
                <a href="/" className="mx-auto block w-fit text-center">
                  <img src="/logo.svg" alt="logo" />
                </a>
                <h1 className="text-2xl font-bold">Tạo tài khoản</h1>
                <p className="text-muted-foreground text-balance">
                  Chào mừng bạn! Hãy đăng ký để bắt đầu!
                </p>
              </div>
              {/* họ và tên */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="block text-sm">
                    Họ
                  </Label>
                  <Input
                    type="text"
                    id="lastName"
                    placeholder="Bui"
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className="text-destructive text-sm">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="block text-sm">
                    Tên
                  </Label>
                  <Input
                    type="text"
                    id="firstName"
                    placeholder="Bang"
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className="text-destructive text-sm">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
              </div>
              {/* username */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="username" className="block text-sm">
                  Tài khoản
                </Label>
                <Input
                  type="text"
                  id="username"
                  placeholder="buibang"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-destructive text-sm">
                    {errors.username.message}
                  </p>
                )}
              </div>
              {/* email */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="email" className="block text-sm">
                  Email
                </Label>
                <Input
                  type="text"
                  id="email"
                  autoComplete="email"
                  placeholder="buibang@gmail.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-destructive text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>
              {/* password */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="password" className="block text-sm">
                  Mật khẩu
                </Label>
                <Input
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-destructive text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* nút đăng ký  */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Tạo tài khoản
              </Button>

              <div className="text-center text-sm">
                Đã có tài khoản?{" "}
                <a href="/signin" className="underline underline-offset-4">
                  Đăng nhập
                </a>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholderSignUp.png"
              alt="Image"
              className="absolute top-1/2 -translate-y-1/2 object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-xs text-balance px-6 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:underline *:[a]:underline-offset-4">
        Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoảnh dịch vụ</a>{" "}
        và <a href="#">Chính sách bảo mật</a> của chính tôi.
      </div>
    </div>
  );
}
